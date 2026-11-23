// Additive shared runtime patch; all earlier release bytes remain immutable.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const write=(p,v)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),JSON.stringify(v,null,2)+'\n');};
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const text=p=>fs.readFileSync(path.join(root,p),'utf8');
const runtime=text('src/commerce/guest-cart.js')+'\n'+text('src/commerce/commerce.js');
const css=['products.css','list-layout.css','controls.css'].map(p=>text('src/catalog/'+p)).join('\n');
const releases=read('packages/catalog.json');
for(const [key,from,to] of [['webfront-commerce','1.3.1','1.3.2'],['product-catalog','2.3.2','2.3.3']]){
 const base='packages/'+key+'/'+from,target='packages/'+key+'/'+to;
 if(spawnSync('git',['ls-files','--error-unmatch',target+'/manifest.json'],{cwd:root,stdio:'ignore'}).status===0)throw new Error('Immutable release is tracked: '+target);
 const previous=read(base+'/manifest.json'),entry=releases.packages.find(x=>x.packageKey===key&&x.version===from);
 if(!entry||entry.sha256!==hash(base+'/manifest.json'))throw new Error('Source manifest checksum mismatch');
 const items=previous.items.map(item=>{
  if(item.sha256!==hash(base+'/'+item.path))throw new Error('Source item checksum mismatch: '+item.path);
  if(item.itemType==='component'){
   const d=read(base+'/'+item.path),shared=d.scripts.find(x=>x.name==='commerce.js');
   if(!shared)throw new Error('Shared commerce script missing'); shared.content=runtime;
   if(d.componentKey==='product-list'){
    d.styles.find(x=>x.name==='products.css').content=css;
    d.scripts.find(x=>x.name==='products.js').content=text('src/catalog/products.js');
    const old='<button type="button" class="wf-catalog__filters-toggle" data-wf-filters-toggle>Filteri</button>';
    if(!d.htmlContent.includes(old))throw new Error('Original filter control missing');
    const icon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 4h18l-7 9v6l-4 2v-8L3 4Z"/></svg>';
    const button='<button type="button" class="wf-catalog__filters-toggle" data-wf-filters-toggle aria-expanded="false">'+icon+'<span data-wf-filter-label>Filteri</span></button>';
    d.htmlContent=d.htmlContent.replace(old,'').replace('<header class="wf-catalog__header">\n<div>','<header class="wf-catalog__header">\n<div class="wf-catalog__heading">').replace('<div class="wf-catalog__controls">',button+'\n<div class="wf-catalog__controls">');
   }
   write(target+'/'+item.path,d);
  }else{
   fs.mkdirSync(path.dirname(path.join(root,target,item.path)),{recursive:true});
   fs.copyFileSync(path.join(root,base,item.path),path.join(root,target,item.path));
  }
  return {...item,sha256:hash(target+'/'+item.path)};
 });
 const next={...previous,version:to,items};
 if(key==='product-catalog')next.dependencies=previous.dependencies.map(d=>d.packageKey==='webfront-commerce'?{...d,minimumVersion:'1.3.2'}:d);
 write(target+'/manifest.json',next);
 releases.packages=releases.packages.filter(p=>!(p.packageKey===key&&p.version===to));
 releases.packages.push({packageKey:key,version:to,manifest:key+'/'+to+'/manifest.json',sha256:hash(target+'/manifest.json')});
}
write('packages/catalog.json',releases);
console.log('Built commerce 1.3.2/catalog 2.3.3; prior releases, data contracts and settings preserved.');
