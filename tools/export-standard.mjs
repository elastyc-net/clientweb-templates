// Export a reviewed new standard release while retaining every immutable optional catalog entry.
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {spawnSync} from 'node:child_process';
const destination=path.resolve(process.argv[2]||'../instance-template'),optional=path.join(destination,'webfront/Package/OptionalLibrary');
const run=(args)=>{const p=spawnSync(process.execPath,['tools/library-catalog.mjs',...args],{stdio:'inherit'});if(p.status!==0)throw Error('Verified export failed');};
run(['--export-starter',path.join(destination,'webfront/Package/Library')]);
const existing=JSON.parse(fs.readFileSync(path.join(optional,'catalog.json'),'utf8'));
const stage=fs.mkdtempSync(path.join(os.tmpdir(),'wf-standard-export-'));
try{
 for(const token of ['webfront-commerce@1.4.3','product-catalog@2.5.3','reference-chrome@1.1.1']){
  const folder=path.join(stage,token);run(['--export-package',token,folder]);
  const entry=JSON.parse(fs.readFileSync(path.join(folder,'catalog.json'),'utf8')).packages[0];
  const manifest=JSON.parse(fs.readFileSync(path.join(folder,entry.manifest),'utf8'));
  const paths=[entry.manifest,...manifest.items.map(i=>path.posix.join(path.posix.dirname(entry.manifest),i.path))];
  for(const relative of paths){const target=path.join(optional,relative),bytes=fs.readFileSync(path.join(folder,relative));
   if(fs.existsSync(target)&&!bytes.equals(fs.readFileSync(target))){const tracked=spawnSync('git',['ls-files','--error-unmatch',path.relative(destination,target)],{cwd:destination,stdio:'ignore'});if(tracked.status===0)throw Error('Cannot rewrite tracked immutable payload: '+relative);}
   fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);
  }
  existing.packages=existing.packages.filter(p=>!(p.packageKey===entry.packageKey&&p.version===entry.version));existing.packages.push(entry);
 }
 fs.writeFileSync(path.join(optional,'catalog.json'),JSON.stringify(existing,null,2)+'\n');
}finally{fs.rmSync(stage,{recursive:true,force:true});}
