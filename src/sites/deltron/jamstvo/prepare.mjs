import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const dir=path.dirname(fileURLToPath(import.meta.url));
const read=name=>readFile(path.join(dir,name),'utf8');
const write=async(name,data)=>writeFile(path.join(dir,name),JSON.stringify(data,null,2)+'\n');
await mkdir(path.join(dir,'definitions'),{recursive:true});
const items=[];
async function item(type,key,definition){const file=`definitions/${type}-${key}.json`;await write(file,definition);items.push({itemType:type,itemKey:key,file,expectedRevision:0});}
for(const [key,label,file] of [['deltron-header','Deltron · zaglavlje','header.html'],['deltron-login','Deltron · prijava','login.html'],['deltron-jamstvo','Deltron · prijava uređaja za jamstvo','warranty.html']]){
 await item('component',key,{formatVersion:2,contractVersion:1,componentKey:key,label,category:key==='deltron-header'?'navigation':'forms',renderMode:'static',targets:['web','mobile'],htmlContent:(await read(file)).trim(),styles:[],scripts:[],settingsSchema:{type:'object',additionalProperties:false,properties:{}},providerKey:null,cache:{scope:'none',ttlSeconds:0,varyBy:[]},access:{visibility:'public',permissions:[]},seo:{mode:'none'}});
}
await item('global-section','deltron-site-header',{formatVersion:2,contractVersion:1,globalSectionKey:'deltron-site-header',label:'Deltron · zaglavlje',role:'header',instance:{componentKey:'deltron-header',instanceKey:'deltron-header-global',settings:{}}});
await item('layout','deltron-layout',{formatVersion:2,contractVersion:1,layoutKey:'deltron-layout',label:'Deltron · novi Webfront',targets:['web','mobile'],htmlContent:'<!doctype html><html lang="{{wf:lang}}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">{{wf:head}}{{wf:styles}}</head><body data-release="{{wf:release}}"><header class="dt-site-header">{{region:header}}</header><main class="dt-main" id="main-content">{{region:main}}</main><footer class="dt-footer">Deltron d.o.o.</footer>{{wf:scripts}}</body></html>',regions:{header:{required:true,defaults:[{globalSectionKey:'deltron-site-header'}]},main:{required:true,defaults:[]}},styles:[{name:'deltron-site.css',content:await read('site.css')}],scripts:[{name:'deltron-site.js',content:await read('site.js')}]});
for(const [key,route,title,component] of [['deltron-prijava','/prijava','Prijava','deltron-login'],['deltron-produljeno-jamstvo','/produljeno-jamstvo','Prijava uređaja za jamstvo','deltron-jamstvo']]){
 await item('page',key,{formatVersion:2,contractVersion:1,pageKey:key,layoutKey:'deltron-layout',route,locale:'sr',targets:['web','mobile'],access:{visibility:'public',permissions:[]},metadata:{title:title+' | Deltron',description:component==='deltron-login'?'Prijava postojećih Deltron korisnika.':'Prijava uređaja za produljeno jamstvo.'},regions:{main:[{instanceKey:key+'-main',componentKey:component,settings:{}}]}});
}
await write('draft-manifest.json',{siteKey:'site-deltron',items});
