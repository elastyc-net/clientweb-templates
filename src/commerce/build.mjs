// Reproducible, unpublished commerce release. Never run against a released version.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
for(const release of ['packages/product-catalog/2.0.0/manifest.json','packages/webfront-commerce/1.0.0/manifest.json']){if(spawnSync('git',['ls-files','--error-unmatch',release],{cwd:root,stdio:'ignore'}).status===0)throw new Error('Immutable release is tracked. Bump the version and target paths before building: '+release);}
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const write=(p,value)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),JSON.stringify(value,null,2)+'\n');};
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const js=fs.readFileSync(path.join(root,'src/commerce/commerce.js'),'utf8');
const css=fs.readFileSync(path.join(root,'src/commerce/commerce.css'),'utf8');
const paths={catalog:'/katalog',product:'/proizvod',cart:'/korpa',checkout:'/porudzbina',favorites:'/favoriti',request:'/upit-za-ponudu',account:'/nalog'};
const properties={title:{type:'string',minLength:1,maxLength:160}};
for(const key of Object.keys(paths))properties[key+'-url']={type:'string',minLength:1,maxLength:256};
Object.assign(properties,{'guest-checkout':{type:'boolean'},'favorites-enabled':{type:'boolean'},'guest-retention-days':{type:'integer',minimum:1,maximum:90},'profile-key':{type:'string',minLength:1,maxLength:63}});
const defaults={title:'',...Object.fromEntries(Object.entries(paths).map(([key,value])=>[key+'-url',value])),'guest-checkout':true,'favorites-enabled':true,'guest-retention-days':30,'profile-key':'default'};
Object.assign(properties.title,{title:'Naslov'});
for(const [key,label] of Object.entries({catalog:'Adresa kataloga',product:'Adresa detalja proizvoda',cart:'Adresa korpe',checkout:'Adresa porudžbine',favorites:'Adresa favorita',request:'Adresa upita za ponudu',account:'Adresa naloga'}))properties[key+'-url'].title=label;
Object.assign(properties['guest-checkout'],{title:'Dozvoli poručivanje bez naloga'});
Object.assign(properties['favorites-enabled'],{title:'Omogući favorite'});
Object.assign(properties['guest-retention-days'],{title:'Čuvanje korpe gosta (dana)',description:'Period neaktivnosti posle kog ističe pristup korpi gosta.'});
Object.assign(properties['profile-key'],{title:'Poslovni profil',description:'Podrazumevani profil je povezan sa postojećim podešavanjima e-trgovine.'});
const cartSvg='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 3h2l2.4 12h11.2L21 7H6M9 21h.01M18 21h.01"/></svg>';
const heartSvg='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg>';
const commerceItems=[];
for(const [key,label] of Object.entries({shell:'Korpa i favoriti',cart:'Korpa',checkout:'Porudžbina',request:'Upit za ponudu',favorites:'Favoriti',account:'Moj nalog'})){
 const componentKey='commerce-'+key;
 const component={formatVersion:2,contractVersion:1,componentKey,label,category:'commerce',renderMode:'static',targets:['web','mobile'],
 htmlContent:key==='shell'?'<nav class="wf-shop-shell" aria-label="Kupovina"><a href="{{setting:favorites-url}}" data-wf-favorites-link aria-label="Favoriti">'+heartSvg+'</a><a href="{{setting:cart-url}}" data-wf-cart-link aria-label="Korpa">'+cartSvg+'<span data-wf-cart-label>Korpa</span><span data-wf-cart-count>0</span></a></nav>':'<section class="wf-shop"><h1>{{setting:title}}</h1><div data-wf-shop-view="'+key+'"><p class="wf-shop-help" role="status">Učitavanje…</p></div></section>',
 styles:[{name:'commerce.css',content:css}],scripts:[{name:'commerce.js',content:js}],settingsSchema:{type:'object',additionalProperties:false,required:['title',...Object.keys(defaults).filter(x=>x!=='title')],properties},settingsDefaults:{...defaults,title:label},providerKey:null,cache:{scope:'none',ttlSeconds:0,varyBy:[]},access:{visibility:'public',permissions:[]},seo:{mode:'none'}};
 if(key==='account'){
  component.scripts.unshift({name:'front-auth.js',content:fs.readFileSync(path.join(root,'../common/Elastyc/FrontAuth/front-auth.js'),'utf8')});
  component.styles.unshift({name:'front-auth.css',content:fs.readFileSync(path.join(root,'../common/Elastyc/FrontAuth/front-auth.css'),'utf8')});
 }
 if(key!=='shell'){
  component.settingsSchema={type:'object',additionalProperties:false,required:['title'],properties:{title:properties.title}};
  component.settingsDefaults={title:label};
 }
 const relative='components/'+componentKey+'.json';write('packages/webfront-commerce/1.0.0/'+relative,component);commerceItems.push({itemType:'component',itemKey:componentKey,path:relative});
 if(key!=='shell'){
 const template={formatVersion:2,contractVersion:1,pageTemplateKey:componentKey,label,layoutKey:'starter-layout',targets:['web','mobile'],access:{visibility:'public',permissions:[]},metadataDefaults:{title:label,description:''},regions:{main:[{instanceKey:componentKey+'-main',componentKey,settings:{title:label}}]}};
 const relative='page-templates/'+componentKey+'.json';write('packages/webfront-commerce/1.0.0/'+relative,template);commerceItems.push({itemType:'page-template',itemKey:componentKey,path:relative});
 }
}
function manifest(key,version,label,description,dependencies,items){const base='packages/'+key+'/'+version;items=items.map(item=>({...item,sha256:sha(base+'/'+item.path)}));const value={formatVersion:1,packageKey:key,version,label,description,distribution:'optional',minimumContractVersion:1,dependencies,items};write(base+'/manifest.json',value);return{packageKey:key,version,manifest:key+'/'+version+'/manifest.json',sha256:sha(base+'/manifest.json')};}
const commerce=manifest('webfront-commerce','1.0.0','Korpa, favoriti i poručivanje','Novi serverski tokovi gosta i naloga, korpa, direktan upit i narudžbina.',[{packageKey:'starter-site',minimumVersion:'1.0.0'}],commerceItems);
const old=read('packages/product-catalog/1.3.2/manifest.json');
for(const item of old.items){
 const definition=read('packages/product-catalog/1.3.2/'+item.path);
 if(item.itemType==='component'){
  definition.settingsSchema.properties['commerce-enabled']={type:'boolean',title:'Omogući kupovinu i upite',description:'Koristi zajedničku korpu, favorite i poslovni profil sajta.'};definition.settingsDefaults={...definition.settingsDefaults,'commerce-enabled':false};
  definition.htmlContent=definition.htmlContent.replace('data-offers-feedback=','data-commerce-enabled="{{setting:commerce-enabled}}" data-offers-feedback=');
  definition.styles.push({name:'commerce.css',content:css});definition.scripts.unshift({name:'commerce.js',content:js});
  for(const script of definition.scripts){
   if(script.name==='products.js'){
    script.content=script.content.replace('scheduleOffers(data.items||[]);','if(window.ElastycCommerce)window.ElastycCommerce.mount(host,data.items||[]);scheduleOffers(data.items||[]);');
    script.content=script.content.replace('maybeRestoreScroll();scheduleOffers(data.items||[]);','maybeRestoreScroll();if(window.ElastycCommerce)window.ElastycCommerce.mount(host,data.items||[]);scheduleOffers(data.items||[]);');
   }
   if(script.name==='product.js')script.content=script.content.replaceAll('scheduleOffers([data].concat(others));','if(window.ElastycCommerce)window.ElastycCommerce.mount(host,[data]);scheduleOffers([data].concat(others));').replace('scheduleOffers([initial].concat(initial.related||[]));','if(window.ElastycCommerce)window.ElastycCommerce.mount(host,[initial]);scheduleOffers([initial].concat(initial.related||[]));');
   if(script.name==='catalog-offers.js')script.content=script.content.replace('function apply(root,item,state){','function apply(root,item,state){\nif(global.ElastycCommerce&&global.ElastycCommerce.applyOffers(root,item)===false)return;').replace('global.ElastycCatalogOffers={load:load,cancel:cancel};','global.ElastycCatalogOffers={load:load,cancel:cancel,apply:function(root,item){apply(root,item,{unknown:false});}};').replace('if(!flag(root,"showPrice",true)&&!flag(root,"showStock",true)&&!flag(root,"showDiscountBadge",true))return;','if(root.dataset.commerceEnabled!=="true"&&!flag(root,"showPrice",true)&&!flag(root,"showStock",true)&&!flag(root,"showDiscountBadge",true))return;');
  }
 }
 if(item.itemType==='provider'&&['catalog-products','catalog-product','catalog-offers'].includes(item.itemKey)){
   const p=item.itemKey!=='catalog-product'?definition.outputSchema.properties.items.items.properties:definition.outputSchema.properties;
   p['ordering-mode']={type:'string',maxLength:80};p.unit={type:'string',maxLength:20};
   p['commerce-known']={type:'boolean'};
   p.variants={type:'array',maxItems:100,items:{type:'object',additionalProperties:false,required:['id','label'],properties:{id:{type:'string',minLength:1,maxLength:80},label:{type:'string',maxLength:200}}}};
 }
 write('packages/product-catalog/2.0.0/'+item.path,definition);
}
const catalog=manifest('product-catalog','2.0.0','Katalog proizvoda','Postojeći stabilni katalog sa opcionom novom korpom, direktnim upitima i serverskim favoritima.',[{packageKey:'starter-site',minimumVersion:'1.0.0'},{packageKey:'webfront-commerce',minimumVersion:'1.0.0'}],old.items.map(({sha256,...item})=>item));
const releases=read('packages/catalog.json');releases.packages=releases.packages.filter(x=>!(x.packageKey==='product-catalog'&&x.version==='2.0.0')&&!(x.packageKey==='webfront-commerce'&&x.version==='1.0.0'));releases.packages.push(commerce,catalog);write('packages/catalog.json',releases);
console.log(JSON.stringify({commerce,catalog}));
