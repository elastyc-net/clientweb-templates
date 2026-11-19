/* Packaged checkout behavior, with a local callback fixture (never a Siteverify proof). */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const release=process.env.COMMERCE_PROTECTION_RELEASE||'1.0.6';
const component=JSON.parse(fs.readFileSync(path.join(__dirname,'../packages/webfront-commerce',release,'components/commerce-checkout.json')));
const script=component.scripts.find(s=>s.name==='commerce.js').content;
const css=component.styles.find(s=>s.name==='commerce.css').content;
const tick=()=>new Promise(resolve=>setTimeout(resolve,5));
async function settled(){for(let i=0;i<5;i++)await tick();}
let checks=0;
function check(value,message){assert(value,message);checks++;}
async function fixture({inquiry=false,api=true,provider=true,preview=true,pilot=true,authenticated=false}={}){
 const dom=new JSDOM('<!doctype html><style>'+css+'</style><div data-wf-commerce-url="/page.php?wf_action=commerce&channel=candidate"></div><section class="wf-shop"><div data-wf-shop-view="'+(inquiry?'request':'checkout')+'"></div></section>',{url:'https://fixture.test/page.php?channel=candidate&productId=FIXTURE&variantId=row%3A1',runScripts:'outside-only'});
 const w=dom.window,root=w.document.querySelector('[data-wf-shop-view]'),calls=[],widgets=[];
 let resetCount=0,removed=0,mode='',nextState;
 const line={lineId:'a'.repeat(32),productId:'FIXTURE',name:'Fixture',variantLabel:'Crna',quantity:'1',unit:'KOM',unitPrice:100,total:100,currency:'RSD'};
 const state={revision:1,lines:[line],favorites:[],favoritesEnabled:true,guestCheckout:true,authenticated,mergeAvailable:false,preview,
  paths:{catalog:'/katalog',product:'/proizvod',cart:'/korpa',checkout:'/porudzbina',request:'/upit',favorites:'/favoriti',account:'/nalog'},
  totals:{net:100,tax:0,gross:100,currency:'RSD'},deliveryOptions:[{id:'address',label:'Na adresu'}],pickupOptions:[],paymentOptions:[],
  ...(pilot?{testMode:'rollback',testRunId:'d'.repeat(32)}:{}),protection:provider?{provider:'turnstile',siteKey:'local-callback-fixture'}:{provider:'unavailable'}};
 w.fetch=async(url,options={})=>{
  const body=options.body?JSON.parse(options.body):null;
  if(body)calls.push(body);
  if(body&&body.action==='submit'&&mode==='network')throw new Error('Mreža nije dostupna.');
  if(body&&body.action==='submit'&&mode==='conflict')return{ok:false,status:409,json:async()=>({ok:false,message:'Korpa je promenjena. Napravite novi pregled.'})};
  if(body&&body.action==='submit'&&mode==='server')return{ok:false,status:503,json:async()=>({ok:false,message:'Privremena greška.'})};
  const data={ok:true,state:structuredClone(nextState||state),csrf:'b'.repeat(64)};
  if(body&&body.action==='quote')data.quote={id:'c'.repeat(32),lines:[line],totals:state.totals,preview};
  if(body&&body.action==='submit')data.receipt={preview,caseKey:null,documentKey:null,test:pilot?{rolledBack:true}:undefined};
  return{ok:true,status:200,json:async()=>data};
 };
 function installApi(){w.turnstile={render(target,options){const input=w.document.createElement('input');input.type='hidden';input.name='cf-turnstile-response';target.appendChild(input);widgets.push({target,options,input});return widgets.length;},reset(id){resetCount++;widgets[id-1].input.value='';},remove(){removed++;}};}
 if(api)installApi();
 w.eval(script);w.document.dispatchEvent(new w.Event('DOMContentLoaded'));await settled();
 function find(text){return Array.from(root.querySelectorAll('button')).find(b=>b.textContent===text);}
 function success(){const widget=widgets.at(-1);widget.input.value='local-fixture-token';widget.options.callback(widget.input.value);}
 async function review(){const form=root.querySelector('form');if(!pilot){for(const [name,value]of Object.entries({firstName:'Fixture',lastName:'Test',email:'test@example.invalid',street:'Test',number:'1',postalCode:'11000',city:'Test'})){const input=form.elements.namedItem(name);if(input)input.value=value;}}form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await settled();return find(pilot?(inquiry?'Pokreni test upita':'Pokreni test porudžbine'):(inquiry?'Pošalji upit za ponudu':'Potvrdi porudžbinu'));}
 return{w,dom,root,calls,widgets,find,success,review,installApi,setMode:value=>{mode=value;},setNextState:value=>{nextState=value;},state,resets:()=>resetCount,removed:()=>removed};
}
(async()=>{
 for(const inquiry of [false,true]){
  const f=await fixture({inquiry});try{
   const confirm=await f.review(),widget=f.widgets[0],before=f.calls.length;
   check(confirm.disabled,'Initial pending protection disables final submit');
   confirm.dispatchEvent(new f.w.Event('click',{bubbles:true}));await settled();check(f.calls.length===before,'Missing token sends no network mutation');
   check(widget.options.appearance==='always'&&widget.options.retry==='never','Explicit appearance and human retry retain the same widget');
   check(f.w.getComputedStyle(widget.target).minHeight==='65px','Failed widget retains a visible reserved area');
   widget.options['error-callback']('300030');check(f.root.textContent.includes('Zaštita nije uspela.')&&!f.find('Ponovi proveru').hidden,'Client error is visible with a retry button');
   const reviewNode=f.root.querySelector('.wf-shop-review');f.find('Ponovi proveru').click();await settled();
   check(f.resets()===1&&f.root.querySelector('.wf-shop-review')===reviewNode&&f.calls.length===before,'Manual widget retry preserves review and consumes no quote/submit request');
   f.success();check(!confirm.disabled,'Only success enables final submit');
   widget.options['expired-callback']();check(confirm.disabled&&!f.find('Ponovi proveru').hidden,'Expiry disables final submit and offers retry');
   f.success();widget.options['timeout-callback']();check(confirm.disabled&&f.root.textContent.includes('Vreme za proveru'),'Timeout fails closed with a visible message');
   f.success();widget.input.value='';confirm.click();await settled();check(f.calls.length===before&&confirm.disabled,'An absent response is rejected locally even after a success callback');
   f.success();widget.input.dispatchEvent(new f.w.Event('input',{bubbles:true}));check(f.root.querySelector('.wf-shop-review')===reviewNode&&!confirm.hidden,'Widget response updates do not invalidate the review');
   f.setMode('network');confirm.click();await settled();check(confirm.disabled&&f.resets()===2,'Network failure never re-enables an unverified submit');
   f.success();f.setMode('server');confirm.click();await settled();check(confirm.disabled&&f.resets()===3,'Server failure starts a fresh protection check');
   f.success();f.setMode('conflict');confirm.click();await settled();check(!f.find(inquiry?'Pokreni test upita':'Pokreni test porudžbine')&&!f.find('Proveri i prikaži pregled').hidden,'Stale review exposes a new review action instead of a dead confirmation');
   const refreshed=await f.review();f.success();f.setMode('');refreshed.click();refreshed.click();await settled();
   check(f.root.textContent.includes('Stvarni test je prošao')&&f.removed()===1,'One successful response renders the receipt and removes the widget');
   check(f.calls.filter(c=>c.action==='submit').length===4,'Disabled/double clicks do not create extra submit requests');
  }finally{f.dom.window.close();}
 }
 for(const mode of ['load-error','late-auth-load']){
  const f=await fixture({api:false});try{
   const confirm=await f.review();check(confirm.disabled,'No API means no final submit');
   const script=f.w.document.querySelector('script[src*="turnstile"]');
   if(mode==='load-error'){
    script.onerror();check(!f.find('Ponovi proveru').hidden&&f.root.textContent.includes('nije učitala'),'Script failure has a visible retry');
    const n=f.calls.length;f.find('Ponovi proveru').click();check(f.calls.length===n,'Script retry does not call commerce');
    const retry=f.w.document.querySelector('script[src*="turnstile"]');f.installApi();retry.onload();check(f.widgets.length===1,'Retry mounts exactly one widget');
   }else{
    f.setNextState({...f.state,authenticated:true});await f.w.ElastycCommerce.authChanged();f.installApi();script.onload();
    check(f.widgets.length===0&&!f.root.querySelector('form'),'Late script cannot mount in a detached form after auth change');
   }
  }finally{f.dom.window.close();}
 }
 for(const options of [{provider:false},{preview:true,pilot:false,provider:false},{preview:false,pilot:false,authenticated:true}]){
  const f=await fixture(options);try{
   const confirm=await f.review();
   if(options.provider===false&&options.pilot!==false)check(confirm.disabled&&f.root.textContent.includes('nije dostupna'),'Missing configured provider fails closed visibly');
   else check(!confirm.disabled&&f.widgets.length===0,'Ordinary Candidate simulation and authenticated checkout retain their existing policy');
  }finally{f.dom.window.close();}
 }
 console.log('PASS '+checks+' packaged protection lifecycle checks (local fixture, not a live Turnstile proof).');
})().catch(error=>{console.error(error);process.exitCode=1;});
