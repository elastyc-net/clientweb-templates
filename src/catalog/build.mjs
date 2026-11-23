// Additive catalog presentation patch; all prior releases remain immutable.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const from='2.3.1',to='2.3.2',key='product-catalog';
const base='packages/'+key+'/'+from,target='packages/'+key+'/'+to;
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const write=(p,value)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),JSON.stringify(value,null,2)+'\n');};
if(spawnSync('git',['ls-files','--error-unmatch',target+'/manifest.json'],{cwd:root,stdio:'ignore'}).status===0)throw new Error('Immutable release is tracked: '+target);
const catalog=read('packages/catalog.json'),previous=read(base+'/manifest.json');
const entry=catalog.packages.find(p=>p.packageKey===key&&p.version===from);
if(!entry||entry.sha256!==hash(base+'/manifest.json'))throw new Error('Source manifest checksum mismatch');
const svg=(content)=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+content+'</svg>';
const grid=svg('<rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/>');
const list=svg('<rect x="3" y="4" width="3" height="3" rx=".5"/><path d="M10 5.5h11"/><rect x="3" y="10.5" width="3" height="3" rx=".5"/><path d="M10 12h11"/><rect x="3" y="17" width="3" height="3" rx=".5"/><path d="M10 18.5h11"/>');
const css=['products.css','list-layout.css','controls.css'].map(name=>fs.readFileSync(path.join(root,'src/catalog',name),'utf8')).join('\n');
const items=previous.items.map(item=>{
 if(hash(base+'/'+item.path)!==item.sha256)throw new Error('Source payload checksum mismatch: '+item.path);
 if(item.itemType==='component'&&item.itemKey==='product-list'){
  const definition=read(base+'/'+item.path);
  for(const [view,label,icon,old]of [['grid','Mreža',grid,'▦'],['list','Lista',list,'☰']]){
   const before='<button type="button" data-wf-view="'+view+'" aria-label="'+label+'">'+old+'</button>';
   if(!definition.htmlContent.includes(before))throw new Error('Expected view control is missing: '+view);
   definition.htmlContent=definition.htmlContent.replace(before,'<button type="button" data-wf-view="'+view+'" aria-label="'+label+'" title="'+label+'">'+icon+'</button>');
  }
  const style=definition.styles.find(x=>x.name==='products.css');
  if(!style)throw new Error('Catalog style asset missing');
  style.content=css;write(target+'/'+item.path,definition);
 }else{
  fs.mkdirSync(path.dirname(path.join(root,target,item.path)),{recursive:true});
  fs.copyFileSync(path.join(root,base,item.path),path.join(root,target,item.path));
 }
 return {...item,sha256:hash(target+'/'+item.path)};
});
write(target+'/manifest.json',{...previous,version:to,items});
catalog.packages=catalog.packages.filter(p=>!(p.packageKey===key&&p.version===to));
catalog.packages.push({packageKey:key,version:to,manifest:key+'/'+to+'/manifest.json',sha256:hash(target+'/manifest.json')});
write('packages/catalog.json',catalog);
console.log('Built product-catalog@'+to+'; commerce, providers, settings and all prior releases preserved.');
