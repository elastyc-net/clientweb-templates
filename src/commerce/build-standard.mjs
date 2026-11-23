// Immutable shared commerce/default-site release. Never edits prior package bytes.
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8')),text=p=>fs.readFileSync(path.join(root,p),'utf8');
const write=(p,v)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),JSON.stringify(v,null,2)+'\n');};
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const runtime=text('src/commerce/guest-cart.js')+'\n'+text('src/commerce/commerce.js'),commerceCss=text('src/commerce/commerce.css');
const catalog=read('packages/catalog.json');
for(const[key,from,to]of[['webfront-commerce','1.3.2','1.4.0'],['product-catalog','2.4.0','2.5.0'],['reference-chrome','1.0.3','1.1.0']]){
 const base='packages/'+key+'/'+from,target='packages/'+key+'/'+to;
 if(spawnSync('git',['ls-files','--error-unmatch',target+'/manifest.json'],{cwd:root,stdio:'ignore'}).status===0)throw Error('Immutable release already tracked: '+target);
 const previous=read(base+'/manifest.json'),entry=catalog.packages.find(p=>p.packageKey===key&&p.version===from);if(!entry||entry.sha256!==hash(base+'/manifest.json'))throw Error('Source manifest differs');
 let items=previous.items.map(item=>{
  if(hash(base+'/'+item.path)!==item.sha256)throw Error('Source payload differs: '+item.path);
  let d=read(base+'/'+item.path);
  if(key==='reference-chrome' && item.itemKey==='chrome-navigation'){d=read('src/chrome/navigation.json');d.scripts=[{name:'navigation-menu.js',content:text('src/chrome/navigation.js')}];d.styles=[{name:'navigation-menu.css',content:text('src/chrome/navigation.css')}];}
  if(item.itemType==='component'){
   const shared=d.scripts?.find(s=>s.name==='commerce.js');if(shared)shared.content=runtime;
   const shop=d.styles?.find(s=>s.name==='commerce.css');if(shop)shop.content=commerceCss;
   if(d.componentKey==='product-list'){d.scripts.find(s=>s.name==='products.js').content=text('src/catalog/products.js');d.styles.find(s=>s.name==='products.css').content=['products.css','list-layout.css','controls.css'].map(p=>text('src/catalog/'+p)).join('\n');}
   if(d.componentKey==='product-detail')d.scripts.find(s=>s.name==='product.js').content=text('src/catalog/product.js');
   if(d.componentKey==='commerce-shell')d.htmlContent=d.htmlContent.replace('M3 3h2l2.4 12h11.2L21 7H6M9 21h.01M18 21h.01','M2 3h3l3 12h11l3-9H6M9 20a1 1 0 1 0 0 .01M19 20a1 1 0 1 0 0 .01');
   if(d.componentKey==='commerce-account'){
    d.scripts.find(s=>s.name==='commerce-account.js').content=fs.readFileSync(path.join(root,'../common/Elastyc/FrontAuth/commerce-account.js'),'utf8');
    d.htmlContent=d.htmlContent.replace('data-wf-shared-commerce-account>','data-wf-shared-commerce-account data-orders-url="{{setting:orders-url}}" data-orders-enabled="{{setting:orders-enabled}}">');
    d.settingsSchema.properties['orders-url']={type:'string',maxLength:240,format:'safe-url',default:'/narudzbine',title:'Stranica sopstvenih narudžbina'};d.settingsSchema.properties['orders-enabled']={type:'boolean',default:false,title:'Prikaži Moje narudžbine'};d.settingsDefaults['orders-url']='/narudzbine';d.settingsDefaults['orders-enabled']=false;
   }
   if(d.componentKey==='chrome-navigation'){
    const nav=read('src/chrome/navigation.json');Object.assign(d,nav);
    d.scripts=[{name:'navigation-menu.js',content:text('src/chrome/navigation.js')}];d.styles=[{name:'navigation-menu.css',content:text('src/chrome/navigation.css')}];
   }
  }
  if(item.itemType==='provider'&&item.itemKey==='catalog-product')d.outputSchema.properties.active={type:'boolean'};
  write(target+'/'+item.path,d);return {...item,sha256:hash(target+'/'+item.path)};
 });
 if(key==='webfront-commerce'){
  const source=read(base+'/components/commerce-cart.json');source.componentKey='commerce-orders';source.label='Moje narudžbine';source.htmlContent='<section class="wf-shop"><h1>{{setting:title}}</h1><div data-wf-orders data-account-url="{{setting:account-url}}" aria-live="polite"></div></section>';source.scripts=[{name:'orders.js',content:text('src/commerce/orders.js')}];source.styles=[{name:'commerce.css',content:commerceCss}];source.settingsDefaults.title='Moje narudžbine';source.settingsSchema.properties['account-url']={type:'string',maxLength:240,format:'safe-url',default:'/nalog',title:'Stranica naloga'};source.settingsDefaults['account-url']='/nalog';
  write(target+'/components/commerce-orders.json',source);items.push({itemType:'component',itemKey:'commerce-orders',path:'components/commerce-orders.json',sha256:hash(target+'/components/commerce-orders.json')});
  const page=read(base+'/page-templates/commerce-cart.json');page.label='Moje narudžbine';
  function walk(v){if(!v||typeof v!=='object')return;for(const k of Object.keys(v)){if(typeof v[k]==='string')v[k]=v[k].replaceAll('commerce-cart','commerce-orders').replaceAll('Korpa','Moje narudžbine');else walk(v[k]);}}walk(page);
  write(target+'/page-templates/commerce-orders.json',page);items.push({itemType:'page-template',itemKey:'commerce-orders',path:'page-templates/commerce-orders.json',sha256:hash(target+'/page-templates/commerce-orders.json')});
 }
 const manifest={...previous,version:to,items};if(key==='product-catalog')manifest.dependencies=manifest.dependencies.map(d=>d.packageKey==='webfront-commerce'?{...d,minimumVersion:'1.4.0'}:d);
 write(target+'/manifest.json',manifest);catalog.packages=catalog.packages.filter(p=>!(p.packageKey===key&&p.version===to));catalog.packages.push({packageKey:key,version:to,manifest:key+'/'+to+'/manifest.json',sha256:hash(target+'/manifest.json')});
}
write('packages/catalog.json',catalog);
const pins=read('packages/bootstrap.json');for(const p of pins.packages){if(p.packageKey==='webfront-commerce')p.version='1.4.0';if(p.packageKey==='product-catalog')p.version='2.5.0';if(p.packageKey==='reference-chrome')p.version='1.1.0';}write('packages/bootstrap.json',pins);
console.log('Prepared immutable commerce 1.4.0, catalog 2.5.0 and reference chrome 1.1.0.');
