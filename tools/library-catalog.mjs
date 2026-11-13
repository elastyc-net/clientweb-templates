#!/usr/bin/env node
// Verify immutable v2 design packages; optionally export a pinned engine snapshot.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../packages');
const args=process.argv.slice(2);
const exportPackage=args[0]==='--export-package'&&args.length===3;
if(args.length && !exportPackage && !(args.length===2 && ['--export','--export-starter','--bundle'].includes(args[0])))throw new Error('Usage: node tools/library-catalog.mjs [--export-starter directory | --export directory | --bundle file | --export-package key@version directory]');
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const files=new Map();
function read(relative,hash){
  if(!/^[a-z0-9/.-]+\.json$/.test(relative)||relative.split('/').some(p=>p==='..'||p==='.'||!p))throw new Error('Unsafe package path');
  const absolute=fs.realpathSync(path.join(root,relative));
  if(!absolute.startsWith(root+path.sep))throw new Error('Package escaped its root');
  const bytes=fs.readFileSync(absolute);
  if(bytes.length>1048576||(hash!==undefined&&(!/^[a-f0-9]{64}$/.test(hash)||sha(bytes)!==hash)))throw new Error('Invalid size/checksum: '+relative);
  files.set(relative,bytes);
  return JSON.parse(bytes);
}
const catalog=read('catalog.json');
if(catalog.formatVersion!==1||!Array.isArray(catalog.packages)||catalog.packages.length>128)throw new Error('Invalid catalog');
const releases=new Set();
for(const entry of catalog.packages){
  const token=entry.packageKey+'@'+entry.version;
  if(releases.has(token)||!/^[a-z0-9][a-z0-9-]{1,62}$/.test(entry.packageKey)||!/^(0|[1-9]\d{0,5})\.(0|[1-9]\d{0,5})\.(0|[1-9]\d{0,5})$/.test(entry.version))throw new Error('Invalid release '+token);
  releases.add(token);
  const manifest=read(entry.manifest,entry.sha256);
  if(manifest.packageKey!==entry.packageKey||manifest.version!==entry.version||manifest.formatVersion!==1||!Array.isArray(manifest.items)||!manifest.items.length||manifest.items.length>128)throw new Error('Invalid manifest '+token);
  const keys=new Set();
  for(const item of manifest.items){
    const key=item.itemType+':'+item.itemKey;
    if(keys.has(key)||!['component','layout','global-section','page-template','provider'].includes(item.itemType))throw new Error('Invalid item '+key);
    keys.add(key);
    if(typeof item.path!=='string'||item.path.split('/').some(p=>p==='..'||p==='.'||!p)||path.posix.isAbsolute(item.path))throw new Error('Unsafe item path '+key);
    const definition=read(path.posix.join(path.posix.dirname(entry.manifest),item.path),item.sha256);
    if(definition.formatVersion!==2||definition.contractVersion!==1)throw new Error('Unsupported contract '+key);
    if(item.itemType==='provider'){
      const handlers={'help-desk-cases':['helpdesk.cases.read','helpdesk.cases.cards','helpdesk.cases.facets'],'catalog-products':['catalog.products.list','catalog.products.list.v2'],'catalog-product':['catalog.products.detail','catalog.products.detail.v2'],'catalog-offers':['catalog.products.offers'],'kb-article':'kb.article','kb-children':'kb.children','finance-summary':'finance.summary.read'};
      if(!handlers[item.itemKey]||definition.providerKey!==item.itemKey||![].concat(handlers[item.itemKey]).includes(definition.handler)||definition.kind!=='query'||definition.dataScope!==(item.itemKey==='help-desk-cases'?'user':item.itemKey==='finance-summary'?'permission':item.itemKey==='catalog-offers'?'visitor':'tenant'))throw new Error('Unsupported query contract '+key);
      const reviewed={'help-desk-cases':['9879694752903302044b91b471013e44a8ba043ba44f5c07ddbded6563e9afcb','41d646ab5bd2158f20f1098769d6a7a286dbe2d3628850557e742d416e00a6fc','908cab5e8f445a803a2bc095511ea6ed77e4cf250d5bfb43d4d9611067ee19ac'],'catalog-offers':['7a876fc032b57fb8d120b701492c8b86119efe7f1380b42e9b548edef5467512','a155b2709a970bde945b68f94b9312947e6db66b6018372641f193a651f9a450','c318e9efe4740a1bc2b28df343d7f67b6a23297654ebd2094027ab349302fc79'],'catalog-products':['f6448a47042187009297171a1279bcf548cc09fd5ab5c5d30c784f95e4dc145e','29947e7ff167f35c82c5b6fcd797b6dd21353d6bbf6d4177e96a641b35211c70','8b8dad94472374d278631e8993d7010aa191321ba11deae9c9759290172c7159','f666f9b12b3842cf225daec8fd209003aa68bd4efcbccf5a9dd54d976d322230'],'catalog-product':['0fabe132873eb30e10f962a398cece7cbc3646b422a95faf7f41805a283ff035','4cdf42552087a74e0c9b2129052de366aeba5d106b491ed20ea76c5826f3d998','5e063ba6379f816a44fc555d3cefa3e7caa40c58af0e3c61b2509ed480e0cc69'],'kb-article':'1ed91d794426c2df1793887fa8da686b8645cbd0b7e83bbe6f2cdd2400526491','kb-children':'00e7e2532e8c9ab97843a955800a01d08a210d80b64c63812548ce8e1bad0883','finance-summary':'23f8c986c90a7e13b94aeb21020fbae8f86298f51b94ce440a3cf73b2f444066'};
      if(![].concat(reviewed[item.itemKey]).includes(item.sha256))throw new Error('Unreviewed provider bytes '+key);
      // Engine LibraryProviderContracts independently pins the canonical JSON definition.
    }
  }
}
const payload={formatVersion:1,files:Object.fromEntries([...files].map(([relative,bytes])=>[relative,bytes.toString('utf8')]))};
if(args[0]==='--bundle'){
  fs.writeFileSync(path.resolve(args[1]),JSON.stringify(payload)+'\n');
}else if(fs.existsSync(path.join(root,'staged-bundle.json'))){
  const staged=JSON.parse(fs.readFileSync(path.join(root,'staged-bundle.json'),'utf8'));
  if(staged.formatVersion!==1||JSON.stringify(staged.files)!==JSON.stringify(payload.files))throw new Error('Staging bundle is stale; regenerate with --bundle packages/staged-bundle.json');
}
if(exportPackage||['--export','--export-starter'].includes(args[0])){
  const exported=new Map(files);
  if(args[0]==='--export-starter'){
    const pins=JSON.parse(fs.readFileSync(path.join(root,'bootstrap.json'),'utf8'));
    if(pins.formatVersion!==1||!Array.isArray(pins.packages)||!pins.packages.length||pins.packages.length>32)throw new Error('Invalid bootstrap selection');
    const selected=pins.packages.map(pin=>{
      const entry=catalog.packages.find(p=>p.packageKey===pin.packageKey&&p.version===pin.version);
      if(!entry)throw new Error('Pinned bootstrap release is missing: '+pin.packageKey+'@'+pin.version);
      return entry;
    });
    if(new Set(selected.map(p=>p.packageKey)).size!==selected.length)throw new Error('Duplicate bootstrap package');
    const keep=new Set(['catalog.json']);
    const owners=new Set();
    for(const entry of selected){
      keep.add(entry.manifest);
      const manifest=JSON.parse(files.get(entry.manifest));
      for(const dependency of manifest.dependencies){
        const found=selected.find(p=>p.packageKey===dependency.packageKey);
        const compare=(a,b)=>{const aa=a.split('.').map(Number),bb=b.split('.').map(Number);for(let i=0;i<3;i++)if(aa[i]!==bb[i])return aa[i]-bb[i];return 0;};
        if(!found||compare(found.version,dependency.minimumVersion)<0)throw new Error('Missing bootstrap dependency '+dependency.packageKey);
      }
      for(const item of manifest.items){
        const key=item.itemType+':'+item.itemKey;
        if(owners.has(key))throw new Error('Duplicate bootstrap item owner '+key);
        owners.add(key);
        keep.add(path.posix.join(path.posix.dirname(entry.manifest),item.path));
      }
    }
    for(const file of exported.keys())if(!keep.has(file))exported.delete(file);
    exported.set('catalog.json',Buffer.from(JSON.stringify({formatVersion:1,packages:selected},null,2)+'\n'));
  }
  if(exportPackage){
    const entry=catalog.packages.find(candidate=>candidate.packageKey+'@'+candidate.version===args[1]);
    if(!entry)throw new Error('Package release is missing: '+args[1]);
    const prefix=path.posix.dirname(entry.manifest)+'/';
    for(const file of exported.keys())if(!file.startsWith(prefix))exported.delete(file);
    exported.set('catalog.json',Buffer.from(JSON.stringify({formatVersion:1,packages:[entry]},null,2)+'\n'));
  }
  const destination=path.resolve(args[exportPackage?2:1]);
  // The catalog pins the bootstrap. Verified immutable payloads from earlier engine
  // releases must remain on disk so a code upgrade does not silently remove them.
  if(fs.existsSync(destination)){
    const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{
      if(e.isSymbolicLink())throw new Error('Output contains a symbolic link');
      return e.isDirectory()?walk(path.join(dir,e.name)):[path.relative(destination,path.join(dir,e.name)).split(path.sep).join('/')];
    });
    for(const file of walk(destination)){
      if(exported.has(file))continue;
      if(!files.has(file)||sha(fs.readFileSync(path.join(destination,file)))!==sha(files.get(file)))throw new Error('Output contains unknown or modified historical files; use a fresh directory');
    }
  }
  for(const [relative,bytes]of exported){const target=path.join(destination,relative);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);}
}
console.log('Verified '+releases.size+' immutable package release(s), '+files.size+' files'+(args[0]?.startsWith('--export')?'; exported snapshot':args[0]==='--bundle'?'; generated staging bundle':''));
