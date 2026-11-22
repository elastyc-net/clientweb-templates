/* Direct inquiry integration fixture: no real Cloudflare token or business write. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM} = require('jsdom');
const component = JSON.parse(fs.readFileSync(path.join(__dirname, '../packages/webfront-commerce/1.2.4/components/commerce-request.json')));
const script = component.scripts.find(asset => asset.name === 'commerce.js').content;
let checks = 0;
function check(value, message) { assert(value, message); checks++; }
const settle = async () => { for (let i = 0; i < 12; i++) await new Promise(resolve => setTimeout(resolve, 0)); };
async function fixture({protectedForm = true, provider = true, phoneReady = true, contact = {}} = {}) {
  const dom = new JSDOM('<div data-wf-commerce-url="/page.php?wf_action=commerce"></div><section class="wf-shop"><div data-wf-shop-view="request"></div></section>', {url:'https://shop.example/upit-za-ponudu?productId=PAR0225&variantId=row%3A1&quantity=2', runScripts:'outside-only'});
  const w = dom.window, root = w.document.querySelector('[data-wf-shop-view]'), calls = [], widgets = [];
  let mode = '', releaseQuote, resets = 0;
  const state = {customer:{contact},revision:1,lines:[],favorites:[],guestCheckout:true,authenticated:false,preview:!protectedForm,paths:{request:'/upit-za-ponudu'},protection:{provider:provider?'turnstile':'unavailable',siteKey:'local-fixture'}};
  w.fetch = async (url, options = {}) => {
    const body = options.body ? JSON.parse(options.body) : null;
    if (body) calls.push(body);
    if (body && body.action === 'quote' && mode === 'defer') await new Promise(resolve => {releaseQuote = resolve;});
    if (body && body.action === 'submit' && mode === 'network') throw new Error('Mreža nije dostupna.');
    if (body && body.action === 'submit' && mode === 'conflict') return {ok:false,status:409,json:async()=>({ok:false,message:'Napravite novi pregled.'})};
    const reply = {ok:true,csrf:'a'.repeat(64),state:structuredClone(state)};
    if (body && body.action === 'quote') reply.quote = {id:'c'.repeat(32),lines:[],preview:!protectedForm};
    if (body && body.action === 'submit') reply.receipt = {preview:!protectedForm,caseKey:'TEST-ONLY'};
    return {ok:true,status:200,json:async()=>reply};
  };
  w.turnstile = {render(target, options) {const input=w.document.createElement('input');input.name='cf-turnstile-response';input.type='hidden';target.appendChild(input);widgets.push({input,options});return widgets.length;},reset(id){resets++;widgets[id-1].input.value='';},remove(){}};
  w.matchMedia = () => ({matches:false,addEventListener(){},removeEventListener(){}});
  if (phoneReady) w.eval(fs.readFileSync(path.join(__dirname, '../../common/intl-tel-input/dist/js/intlTelInputWithUtils.min.js'), 'utf8')+';window.intlTelInput=intlTelInput;');
  w.eval(script); w.document.dispatchEvent(new w.Event('DOMContentLoaded')); await settle();
  const form = root.querySelector('form'), send = form.querySelector('button[type=submit]');
  for (const [name,value] of Object.entries({firstName:'Test',lastName:'Kupac',email:'test@example.invalid',note:'Fixture'})) form.elements[name].value=value;
  const submit = () => form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
  const success = () => {const widget=widgets.at(-1);widget.input.value='local-token';widget.options.callback('local-token');};
  return {w,dom,root,form,send,calls,widgets,submit,success,setMode:value=>{mode=value;},release:()=>releaseQuote(),resets:()=>resets};
}
(async()=>{
  const f = await fixture();
  try {
    check(f.send.textContent==='Pošalji upit za ponudu' && f.send.disabled, 'One clear send action waits for protection');
    f.submit(); await settle(); check(f.calls.length===0,'Programmatic submit cannot bypass pending protection');
    check(f.widgets[0].options.appearance==='interaction-only','Cloudflare displays a widget only when interaction is needed');
    f.success(); check(!f.send.disabled && f.root.querySelector('.wf-shop-protection [role=status]').hidden,'Successful background check enables the direct action quietly');
    for (const phone of ['1','abc','1234','+1234567890123456']) {
      f.form.elements.phone.value=phone;f.submit();await settle();check(f.calls.length===0 && !f.form.elements.phone.checkValidity(),'Invalid phone blocks all network mutations: '+phone);
    }
    f.form.elements.phone.value='0641234567';f.form.elements.phone.dispatchEvent(new f.w.Event('focusout',{bubbles:true}));
    check(f.w.intlTelInput.getInstance(f.form.elements.phone).getNumber()==='+381641234567' && f.form.elements.phone.value!=='0641234567','National phone formats after leaving the field');
    for(const email of ['bad','test@localhost','test@@example.rs']) {f.form.elements.email.value=email;f.submit();await settle();check(f.calls.length===0 && !f.form.elements.email.checkValidity(),'Invalid email blocks sending: '+email);}
    f.form.elements.email.value=' test@example.rs ';f.submit();f.submit();await settle();
    check(f.calls.map(call=>call.action).join(',')==='quote,submit','One user action validates and sends exactly once');
    check(f.calls[0].contact.phone==='+381641234567' && f.calls[0].contact.email==='test@example.rs','Payload contains normalized contact data');
    check(f.calls[0].productId==='PAR0225' && f.calls[0].variantId==='row:1' && f.calls[0].quantity==='2','Inquiry retains the selected product, variant and quantity');
    check(f.calls[1].protectionToken==='local-token' && f.root.textContent.includes('Upit je poslat'),'Protected send reaches its receipt');
    check(!f.root.textContent.includes('Pregled upita') && !f.root.querySelector('form'),'No extra review or confirmation screen');
  } finally {f.dom.window.close();}
  const slow = await fixture();
  try {
    slow.success();slow.setMode('defer');slow.submit();slow.submit();await settle();
    check(slow.calls.length===1 && slow.form.elements.firstName.disabled && slow.form.querySelector('.iti__selected-country').disabled,'Pending validation locks contact edits and double submits');
    slow.release();await settle();check(slow.calls.length===2,'Deferred validation still sends only once');
  }finally{slow.dom.window.close();}
  for(const mode of ['network','conflict']) {
    const retry=await fixture();try {
      retry.success();retry.setMode(mode);retry.submit();await settle();
      check(retry.root.querySelector('[role=alert]').textContent && !retry.form.elements.firstName.disabled && retry.form.elements.note.value==='Fixture','Failure preserves contact and note for correction');
      check(retry.resets()===1 && retry.send.disabled,'Failure requires a fresh protection token');
      retry.setMode('');retry.success();retry.submit();await settle();
      check(retry.calls.filter(call=>call.action==='quote').length===(mode==='network'?1:2),'Retry retains the same quote unless the server rejected it as stale');
      check(retry.root.textContent.includes('Upit je poslat'),'Retry reaches receipt');
    }finally{retry.dom.window.close();}
  }
  const expiry=await fixture();try {
    expiry.success();expiry.widgets[0].options['expired-callback']();expiry.submit();await settle();
    check(expiry.send.disabled && expiry.calls.length===0,'Expired tokens block the single send action');
    expiry.success();expiry.widgets[0].input.value='';expiry.submit();await settle();
    check(expiry.calls.filter(call=>call.action==='submit').length===0,'A callback without a present response cannot send');
  }finally{expiry.dom.window.close();}
  const missing=await fixture({provider:false});try {missing.submit();await settle();check(missing.send.disabled && missing.calls.length===0,'Unavailable protection fails closed');}finally{missing.dom.window.close();}
  const preview=await fixture({protectedForm:false});try {preview.submit();await settle();check(preview.calls.length===2 && preview.calls[0].contact.phone==='' && preview.root.textContent.includes('Provera je uspešna'),'Candidate and optional empty phone retain safe preview behavior');}finally{preview.dom.window.close();}
  const foreign=await fixture({protectedForm:false});try {
    const input=foreign.form.elements.phone, widget=foreign.w.intlTelInput.getInstance(input);
    check(widget.getSelectedCountry().iso2==='rs' && foreign.form.querySelector('.iti__selected-country'),'Phone starts with a real Serbia country selector');
    widget.setSelectedCountry('gb');input.value='020 7946 0018';foreign.submit();await settle();
    check(foreign.calls[0].contact.phone==='+442079460018','Selected UK country converts a national landline to E.164');
    check(foreign.root.textContent.includes('Provera je uspešna'),'Country phone works with the single-action Candidate inquiry');
  }finally{foreign.dom.window.close();}
  const prefill=await fixture({protectedForm:false,contact:{phone:'+33612345678'}});try {
    const input=prefill.form.elements.phone,widget=prefill.w.intlTelInput.getInstance(input);
    check(widget.getSelectedCountry().iso2==='fr' && widget.getNumber()==='+33612345678','Saved international phone selects its own country without changing the number');
    prefill.form.elements.note.value='Edited';prefill.form.elements.note.dispatchEvent(new prefill.w.Event('input',{bubbles:true}));
    check(widget.getSelectedCountry().iso2==='fr','Editing another field preserves the selected country');
  }finally{prefill.dom.window.close();}
  const changed=await fixture();try {
    const input=changed.form.elements.phone,widget=changed.w.intlTelInput.getInstance(input);
    widget.setNumber('+381112630753');changed.success();changed.setMode('network');changed.submit();await settle();
    check(changed.calls[0].contact.phone==='+381112630753','Serbian landlines remain valid');
    check(!changed.form.querySelector('.iti__selected-country').disabled,'Failed send restores country selector');
    widget.setSelectedCountry('gb');input.value='07911 123456';changed.setMode('');changed.success();changed.submit();await settle();
    const quotes=changed.calls.filter(call=>call.action==='quote');
    check(quotes.length===2 && quotes[1].contact.phone==='+447911123456','Changing country invalidates a retained quote and sends the new international number');
  }finally{changed.dom.window.close();}
  const loading=await fixture({protectedForm:false,phoneReady:false});try {
    loading.form.elements.phone.value='0641234567';loading.submit();await settle();
    check(loading.calls.length===0 && !loading.form.elements.phone.checkValidity(),'Nonempty phone cannot send before its country control is ready');
    loading.w.document.querySelector('script[src*="intlTelInputWithUtils"]').dispatchEvent(new loading.w.Event('error'));await settle();
    const retry=Array.from(loading.form.querySelectorAll('button')).find(button=>button.textContent==='Ponovo učitaj telefon');
    check(!retry.hidden,'Loading failure offers an explicit phone-control retry');
    retry.click();loading.w.eval(fs.readFileSync(path.join(__dirname, '../../common/intl-tel-input/dist/js/intlTelInputWithUtils.min.js'), 'utf8')+';window.intlTelInput=intlTelInput;');
    loading.w.document.querySelector('script[src*="intlTelInputWithUtils"]').dispatchEvent(new loading.w.Event('load'));await settle();
    loading.submit();await settle();check(loading.calls[0].contact.phone==='+381641234567','Retry mounts the real control without losing the entered phone');
  }finally{loading.dom.window.close();}
  const optional=await fixture({protectedForm:false,phoneReady:false});try {optional.submit();await settle();check(optional.calls[0].contact.phone==='' && optional.calls.length===2,'Optional empty phone does not block sending when its assets are unavailable');}finally{optional.dom.window.close();}
  const cleanup=await fixture({protectedForm:false});try {
    const input=cleanup.form.elements.phone;await cleanup.w.ElastycCommerce.authChanged(false);await settle();
    check(!cleanup.w.intlTelInput.getInstance(input) && cleanup.root.querySelectorAll('.iti').length===1,'Changing identity destroys the old phone widget and mounts one clean instance');
  }finally{cleanup.dom.window.close();}
  console.log('Direct inquiry:', checks, 'checks passed (local fixture).');
})().catch(error=>{console.error(error);process.exitCode=1;});
