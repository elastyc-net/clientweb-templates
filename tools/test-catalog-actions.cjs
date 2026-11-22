const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM}=require('jsdom');
const script=fs.readFileSync(require('node:path').join(__dirname,'../src/commerce/commerce.js'),'utf8');
const tick=async()=>{for(let n=0;n<12;n++)await new Promise(r=>setTimeout(r,0));};
const product={id:'P',name:'Tepih',price:100,currency:'RSD',unit:'KOM','stock-known':true,stock:5,'ordering-mode':'Ponuda kad nije dostupno','commerce-known':true,variants:[{id:'row:1',label:'Crna'},{id:'row:2',label:'Bela'}]};
let checks=0;function check(v,message){assert(v,message);checks++;}
async function fixture(detail=false,display='Lista'){
 const html='<div data-wf-commerce-url="/api?channel=production"></div><span data-wf-cart-count></span><div class="wf-instance">'+(detail?'<article class="wf-detail" data-commerce-enabled="true" data-variant-display="'+display+'"><div data-wf-item-id="P"><div class="wf-detail__layout"><div class="wf-detail__summary"></div></div></div></article>':'<section class="wf-catalog" data-commerce-enabled="true" data-list-variants="detail" data-detail-url="/proizvod"><article class="wf-product" data-wf-item-id="P"></article></section>')+'</div>';
 const dom=new JSDOM(html,{url:'https://megapod.example/katalog',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,requests=[];
 let state={view:'catalog',revision:0,lines:[],cartCount:0,favorites:[],favoritesEnabled:true,authenticated:false,mergeAvailable:false,preview:false,paths:{product:'/proizvod',cart:'/korpa',request:'/upit',favorites:'/favoriti',account:'/nalog'}};
 w.fetch=async(url,options={})=>{
  const u=new URL(url),body=options.body?JSON.parse(options.body):null,op=body?body.action:u.searchParams.get('operation');requests.push({op,body,url:u});
  let data={ok:true,csrf:'x'.repeat(64)};
  if(op==='variants')data.variants=product.variants.map((v,i)=>({productId:'P',variantId:v.id,variantLabel:v.label,eligible:true,orderingMode:product['ordering-mode'],unit:'KOM',action:i?'inquiry':'buy',stockKnown:true,stock:i?0:5,priceKnown:true,unitPrice:i?'120':'100',currency:'RSD',issue:''}));
  else if(op==='selection')data.selection={orderingMode:product['ordering-mode'],priceKnown:true,unitPrice:'100',regularPrice:100,discountPercent:0,currency:'RSD',unit:'KOM',stockKnown:true,stock:5};
  else if(op==='add'){state.revision++;state.cartCount++;}
  else if(op==='favorite'){state.revision++;state.favorites=body.selected?[{productId:body.productId}]:[];}
  if(op!=='variants')data.state=structuredClone(state);
  return {ok:true,status:200,json:async()=>data};
 };
 w.eval(script);w.document.dispatchEvent(new w.Event('DOMContentLoaded'));await tick();
 const host=w.document.querySelector('.wf-instance');w.ElastycCommerce.mount(host,[structuredClone(product)]);await tick();return {dom,w,host,requests,state};
}
(async()=>{
 const a=await fixture();try{
  check(a.requests[0].url.searchParams.get('wf_commerce_view')==='catalog','Catalog uses the compact owned read model.');
  check(!a.host.querySelector('select'),'Category cards never render inline variant selectors.');
  check(a.host.querySelector('a.wf-shop-btn').getAttribute('href')==='/proizvod?id=P','A variant parent links to its detail.');
  check(!a.requests.some(r=>r.op==='variants'||r.op==='selection'),'Category display does not resolve variant pricing.');
  a.host.querySelector('.wf-shop-heart').click();await tick();check(a.host.querySelector('.wf-shop-heart').getAttribute('aria-pressed')==='true','Favorite works independently of variant selection.');
 }finally{a.dom.window.close();}
 const b=await fixture(true);try{
  const list=b.host.querySelector('[data-wf-variant-list]'),rows=list.querySelectorAll('[role=listitem]');
  check(b.requests.filter(r=>r.op==='variants').length===1 && rows.length===2,'Detail resolves all variants in one bounded batch.');
  check(!b.host.querySelector('select') && !b.host.querySelector('.wf-detail__summary .wf-shop-btn'),'List mode has no selector or parent add button.');
  check(rows[0].textContent.includes('100,00') && rows[1].textContent.includes('120,00'),'Variant rows use their own server prices.');
  check(rows[1].querySelector('button').textContent==='Pošalji upit','Unavailable variant follows its own server ordering policy.');
  const qty=rows[0].querySelector('input');qty.value='2';const add=rows[0].querySelector('button');add.click();
  check(add.getAttribute('aria-busy')==='true','Add exposes visible and accessible pending state.');await tick();
  const mutation=b.requests.find(r=>r.op==='add');check(mutation.body.productId==='P'&&mutation.body.variantId==='row:1'&&mutation.body.quantity==='2','A row adds the precise selected variant and quantity.');
  check(b.w.document.querySelector('[data-wf-cart-count]').textContent==='1','Compact mutation updates the real cart count.');
  check(rows[0].textContent.includes('Dodato u korpu.') && qty.value==='2','Unrelated cart updates preserve the variant row, quantity and local success.');
  b.w.ElastycCommerce.mount(b.host,[]);await tick();check(b.requests.filter(r=>r.op==='variants').length===1 && b.host.querySelector('[data-wf-variant-list]')===list,'State rendering reuses the fetched list and its controls.');
 }finally{b.dom.window.close();}
 const c=await fixture(true,'Izbor');try{
  const select=c.host.querySelector('select');check(!!select&&!c.requests.some(r=>r.op==='variants'),'Choice mode keeps the existing selection flow.');
  select.value='row:2';select.dispatchEvent(new c.w.Event('change',{bubbles:true}));await tick();
  check(c.host.querySelector('select').value==='row:2'&&!c.host.querySelector('.wf-shop-btn').disabled,'A server-confirmed choice is preserved and becomes actionable.');
 }finally{c.dom.window.close();}
 console.log('Catalog actions: '+checks+' checks passed.');
})().catch(e=>{console.error(e);process.exitCode=1;});
