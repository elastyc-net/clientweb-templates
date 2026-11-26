// Immutable compact commerce list/loading release; earlier design bytes stay unchanged.
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8')),text=p=>fs.readFileSync(path.join(root,p),'utf8');
const write=(p,v)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),JSON.stringify(v,null,2)+'\n');};
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const runtime=text('src/commerce/guest-cart.js')+'\n'+text('src/commerce/commerce.js'),css=text('src/commerce/commerce.css');
const catalog=read('packages/catalog.json');
for(const[key,from,to]of[['webfront-commerce','1.4.2','1.4.3'],['product-catalog','2.5.2','2.5.3']]){
 const base='packages/'+key+'/'+from,target='packages/'+key+'/'+to;
 if(spawnSync('git',['ls-files','--error-unmatch',target+'/manifest.json'],{cwd:root,stdio:'ignore'}).status===0)throw Error('Immutable release already tracked: '+target);
 const previous=read(base+'/manifest.json'),entry=catalog.packages.find(p=>p.packageKey===key&&p.version===from);if(!entry||entry.sha256!==hash(base+'/manifest.json'))throw Error('Source manifest differs');
 const items=previous.items.map(item=>{
  if(hash(base+'/'+item.path)!==item.sha256)throw Error('Source payload differs: '+item.path);
  const d=read(base+'/'+item.path);
  if(item.itemType==='component'){
   const script=d.scripts?.find(s=>s.name==='commerce.js');if(script)script.content=runtime;
   const style=d.styles?.find(s=>s.name==='commerce.css');if(style)style.content=css;
  }
  write(target+'/'+item.path,d);return {...item,sha256:hash(target+'/'+item.path)};
 });
 const manifest={...previous,version:to,items};if(key==='product-catalog')manifest.dependencies=manifest.dependencies.map(d=>d.packageKey==='webfront-commerce'?{...d,minimumVersion:'1.4.3'}:d);
 write(target+'/manifest.json',manifest);catalog.packages=catalog.packages.filter(p=>!(p.packageKey===key&&p.version===to));catalog.packages.push({packageKey:key,version:to,manifest:key+'/'+to+'/manifest.json',sha256:hash(target+'/manifest.json')});
}
write('packages/catalog.json',catalog);
const pins=read('packages/bootstrap.json');for(const p of pins.packages){if(p.packageKey==='webfront-commerce')p.version='1.4.3';if(p.packageKey==='product-catalog')p.version='2.5.3';}write('packages/bootstrap.json',pins);
console.log('Prepared commerce 1.4.3 and catalog 2.5.3; existing headers and previous releases preserved.');
