// Additive runtime patch: prior releases stay byte-identical.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const runtime={
 'commerce.js':fs.readFileSync(path.join(root,'src/commerce/guest-cart.js'),'utf8')+'\n'+fs.readFileSync(path.join(root,'src/commerce/commerce.js'),'utf8'),
 'commerce.css':fs.readFileSync(path.join(root,'src/commerce/commerce.css'),'utf8'),
 'products.css':fs.readFileSync(path.join(root,'src/catalog/products.css'),'utf8')+'\n'+fs.readFileSync(path.join(root,'src/catalog/list-layout.css'),'utf8'),
 'products.js':fs.readFileSync(path.join(root,'src/catalog/products.js'),'utf8'),
 'product.js':fs.readFileSync(path.join(root,'src/catalog/product.js'),'utf8')
};
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const write=(p,value)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),JSON.stringify(value,null,2)+'\n');};
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const releases=read('packages/catalog.json');
for(const [key,from,to] of [['webfront-commerce','1.2.11','1.3.0'],['product-catalog','2.2.11','2.3.0']]){
 const base='packages/'+key+'/'+from,target='packages/'+key+'/'+to;
 if(spawnSync('git',['ls-files','--error-unmatch',target+'/manifest.json'],{cwd:root,stdio:'ignore'}).status===0)throw new Error('Immutable release is tracked: '+target);
 const previous=read(base+'/manifest.json');
 const entry=releases.packages.find(p=>p.packageKey===key&&p.version===from);
 if(!entry||sha(base+'/manifest.json')!==entry.sha256)throw new Error('Source manifest checksum mismatch: '+base);
 const items=previous.items.map(item=>{
  if(sha(base+'/'+item.path)!==item.sha256)throw new Error('Source payload checksum mismatch: '+item.path);
  if(item.itemType==='component'){
   const definition=read(base+'/'+item.path);
   for(const [collection,name]of [['scripts','commerce.js'],['styles','commerce.css']]){
    const asset=definition[collection].find(a=>a.name===name);
    if(!asset)throw new Error('Missing shared commerce asset: '+item.path+' '+name);
    asset.content=runtime[name];
   }
   if(definition.componentKey==='commerce-shell')definition.htmlContent=definition.htmlContent.replace('</svg></a>','</svg><span data-wf-favorite-count>0</span></a>');
   if(definition.componentKey==='product-list'){
    definition.styles.find(a=>a.name==='products.css').content=runtime['products.css'];
    if(from==='2.2.9'){
     definition.htmlContent=definition.htmlContent.replace('data-commerce-enabled=', 'data-list-cart-enabled="{{setting:list-cart-enabled}}" data-commerce-enabled=');
     definition.settingsSchema.properties['list-cart-enabled']={type:'boolean',title:'Dodavanje u korpu iz kategorije',description:'Važi za proizvode bez varijanti. Proizvod sa varijantama uvek se otvara preko slike ili naziva, a varijanta bira na detalju.',default:false};
    }
   }
   if(definition.componentKey==='product-list' && from==='2.2.5'){
    for(const asset of [...definition.styles,...definition.scripts])if(runtime[asset.name])asset.content=runtime[asset.name];
    definition.htmlContent=definition.htmlContent.replace('data-show-list-description=', 'data-list-variants="detail" data-hide-current-category="{{setting:hide-current-category}}" data-show-grid-description="{{setting:show-grid-description}}" data-show-list-description=');
    const settings=definition.settingsSchema.properties;
    settings['show-brand']={...settings['show-brand'],title:'Prikaži brend proizvoda',default:true};
    settings['show-category']={...settings['show-category'],title:'Prikaži kategoriju proizvoda',default:false};
    settings['show-grid-description']={type:'boolean',title:'Kratak opis u mreži',default:false};
    settings['hide-current-category']={type:'boolean',title:'Ne ponavljaj otvorenu kategoriju',default:true};
   }
   if(definition.componentKey==='product-detail' && from==='2.2.5'){
    for(const asset of definition.scripts)if(runtime[asset.name])asset.content=runtime[asset.name];
    definition.htmlContent=definition.htmlContent.replace('data-commerce-enabled=', 'data-variant-display="{{setting:variant-display}}" data-show-brand="{{setting:show-brand}}" data-show-category="{{setting:show-category}}" data-commerce-enabled=');
    Object.assign(definition.settingsSchema.properties,{
     'variant-display':{type:'string',enum:['Izbor','Lista'],maxLength:20,title:'Prikaz varijanti na detalju',default:'Izbor'},
     'show-brand':{type:'boolean',title:'Prikaži brend proizvoda',default:true},
     'show-category':{type:'boolean',title:'Prikaži kategoriju proizvoda',default:true}
    });
   }
   write(target+'/'+item.path,definition);
  }else if(item.itemType==='provider' && item.itemKey==='catalog-products' && from==='2.2.5'){
   const definition=read(base+'/'+item.path), properties=definition.outputSchema.properties;
   properties.filters.properties={ordered:properties.filters.properties.ordered};properties.filters.required=['ordered'];
   const product=properties.items.items;delete product.properties.variants;
   product.properties['variant-count']={type:'integer',minimum:0,maximum:100};
   write(target+'/'+item.path,definition);
  }else{
   fs.mkdirSync(path.dirname(path.join(root,target,item.path)),{recursive:true});
   fs.copyFileSync(path.join(root,base,item.path),path.join(root,target,item.path));
  }
  return {...item,sha256:sha(target+'/'+item.path)};
 });
 const next={...previous,version:to,items};
 if(key==='product-catalog')next.dependencies=previous.dependencies.map(d=>d.packageKey==='webfront-commerce'?{...d,minimumVersion:'1.3.0'}:d);
 write(target+'/manifest.json',next);
 releases.packages=releases.packages.filter(p=>!(p.packageKey===key&&p.version===to));
 releases.packages.push({packageKey:key,version:to,manifest:key+'/'+to+'/manifest.json',sha256:sha(target+'/manifest.json')});
}
write('packages/catalog.json',releases);
console.log('Built webfront-commerce@1.3.0 and product-catalog@2.3.0; prior releases preserved.');
