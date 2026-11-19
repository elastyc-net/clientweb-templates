// Additive runtime patch: prior releases stay byte-identical.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const runtime={
 'commerce.js':fs.readFileSync(path.join(root,'src/commerce/commerce.js'),'utf8'),
 'commerce.css':fs.readFileSync(path.join(root,'src/commerce/commerce.css'),'utf8')
};
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const write=(p,value)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),JSON.stringify(value,null,2)+'\n');};
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const releases=read('packages/catalog.json');
for(const [key,from,to] of [['webfront-commerce','1.0.6','1.1.0'],['product-catalog','2.0.5','2.1.0']]){
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
   write(target+'/'+item.path,definition);
  }else{
   fs.mkdirSync(path.dirname(path.join(root,target,item.path)),{recursive:true});
   fs.copyFileSync(path.join(root,base,item.path),path.join(root,target,item.path));
  }
  return {...item,sha256:sha(target+'/'+item.path)};
 });
 const next={...previous,version:to,items};
 if(key==='product-catalog')next.dependencies=previous.dependencies.map(d=>d.packageKey==='webfront-commerce'?{...d,minimumVersion:'1.1.0'}:d);
 write(target+'/manifest.json',next);
 releases.packages=releases.packages.filter(p=>!(p.packageKey===key&&p.version===to));
 releases.packages.push({packageKey:key,version:to,manifest:key+'/'+to+'/manifest.json',sha256:sha(target+'/manifest.json')});
}
write('packages/catalog.json',releases);
console.log('Built webfront-commerce@1.1.0 and product-catalog@2.1.0; prior releases preserved.');
