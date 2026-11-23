const fs=require('node:fs'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const def=JSON.parse(fs.readFileSync('src/chrome/navigation.json','utf8')),script=fs.readFileSync('src/chrome/navigation.js','utf8');
let checks=0;
for(const search of ['menu','row']){
 const html=def.htmlContent.replace(/\{\{setting:([^}]+)\}\}/g,(_,key)=>key==='search-mode'?search:def.settingsSchema.properties[key]?.default||'Meni').replace('{{navigation:items}}','<li><a href="/katalog">Katalog</a></li>');
 const d=new JSDOM('<header data-wf-header><div class="wfcr-header"><div class="wfcr-search"><div class="wf-slot"><input type="search" aria-label="Pretraga"></div></div>'+html+'</div></header><main>Catalog</main>',{url:'https://shop.example/katalog',runScripts:'outside-only'}),w=d.window;
 w.matchMedia=()=>({matches:true,addEventListener(){}});w.scrollTo=()=>{};w.fetch=async()=>({ok:true,json:async()=>({authenticated:false})});
 w.eval(script);const nav=w.document.querySelector('.wfmenu-nav'),drawer=nav.querySelector('[data-wfmenu-drawer]');
 assert.equal(w.document.querySelector('.wfcr-header').dataset.searchMode,search);checks++;
 assert.equal(nav.querySelector('[data-wfmenu-search-slot]').contains(w.document.querySelector('input')),search==='menu');checks++;
 nav.querySelector('[data-wfmenu-toggle]').click();assert.equal(drawer.hidden,false);assert.equal(w.document.body.style.position,'fixed');assert.equal(w.document.querySelector('main').inert,true);checks+=3;
 w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(drawer.hidden,true);assert.equal(w.document.body.style.position,'');checks+=2;d.window.close();
}
console.log('PASS '+checks+' shared navigation checks');
