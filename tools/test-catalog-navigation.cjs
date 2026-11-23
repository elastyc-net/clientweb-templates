const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const definition=JSON.parse(fs.readFileSync(path.join(__dirname,'../packages/product-catalog/2.3.3/components/product-list.json'),'utf8'));
const script=fs.readFileSync(path.join(__dirname,'../src/catalog/products.js'),'utf8');
const tick=async()=>{for(let n=0;n<8;n++)await new Promise(r=>setTimeout(r,0));};
const data={items:[{id:'P',name:'Parket',price:120,currency:'RSD',category:'Parketi','image-url':'/p.jpg'}],total:1,page:1,limit:24,filters:{ordered:[{kind:'attribute',name:'Boja',label:'Boja',values:[{value:'Crna',label:'Crna',count:1}]}]}};
const input={category:'Parketi',limit:24};
let checks=0;
async function fixture(type,{legacy=false,denied=false}={}){
 const settings={title:'Parketi',layout:'grid','columns-desktop':3,'columns-tablet':2,'columns-mobile':1,'image-ratio':'1/1','price-filter-mode':'inputs'};
 const html=definition.htmlContent.replace(/\{\{setting:([^}]+)\}\}/g,(_,key)=>String(settings[key]??definition.settingsSchema.properties[key]?.default??false));
 const enc=v=>Buffer.from(JSON.stringify(v)).toString('base64url');
 const dom=new JSDOM('<div class="wf-instance" data-wf-component="product-list" data-wf-page="/parketi" data-wf-instance="list" data-wf-initial-data="'+enc(data)+'" data-wf-provider-input="'+enc(input)+'" data-wf-provider-base-input="'+enc(input)+'" data-wf-provider-url="/provider">'+html+'</div>',{url:'https://example.test/parketi',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window,calls=[];
 Object.defineProperty(w.document.documentElement,'scrollHeight',{value:2500});
 w.scrollTo=(x,y)=>calls.push([x,y]);
 w.fetch=async()=>({ok:true,json:async()=>({data})});
 if(legacy){Object.defineProperty(w.performance,'navigation',{value:{type:type==='back_forward'?2:0}});}
 else w.performance.getEntriesByType=()=>[{type}];
 w.sessionStorage.setItem('wf-catalog-scroll:/parketi#list:Parketi','900');
 if(denied)Object.defineProperty(w,'sessionStorage',{get(){throw new Error('Denied');}});
 w.eval(script);await tick();
 return {dom,w,calls};
}
(async()=>{
 for(const type of ['navigate','reload']){
  const f=await fixture(type);try{assert.equal(f.calls.length,0,'A new visit/reload must not jump to the previous visit');checks++;}finally{f.dom.window.close();}
 }
 for(const legacy of [false,true]){
  const f=await fixture('back_forward',{legacy});try{assert.deepEqual(f.calls,[[0,900]],'History navigation restores the saved catalog position');checks++;}finally{f.dom.window.close();}
 }
 const denied=await fixture('back_forward',{denied:true});try{assert.equal(denied.calls.length,0);assert.equal(denied.w.document.querySelectorAll('.wf-product').length,1);checks++;}finally{denied.dom.window.close();}
 const f=await fixture('navigate');try{
  const button=f.w.document.querySelector('[data-wf-filters-toggle]');
  assert(button.querySelector('svg'));assert(button.closest('.wf-catalog__header'));checks++;
  f.w.document.querySelector('input[data-wf-filter-kind]').click();await tick();
  assert(button.querySelector('svg'),'Updating active filter count must retain the icon');
  assert.equal(button.querySelector('[data-wf-filter-label]').textContent,'Filteri (1)');checks++;
  button.click();assert.equal(button.getAttribute('aria-expanded'),'true');button.click();assert.equal(button.getAttribute('aria-expanded'),'false');checks++;
 }finally{f.dom.window.close();}
 console.log('Catalog navigation and filter control: '+checks+' checks passed.');
})().catch(e=>{console.error(e);process.exitCode=1;});
