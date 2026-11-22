const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const script=fs.readFileSync(path.join(__dirname,'../src/commerce/commerce.js'),'utf8');
const tick=async()=>{for(let i=0;i<12;i++)await new Promise(resolve=>setTimeout(resolve,0));};
let checks=0;function check(value,message){assert(value,message);checks++;}
const base={view:'inquiry',revision:0,cartCount:4,lines:[],favorites:[],favoritesEnabled:true,guestCheckout:true,authenticated:true,preview:true,mergeAvailable:false,
 paths:{request:'/upit',cart:'/korpa',favorites:'/favoriti',account:'/nalog'},customer:{contact:{firstName:'Saved',lastName:'Profile',email:'saved@example.invalid',phone:'+381641234567'},addresses:[]},deliveryOptions:[],pickupOptions:[],paymentOptions:[]};
async function fixture(){
 const dom=new JSDOM('<span data-wf-cart-count>0</span><div data-wf-commerce-url="/page.php?wf_action=commerce&amp;wf_path=%2Fupit"></div><section class="wf-shop"><div data-wf-shop-view="request"></div></section>',{url:'https://shop.example/upit?productId=A',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window,reads=[],posts=[],waiting=[];let clock=20000,auto=false,server=structuredClone(base);
 w.Date.now=()=>clock;w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
 w.BroadcastChannel=class{constructor(){w.testChannel=this;}postMessage(){}};
 const response=state=>({ok:true,status:200,json:async()=>({ok:true,csrf:'a'.repeat(64),state:structuredClone(state)})});
 w.fetch=async(url,options={})=>{
  const body=options.body?JSON.parse(options.body):null;
  if(body){posts.push(body);server.cartCount=9;const r=await response(server).json();if(body.action==='quote')r.quote={id:'b'.repeat(32),lines:[],preview:true};if(body.action==='submit')r.receipt={preview:true};return {ok:true,status:200,json:async()=>r};}
  reads.push(String(url));const compact=new URL(url).searchParams.get('wf_commerce_view')==='inquiry';
  const readResponse=state=>response(compact?state:{...state,view:undefined});
  if(auto)return readResponse(server);
  return new Promise(resolve=>waiting.push(state=>resolve(readResponse(state))));
 };
 w.eval(fs.readFileSync(path.join(__dirname,'../../common/intl-tel-input/dist/js/intlTelInputWithUtils.min.js'),'utf8')+';window.intlTelInput=intlTelInput;');
 w.eval(script);w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
 return {w,dom,reads,posts,waiting,root:w.document.querySelector('[data-wf-shop-view]'),advance:()=>{clock+=16000;},auto:()=>{auto=true;},server:state=>{server=state;}};
}
(async()=>{
 const f=await fixture();try{
  check(!!f.root.querySelector('form') && f.root.querySelector('button[type=submit]').disabled,'Contact fields are present before the context response, while sending remains disabled.');
  const input=f.root.querySelector('[name=firstName]');input.value='Typed';input.dispatchEvent(new f.w.Event('input',{bubbles:true}));input.focus();
  f.root.querySelector('[name=note]').value='Autofilled note';
  for(let i=0;i<5;i++)f.w.dispatchEvent(new f.w.Event('focus'));
  f.w.ElastycCommerce.scan();await tick();
  check(f.reads.length===1 && new URL(f.reads[0]).searchParams.get('wf_commerce_view')==='inquiry','Initial, focus and repeated scans share one lightweight read.');
  f.waiting.shift()(base);await tick();
  const form=f.root.querySelector('form');
  check(form.elements.firstName.value==='Typed' && form.elements.lastName.value==='Profile' && form.elements.note.value==='Autofilled note','Late profile prefill preserves typed/autofilled fields and fills untouched fields.');
  check(f.w.document.activeElement===form.elements.firstName,'Typing focus survives the context transition.');
  check(f.w.document.querySelector('[data-wf-cart-count]').textContent==='4','Compact state retains the real cart count.');
  check(!form.querySelector('[aria-busy=true]') && !form.querySelector('button[type=submit]').disabled,'Ready context replaces pending controls with the normal form.');
  for(let i=0;i<5;i++)f.w.dispatchEvent(new f.w.Event('focus'));await tick();check(f.reads.length===1,'Fresh context is not requested again on each focus.');
  f.advance();for(let i=0;i<5;i++)f.w.dispatchEvent(new f.w.Event('focus'));await tick();check(f.reads.length===2,'An old context refreshes once, even when focus fires repeatedly.');
  const late=f.waiting.shift();
  f.auto();form.dispatchEvent(new f.w.Event('submit',{bubbles:true,cancelable:true}));await tick();
  check(f.posts.map(x=>x.action).join(',')==='quote,submit','Optimized read does not change the protected quote/submit protocol.');
  check(f.w.document.querySelector('[data-wf-cart-count]').textContent==='9','A mutation applies its newer state.');
  late(base);await tick();check(f.w.document.querySelector('[data-wf-cart-count]').textContent==='9','An older read cannot replace a newer mutation response.');
 }finally{f.dom.window.close();}
 const a=await fixture();try{
  a.waiting.shift()(base);await tick();a.advance();a.w.dispatchEvent(new a.w.Event('focus'));await tick();const old=a.waiting.shift();
  const login=a.w.ElastycCommerce.authChanged(false);await tick();
  check(!a.root.textContent.includes('Saved') && a.reads.length===3,'An account change clears the previous profile and starts its own read.');
  const next=structuredClone(base);next.customer.contact.firstName='Other account';next.cartCount=2;a.waiting.shift()(next);await login;await tick();
  old(base);await tick();check(a.root.querySelector('[name=firstName]').value==='Other account' && a.w.document.querySelector('[data-wf-cart-count]').textContent==='2','A late previous-identity response cannot restore private data.');
  a.w.testChannel.onmessage({data:'refresh'});a.w.testChannel.onmessage({data:'refresh'});await tick();check(a.reads.length===4,'Cross-tab refresh messages share a pending read.');a.waiting.shift()(next);await tick();
 }finally{a.dom.window.close();}
 const mixed=await fixture();try{
  const product=mixed.w.document.createElement('div');product.dataset.commerceEnabled='true';mixed.w.document.body.appendChild(product);mixed.w.ElastycCommerce.scan();
  mixed.waiting.shift()(base);await tick();
  check(mixed.reads.length===2 && !new URL(mixed.reads[1]).searchParams.has('wf_commerce_view'),'A product widget added during a compact read receives its separate full state.');
  mixed.waiting.shift()(base);await tick();
  check(!!mixed.root.querySelector('.iti') && !mixed.root.querySelector('button[type=submit]').disabled,'Mixed compositions finish without a compact/full response loop.');
 }finally{mixed.dom.window.close();}
 console.log('Commerce loading:',checks,'checks passed.');
})().catch(error=>{console.error(error);process.exitCode=1;});
