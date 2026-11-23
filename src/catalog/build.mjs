// Additive catalog presentation patch; all prior releases remain immutable.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const from='2.3.4',to='2.4.0',key='product-catalog';
const base='packages/'+key+'/'+from,target='packages/'+key+'/'+to;
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const write=(p,value)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),JSON.stringify(value,null,2)+'\n');};
if(spawnSync('git',['ls-files','--error-unmatch',target+'/manifest.json'],{cwd:root,stdio:'ignore'}).status===0)throw new Error('Immutable release is tracked: '+target);
const catalog=read('packages/catalog.json'),previous=read(base+'/manifest.json');
const entry=catalog.packages.find(p=>p.packageKey===key&&p.version===from);
if(!entry||entry.sha256!==hash(base+'/manifest.json'))throw new Error('Source manifest checksum mismatch');
const css=['products.css','list-layout.css','controls.css'].map(name=>fs.readFileSync(path.join(root,'src/catalog',name),'utf8')).join('\n');
const items=previous.items.map(item=>{
 if(hash(base+'/'+item.path)!==item.sha256)throw new Error('Source payload checksum mismatch: '+item.path);
 if(item.itemType==='component'&&item.itemKey==='product-list'){
  const definition=read(base+'/'+item.path);
  const style=definition.styles.find(x=>x.name==='products.css');
  if(!style)throw new Error('Catalog style asset missing');
  style.content=css;
  definition.scripts.find(x=>x.name==='products.js').content=fs.readFileSync(path.join(root,'src/catalog/products.js'),'utf8');
  write(target+'/'+item.path,definition);
 }else if(item.itemType==='component'&&item.itemKey==='product-detail'){
  const definition=read(base+'/'+item.path);
  definition.scripts.find(x=>x.name==='product.js').content=fs.readFileSync(path.join(root,'src/catalog/product.js'),'utf8');
  definition.htmlContent=definition.htmlContent.replace('<section class="wf-detail__related"', '<section class="wf-detail__documents" data-wf-documents hidden><h2>Dokumenti artikla</h2><ul data-wf-document-list></ul></section>\n<section class="wf-detail__related"');
  definition.styles.find(x=>x.name==='product.css').content+='\n.wf-detail__documents{margin-top:32px}.wf-detail__documents ul{list-style:none;padding:0;display:grid;gap:10px}.wf-detail__documents a{display:flex;align-items:center;gap:12px;padding:14px 16px;border:1px solid var(--wf-color-border);border-radius:8px;color:inherit;text-decoration:underline;overflow-wrap:anywhere}.wf-detail__documents a::before{content:"↓";font-size:22px}';
  write(target+'/'+item.path,definition);
 }else if(item.itemType==='provider'&&item.itemKey==='catalog-product'){
  const definition=read(base+'/'+item.path);
  definition.outputSchema.properties.documents={type:'array',maxItems:50,items:{type:'object',additionalProperties:false,required:['label','url'],properties:{label:{type:'string',maxLength:240},url:{type:'string',maxLength:260,format:'safe-url'}}}};
  write(target+'/'+item.path,definition);
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
