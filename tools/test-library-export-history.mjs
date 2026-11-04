import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';

const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'library-export-history-'));
const target=path.join(temp,'Library');
const run=()=>spawnSync(process.execPath,['tools/library-catalog.mjs','--export-starter',target],{cwd:repo,encoding:'utf8'});
try{
  assert.equal(run().status,0,'fresh bootstrap export');
  const old='starter-site/1.0.0';
  fs.cpSync(path.join(repo,'packages',old),path.join(target,old),{recursive:true});
  const historical=fs.readFileSync(path.join(target,old,'manifest.json'));
  const catalog=fs.readFileSync(path.join(target,'catalog.json'));
  assert.equal(run().status,0,'verified historical files survive a later bootstrap export');
  assert.deepEqual(fs.readFileSync(path.join(target,old,'manifest.json')),historical);
  assert.deepEqual(fs.readFileSync(path.join(target,'catalog.json')),catalog,'history does not change the pinned bootstrap catalog');
  fs.writeFileSync(path.join(target,old,'components/starter-hero.json'),'{}');
  assert.notEqual(run().status,0,'modified history is rejected');
  fs.copyFileSync(path.join(repo,'packages',old,'components/starter-hero.json'),path.join(target,old,'components/starter-hero.json'));
  fs.writeFileSync(path.join(target,'unknown.json'),'{}');
  assert.notEqual(run().status,0,'unknown files are rejected');
  console.log('PASS library export: preserve verified history, keep bootstrap pins, reject modified and unknown files');
}finally{fs.rmSync(temp,{recursive:true,force:true});}
