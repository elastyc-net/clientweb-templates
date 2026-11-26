const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const script=['guest-cart.js','commerce.js'].map(p=>fs.readFileSync(path.join(__dirname,'../src/commerce',p),'utf8')).join('\n');
const tick=async()=>{for(let i=0;i<18;i++)await new Promise(r=>setTimeout(r,0));};
let checks=0;function check(v,m){assert(v,m);checks++;}
const paths={catalog:'/katalog',product:'/proizvod',cart:'/korpa',checkout:'/porudzbina',favorites:'/favoriti',request:'/upit',account:'/nalog'};
const base={revision:0,lines:[],favorites:[],cartCount:0,favoriteCount:0,favoritesEnabled:true,guestCheckout:false,authenticated:false,mergeAvailable:false,preview:false,paths,customer:{contact:{},addresses:[]},deliveryOptions:[],pickupOptions:[],paymentOptions:[]};
const product={id:'A','variant-count':0,variants:[],unit:'KOM','commerce-known':true,'ordering-mode':'Dozvoljeno','stock-known':true,stock:10,'price-known':true,price:100,currency:'RSD'};
async function fixture(options={}){
 const view=options.view||'catalog',bootstrap={version:1,siteKey:'local-test',channel:'production',authenticated:false,legacyKey:options.legacyKey||'',retentionDays:30,state:structuredClone(base)};
 if(options.inactive)bootstrap.state.inactiveProductIds=options.inactive;
 const encoded=Buffer.from(JSON.stringify(bootstrap)).toString('base64url');
 const html='<span data-wf-cart-count>0</span><span data-wf-favorite-count>0</span><div data-wf-commerce-url="/api?channel=production" data-wf-commerce-bootstrap="'+encoded+'"></div>'+(view==='catalog'?'<div class="wf-instance"><section class="wf-catalog" data-commerce-enabled="true" data-list-cart-enabled="true"><article data-wf-item-id="A"></article></section></div>':'<section><div data-wf-shop-view="'+view+'"></div></section>');
 const extra=options.extraView?'<section><div data-wf-shop-view="'+options.extraView+'"></div></section>':'';
 const dom=new JSDOM(html+extra,{url:'https://shop.example/'+view,runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,calls=[],waiting=[];
 w.TextEncoder=TextEncoder;w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
 w.BroadcastChannel=class{postMessage(){}};
 let logged=false,price=100,revision=0,accountLines=[],accountFavorites=[],mergeAvailable=!!options.legacyKey;
 if(options.saved)w.localStorage.setItem('wf-guest-cart-v1:local-test:production',options.saved);
 if(options.blockStorage)Object.defineProperty(w,'localStorage',{get(){throw new Error('Blocked');}});
 w.fetch=async(url,opts={})=>{
  const u=new URL(url),body=opts.body?JSON.parse(opts.body):null,operation=body&&body.action||u.searchParams.get('operation');calls.push({operation,body,url:u});
  let payload={ok:true};
  if(operation==='guest-export')payload.selection=options.legacy||{lines:[],favorites:[]};
  else if(operation==='guest-preview')payload.state={...structuredClone(base),cartCount:body.lines.length,favoriteCount:body.favorites.length,lines:body.lines.map(l=>({...l,name:'Current A',eligible:true,action:'buy',priceKnown:true,unitPrice:String(price),currency:'RSD',quantity:l.quantity,total:String(price*Number(l.quantity)),unit:'KOM',issue:''})),favorites:body.favorites.map(p=>({productId:p,name:'Current favorite'})),totals:{net:'100',tax:'20',gross:String(price),currency:'RSD',complete:true}};
  else if(operation==='import'||operation==='sync-local'){
   revision++;mergeAvailable=false;accountLines=body.lines;accountFavorites=body.favorites.map(p=>({productId:p}));payload.imported=true;
   payload.state={...structuredClone(base),revision,authenticated:logged,view:view==='catalog'?'catalog':undefined,lines:accountLines,cartCount:accountLines.length,favorites:accountFavorites,favoriteCount:accountFavorites.length};payload.csrf='a'.repeat(64);
  }else if(operation==='local-state'||operation==='state'){
   payload.state={...structuredClone(base),revision,authenticated:logged,mergeAvailable:logged&&mergeAvailable,view:view==='catalog'?'catalog':undefined,lines:accountLines,favorites:accountFavorites};
   if(!logged&&operation==='local-state')payload.localGuest=true;else payload.csrf='a'.repeat(64);
  }else throw new Error('Unexpected call: '+operation);
  if(operation==='guest-preview'&&options.deferPreview)return new Promise(resolve=>waiting.push(Object.assign(()=>resolve({ok:true,status:200,json:async()=>structuredClone(payload)}),{fail:()=>resolve({ok:false,status:503,json:async()=>({ok:false,message:'Preview unavailable'})})})));
  return {ok:true,status:200,json:async()=>structuredClone(payload)};
 };
 w.eval(script);w.document.dispatchEvent(new w.Event('DOMContentLoaded'));await tick();
 const host=w.document.querySelector('.wf-instance');if(host)w.ElastycCommerce.mount(host,[structuredClone(product)]);await tick();
 return {w,dom,calls,host,release:()=>waiting.shift()(),fail:()=>waiting.shift().fail(),logged:()=>{logged=true;},price:v=>{price=v;},saved:()=>w.localStorage.getItem('wf-guest-cart-v1:local-test:production')};
}
(async()=>{
 const f=await fixture();let saved;
 try{
  check(f.calls.length===0,'A fresh guest opens the catalog with no commerce state or session request.');
  f.host.querySelector('.wf-shop-heart').click();await tick();
  check(f.calls.length===0&&f.w.document.querySelector('[data-wf-favorite-count]').textContent==='1','A local favorite immediately changes its header badge without SQL/network.');
  f.host.querySelector('.wf-shop-btn').click();await tick();f.host.querySelector('.wf-shop-btn').click();await tick();
  check(f.calls.length===0&&f.w.document.querySelector('[data-wf-cart-count]').textContent==='1','Local additions update one cart-line badge without creating a server session.');
  const doc=JSON.parse(f.saved());check(doc.lines[0].quantity==='2.000'&&!JSON.stringify(doc).includes('unitPrice')&&!JSON.stringify(doc).includes('csrf'),'The saved selection contains quantity and IDs, never confirmed prices or CSRF.');
  for(let i=0;i<5;i++)f.w.dispatchEvent(new f.w.Event('focus'));await tick();check(f.calls.length===0,'Catalog focus does not refresh local guest counters.');saved=f.saved();
  f.logged();await f.w.ElastycCommerce.authChanged(false);await tick();
  const imports=f.calls.filter(c=>c.operation==='import');check(imports.length===1&&imports[0].body.lines[0].quantity==='2.000'&&imports[0].body.favorites[0]==='A','Verified login imports the exact local selection once through the existing mutation protocol.');
  check(f.w.document.querySelector('[data-wf-favorite-count]').textContent==='1'&&JSON.parse(f.saved()).lines.length===0,'Server badges remain accurate and acknowledged imported local lines are consumed.');
 }finally{f.dom.window.close();}
 const reload=await fixture({saved});try{check(reload.calls.length===0&&reload.w.document.querySelector('[data-wf-cart-count]').textContent==='1'&&reload.host.querySelector('.wf-shop-heart').getAttribute('aria-pressed')==='true','Guest selection and favorite survive a reload without a state request.');}finally{reload.dom.window.close();}
 const inactive=await fixture({saved,inactive:['A']});try{check(JSON.parse(inactive.saved()).lines.length===0&&JSON.parse(inactive.saved()).favorites.length===0,'Confirmed inactive IDs are removed from both local selections.');check(inactive.calls.length===0&&inactive.w.document.querySelector('[data-wf-cart-count]').textContent==='0'&&inactive.w.document.querySelector('[data-wf-favorite-count]').textContent==='0','Inactivity cleanup updates both badges without another server state request.');}finally{inactive.dom.window.close();}
 const cart=await fixture({saved,view:'cart'});try{
  check(cart.calls.length===1&&cart.calls[0].operation==='guest-preview','Opening the guest cart makes one grouped read-only repricing request.');
  check(cart.calls[0].url.searchParams.get('wf_commerce_view')==='cart'&&cart.calls[0].body.favorites.length===0,'Guest cart requests its own contract without favorite product hydration.');
  check(cart.w.document.querySelector('[data-wf-shop-view]').textContent.includes('Current A'),'Cart details come from the server, not browser supplied labels.');
  cart.price(150);cart.w.document.querySelector('input').value='3';cart.w.document.querySelector('button').click();await tick();
  check(cart.calls.every(c=>c.operation==='guest-preview')&&cart.w.document.querySelector('[data-wf-shop-view]').textContent.includes('450,00'),'A quantity edit stays local and the server recalculates current totals.');
 }finally{cart.dom.window.close();}

 const loading=await fixture({saved,view:'cart',deferPreview:true});try{
  const root=loading.w.document.querySelector('[data-wf-shop-view]');
  check(!!root.querySelector('.wf-shop-loading')&&!root.textContent.includes('Cena na upit'),'Initial guest cart waits for real names/prices instead of displaying raw placeholders as final data.');
  check(root.querySelectorAll('.wf-shop-loading__row').length===1,'A one-item local cart shows one placeholder instead of three unrelated rows.');
  loading.release();await tick();check(root.textContent.includes('Current A')&&!root.querySelector('.wf-shop-loading'),'Grouped preview replaces the pending cart with current data.');
  loading.price(150);root.querySelector('input').value='3';root.querySelector('button').click();await tick();
  check(root.textContent.includes('Current A')&&root.getAttribute('aria-busy')==='true'&&!root.textContent.includes('Cena na upit'),'A pending quantity edit preserves the last valid product display.');
  loading.release();await tick();check(root.textContent.includes('450,00')&&root.getAttribute('aria-busy')==='false','Repriced local quantity ends its pending state.');
  root.querySelector('input').value='4';root.querySelector('button').click();await tick();loading.fail();await tick();
  check(root.textContent.includes('Current A')&&!!root.querySelector('[role=alert]')&&root.getAttribute('aria-busy')==='false','A failed refresh preserves confirmed rows and clearly marks stale data.');
  root.querySelector('[data-wf-shop-read-error] button').click();await tick();
  check(!root.querySelector('[role=alert]')&&root.textContent.includes('Current A'),'Retry retains the existing cart while clearing its previous error.');
  loading.release();await tick();check(root.textContent.includes('600,00')&&!root.querySelector('[data-wf-shop-read-error]'),'Successful retry replaces old totals and removes the failure message.');
 }finally{loading.dom.window.close();}
 const justCart=JSON.parse(saved);justCart.favorites=[];
 const emptyFavorites=await fixture({saved:JSON.stringify(justCart),view:'favorites'});try{
  check(emptyFavorites.calls.length===0,'Empty favorites do not wait for a preview merely because the cart contains a product.');
  check(!emptyFavorites.w.document.querySelector('.wf-shop-loading'),'An empty favorite list finishes its loading immediately.');
 }finally{emptyFavorites.dom.window.close();}
 const combined=await fixture({saved,view:'cart',extraView:'favorites'});try{
  check(combined.calls.length===1&&combined.calls[0].body.lines.length===1&&combined.calls[0].body.favorites.length===1&&!combined.calls[0].url.searchParams.has('wf_commerce_view'),'A combined guest composition hydrates both lists in one complete preview.');
  check(combined.w.document.querySelector('[data-wf-shop-view="cart"]').textContent.includes('Current A')&&combined.w.document.querySelector('[data-wf-shop-view="favorites"]').textContent.includes('Current favorite'),'Combined guest lists render both confirmed product sets.');
 }finally{combined.dom.window.close();}
 const migration=await fixture({legacyKey:'b'.repeat(64),legacy:{lines:[{lineId:'c'.repeat(32),productId:'A',variantId:'',quantity:'4.000'}],favorites:['A']}});let migrated;
 try{check(migration.calls.filter(c=>c.operation==='guest-export').length===1&&JSON.parse(migration.saved()).lines[0].quantity==='4.000','An existing owned server guest selection migrates once without deletion.');migrated=migration.saved();migration.logged();await migration.w.ElastycCommerce.authChanged(false);await tick();check(!migration.calls.some(c=>c.operation==='resume')&&migration.calls.filter(c=>c.operation==='import').length===1&&migration.calls.find(c=>c.operation==='import').body.legacyKey==='b'.repeat(64),'Login imports a migrated guest source once, without also resuming its retained server copy.');}finally{migration.dom.window.close();}
 const again=await fixture({saved:migrated,legacyKey:'b'.repeat(64)});try{check(again.calls.length===0&&JSON.parse(again.saved()).lines[0].quantity==='4.000','The same server session is not exported or added again after reload.');}finally{again.dom.window.close();}
 const blocked=await fixture({blockStorage:true});try{blocked.host.querySelector('.wf-shop-btn').click();await tick();blocked.host.querySelector('.wf-shop-btn').click();await tick();check(blocked.calls.length===0&&blocked.w.document.querySelector('[data-wf-cart-count]').textContent==='1'&&blocked.w.document.querySelector('[data-wf-commerce-notice]').textContent.includes('dodat'),'Blocked browser storage keeps a working in-memory selection.');}finally{blocked.dom.window.close();}
 const large={version:1,revision:1,operationKey:'e'.repeat(32),expiresAt:Date.now()+86400000,migrated:[],pending:null,lines:[],favorites:[]};
 for(let n=0;n<100;n++){const p='P'+String(n).padStart(3,'0')+'x'.repeat(76);large.lines.push({lineId:n.toString(16).padStart(32,'0'),productId:p,variantId:'V'+String(n).padStart(3,'0')+'y'.repeat(76),quantity:'1.000'});large.favorites.push(p);}
 const max=await fixture({saved:JSON.stringify(large)});let pendingLarge;try{const adapter=max.w.ElastycGuestCart.create({siteKey:'local-test',channel:'production',retentionDays:30,legacyKey:''},()=>{},()=>{});adapter.pending();pendingLarge=max.saved();check(pendingLarge.length>65536,'Maximum-length selections exercise the persisted import journal above 64 KiB.');}finally{max.dom.window.close();}
 const maxReload=await fixture({saved:pendingLarge});try{check(maxReload.w.document.querySelector('[data-wf-cart-count]').textContent==='100'&&JSON.parse(maxReload.saved()).pending.lines.length===100,'All 100 maximum-length lines and their import journal survive reload intact.');}finally{maxReload.dom.window.close();}
 const checkout=await fixture({saved,view:'checkout'});try{check(checkout.calls.map(c=>c.operation).join(',')==='state,sync-local','Checkout establishes the existing CSRF session and synchronizes one owned server draft.');check(!checkout.calls.some(c=>['quote','submit','payment-start'].includes(c.operation)),'Checkout initialization never places an order or starts payment.');}finally{checkout.dom.window.close();}
 console.log('Guest-local commerce: '+checks+' checks passed.');
})().catch(error=>{console.error(error);process.exitCode=1;});
