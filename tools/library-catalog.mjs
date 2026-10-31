#!/usr/bin/env node
// Verify immutable v2 design packages; optionally export a pinned engine snapshot.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../packages');
const args=process.argv.slice(2);
if(args.length && !(args.length===2 && args[0]==='--export'))throw new Error('Usage: node tools/library-catalog.mjs [--export directory]');
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
    if(keys.has(key)||!['component','layout','global-section','page-template'].includes(item.itemType))throw new Error('Invalid item '+key);
    keys.add(key);
    if(typeof item.path!=='string'||item.path.split('/').some(p=>p==='..'||p==='.'||!p)||path.posix.isAbsolute(item.path))throw new Error('Unsafe item path '+key);
    const definition=read(path.posix.join(path.posix.dirname(entry.manifest),item.path),item.sha256);
    if(definition.formatVersion!==2||definition.contractVersion!==1)throw new Error('Unsupported contract '+key);
  }
}
if(args.length){
  const destination=path.resolve(args[1]);
  // Do not erase arbitrary output directories, or leave stale releases in a snapshot.
  if(fs.existsSync(destination)){
    const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.relative(destination,path.join(dir,e.name)).split(path.sep).join('/')]);
    if(walk(destination).some(file=>!files.has(file)))throw new Error('Output contains files outside this catalog; use a fresh directory');
  }
  for(const [relative,bytes]of files){const target=path.join(destination,relative);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);}
}
console.log('Verified '+releases.size+' immutable package release(s), '+files.size+' files'+(args.length?'; exported pinned snapshot':''));
