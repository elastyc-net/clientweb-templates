import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const text=p=>fs.readFileSync(path.join(root,p),'utf8');
const write=(p,v)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),JSON.stringify(v,null,2)+'\n');};
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const base='packages/product-catalog/2.5.4',target='packages/product-catalog/2.6.0';
if(spawnSync('git',['ls-files','--error-unmatch',target+'/manifest.json'],{cwd:root,stdio:'ignore'}).status===0)throw Error('Immutable release already tracked');
const previous=read(base+'/manifest.json'),catalog=read('packages/catalog.json');
const source=catalog.packages.find(p=>p.packageKey==='product-catalog'&&p.version==='2.5.4');
if(!source||source.sha256!==hash(base+'/manifest.json'))throw Error('Source manifest differs');
let list;
const items=previous.items.map(item=>{
 if(item.sha256!==hash(base+'/'+item.path))throw Error('Source item differs');
 const d=read(base+'/'+item.path);
 if(item.itemType==='component'&&item.itemKey==='product-list'){
  Object.assign(d.settingsSchema.properties,{
   'display-mode':{type:'string',maxLength:16,enum:['catalog','selection'],default:'catalog',title:'Način prikaza'},
   'selected-products':{type:'array',maxItems:12,title:'Izabrani proizvodi i redosled',items:{type:'object',additionalProperties:false,required:['id'],properties:{id:{type:'string',minLength:1,maxLength:80,title:'Šifra proizvoda'}}}},
   'max-items':{type:'integer',minimum:1,maximum:12,default:3,title:'Broj izdvojenih proizvoda'},
   'discount-only':{type:'boolean',default:false,title:'Samo proizvodi sa aktivnim akcijskim popustom'},
   'hide-empty':{type:'boolean',default:true,title:'Sakrij praznu izdvojenu sekciju'},
   'show-view-all':{type:'boolean',default:false,title:'Prikaži dugme ka katalogu'},
   'view-all-label':{type:'string',minLength:1,maxLength:120,default:'Pogledajte sve akcije',title:'Tekst dugmeta'},
   'view-all-url':{type:'string',format:'safe-url',maxLength:2048,default:'/proizvodi',title:'Odredište dugmeta'}
  });
  d.htmlContent=d.htmlContent.replace('<section class="wf-catalog"','<section class="wf-catalog" data-display-mode="{{setting:display-mode}}" data-hide-empty="{{setting:hide-empty}}" data-show-view-all="{{setting:show-view-all}}"');
  d.htmlContent=d.htmlContent.replace('<div class="wf-catalog__controls">','<a class="wf-catalog__selection-link" data-wf-selection-link href="{{setting:view-all-url}}">{{setting:view-all-label}} →</a>\n<div class="wf-catalog__controls"><label class="wf-catalog__sale"><input type="checkbox" data-wf-discount-filter>Na akciji</label>');
  d.scripts.find(s=>s.name==='products.js').content=text('src/catalog/products.js');
  d.styles.push({name:'selection.css',content:text('src/catalog/selection.css')});
  list=structuredClone(d);
 }
 write(target+'/'+item.path,d);return {...item,sha256:hash(target+'/'+item.path)};
});
list.componentKey='product-selection';list.label='Izdvojeni proizvodi';list.seo={mode:'none'};
list.htmlContent=list.htmlContent.replace('<h1 data-wf-catalog-title>','<h2 data-wf-catalog-title>').replace('</h1>','</h2>');
list.settingsSchema.properties['display-mode'].enum=['selection'];list.settingsSchema.properties['display-mode'].default='selection';
list.settingsDefaults={...list.settingsDefaults,'display-mode':'selection',title:'Aktuelne akcije',layout:'grid','columns-desktop':3,'columns-tablet':2,'columns-mobile':1,'show-brand':true,'show-category':true,'show-stock':true,'discount-only':true};
for(const [key,value] of Object.entries(list.settingsDefaults))if(list.settingsSchema.properties[key])list.settingsSchema.properties[key].default=value;
write(target+'/components/product-selection.json',list);
items.push({itemType:'component',itemKey:'product-selection',path:'components/product-selection.json',sha256:hash(target+'/components/product-selection.json')});
write(target+'/manifest.json',{...previous,version:'2.6.0',description:'Standardni katalog sa filterom aktivnih akcija i izborom proizvoda po sekciji.',items});
catalog.packages=catalog.packages.filter(p=>!(p.packageKey==='product-catalog'&&p.version==='2.6.0'));
catalog.packages.push({packageKey:'product-catalog',version:'2.6.0',manifest:'product-catalog/2.6.0/manifest.json',sha256:hash(target+'/manifest.json')});
write('packages/catalog.json',catalog);
console.log('Built immutable product-catalog@2.6.0 with standard product-selection component.');
