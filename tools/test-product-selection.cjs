const fs=require('node:fs'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const script=fs.readFileSync('src/catalog/products.js','utf8');
const pack='packages/product-catalog/2.6.0/components/';
const encode=value=>Buffer.from(JSON.stringify(value)).toString('base64url');
const products=['B','A','C'].map(id=>({id,name:'Product '+id,price:100,currency:'RSD','image-url':'/image.jpg',tags:[]}));
function mount(selection,items=products){
 const def=JSON.parse(fs.readFileSync(pack+(selection?'product-selection':'product-list')+'.json'));
 const settings=Object.fromEntries(Object.entries(def.settingsSchema.properties).filter(([,s])=>s.default!==undefined).map(([k,s])=>[k,s.default]));
 Object.assign(settings,{title:'Test',layout:'grid','columns-desktop':3,'columns-tablet':2,'columns-mobile':1,'show-brand':true,'show-category':true,'show-stock':true},def.settingsDefaults||{});
 const html=def.htmlContent.replace(/\{\{setting:([^}]+)\}\}/g,(_,key)=>String(settings[key]??''));
 const input={q:'',category:'all',page:1,limit:selection?3:24,sort:'default',filters:selection?[{field:'field1',values:['B','A','C']},{field:'discount',values:['active']}]:[],attributes:[],ranges:[]};
 const data={items,total:items.length,page:1,limit:input.limit,filters:{ordered:[]}};
 const host='<div class="wf-instance" data-wf-component="'+def.componentKey+'" data-wf-instance="test" data-wf-provider-url="/provider" data-wf-provider-base-input="'+encode(input)+'" data-wf-provider-input="'+encode(input)+'" data-wf-initial-data="'+encode(data)+'">'+html+'</div>';
 const dom=new JSDOM(host,{url:'https://shop.example/landing?q=unrelated&akcija=1',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window;
 const requests=[];w.scrollTo=()=>{};w.ElastycCommerce={mount(){}};w.ElastycCatalogOffers={load(){},cancel(){}};
 w.fetch=async url=>{requests.push(new URL(url));return {ok:true,json:async()=>({data})};};
 // The renderer supplies the provider payload through the standard initial binding.
 w.document.querySelector('.wf-instance').setAttribute('data-wf-initial-data',encode(data));
 return {dom,w,requests,root:w.document.querySelector('.wf-catalog'),input,data};
}
(async()=>{
 const selection=mount(true);selection.w.eval(script);await new Promise(r=>setImmediate(r));
 assert.deepEqual(Array.from(selection.root.querySelectorAll('[data-wf-item-id]')).map(n=>n.dataset.wfItemId),['B','A','C']);
 assert.equal(selection.root.hidden,false);assert.equal(selection.requests.length,0);assert.equal(selection.w.location.search,'?q=unrelated&akcija=1');
 selection.w.dispatchEvent(new selection.w.PopStateEvent('popstate'));assert.equal(selection.requests.length,0);
 assert.equal(selection.root.querySelector('[data-wf-discount-filter]').checked,true);assert.equal(selection.root.querySelector('[data-wf-discount-filter]').disabled,true);
 selection.dom.window.close();
 const empty=mount(true,[]);empty.w.eval(script);await new Promise(r=>setImmediate(r));assert.equal(empty.root.hidden,true);empty.dom.window.close();
 const catalog=mount(false);catalog.w.eval(script);await new Promise(r=>setImmediate(r));
 assert.equal(catalog.root.querySelector('[data-wf-discount-filter]').checked,true);
 const sale=catalog.root.querySelector('[data-wf-discount-filter]');sale.checked=false;sale.dispatchEvent(new catalog.w.Event('change',{bubbles:true}));await new Promise(r=>setImmediate(r));
 assert.equal(new URL(catalog.w.location.href).searchParams.has('akcija'),false);assert.equal(catalog.requests.length,1);
 const request=JSON.parse(Buffer.from(catalog.requests[0].searchParams.get('wf_input'),'base64url'));
 assert.equal(request.filters.some(f=>f.field==='discount'),false);assert.equal(request.page,1);
 catalog.dom.window.close();console.log('PASS selection order, independent URL state, empty section and action filter/reset behavior');
})().catch(error=>{console.error(error);process.exitCode=1;});
