const fs = require('node:fs');
const path = require('node:path');
const {JSDOM} = require('jsdom');
const script = fs.readFileSync(path.join(__dirname, '../src/commerce/commerce.js'), 'utf8');
let checks = 0;
function check(ok, message) { checks++; if (!ok) throw new Error(message); }
const settle = async () => { for (let i = 0; i < 12; i++) await new Promise(resolve => setTimeout(resolve, 0)); };
async function fixture(authenticated = true, protectedForm = false, live = false) {
  const dom = new JSDOM('<div class="wf-instance" data-wf-commerce-url="/page.php?wf_action=commerce&amp;channel=candidate&amp;wf_path=%2Fporudzbina&amp;wf_instance=checkout"><section class="wf-shop" data-wf-shop-view="checkout"></section></div>', {url:'https://shop.example/page.php?channel=candidate&wf_path=%2Fporudzbina'+(live?'&purchase='+ 'e'.repeat(32):''), runScripts:'outside-only', pretendToBeVisual:true});
  const w = dom.window, root = w.document.querySelector('.wf-shop'), calls = [], widgets = [];
  const line = {lineId:'d'.repeat(32),productId:'A',variantId:'',name:'Test artikal',quantity:'1.000',unit:'kom',priceKnown:true,unitPrice:'120.00',total:'120.00',currency:'RSD',eligible:true,action:'buy'};
  const state = {revision:1,lines:[line],favorites:[],favoritesEnabled:false,guestCheckout:true,authenticated,mergeAvailable:false,preview:!protectedForm,protection:{provider:'turnstile',siteKey:'fixture-public-key'},
    totals:{net:'100.00',tax:'20.00',gross:'120.00',currency:'RSD'},paths:{catalog:'/proizvodi',product:'/proizvod',cart:'/korpa',checkout:'/porudzbina',favorites:'/favoriti',request:'/upit-za-ponudu',account:'/nalog'},
    deliveryOptions:[{id:'address',label:'Na adresu'},{id:'pickup',label:'Preuzimanje'}],pickupOptions:[{id:'store',label:'Prodavnica'}],paymentOptions:[{id:'1',label:'Gotovina'}],
    customer:{contact:authenticated?{firstName:'Petar',lastName:'Test',email:'test@example.invalid',phone:''}:{},addresses:authenticated?[{id:'12',street:'Sačuvana ulica',number:'3',postalCode:'11000',city:'Test',label:'Kuća'}]:[]}};
  if(live){state.purchase={id:'e'.repeat(32),amount:'120.00',currency:'RSD'};state.preview=true;state.deliveryOptions=[{id:'pickup',label:'Preuzimanje'}];state.paymentOptions=[{id:'7',label:'Kartica',kind:'card',environment:'live'}];}
  w.fetch = async (url, options) => { const body = options && options.body ? JSON.parse(options.body) : null; if (body) calls.push(body); if(live) check(new URL(url).searchParams.get("purchase") === "e".repeat(32),"Private purchase scope is forwarded to every API request");
    const reply = {ok:true,csrf:'a'.repeat(64),state:structuredClone(state)};
    if (body && body.action === 'quote') reply.quote = {id:'c'.repeat(32),lines:[line],totals:state.totals,preview:true,realPurchase:live};
    if (body && body.action === 'submit') reply.receipt = {preview:!live,caseKey:live?'26S01000001':null,documentKey:null,checkoutId:'c'.repeat(32),paymentRequired:live,paymentEnvironment:live?'live':'test'};
    return {ok:true,status:200,json:async()=>reply};
  };
  w.turnstile = {render(target, options) {const input=w.document.createElement('input');input.type='hidden';input.name='cf-turnstile-response';target.appendChild(input);widgets.push({input,options});return widgets.length;},reset(id){widgets[id-1].input.value='';},remove(){}};
  w.eval(script); w.document.dispatchEvent(new w.Event('DOMContentLoaded')); await settle();
  const button = text => Array.from(root.querySelectorAll('button')).find(item => item.textContent === text);
  const submit = async () => {root.querySelector('form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await settle();};
  return {w,dom,root,state,calls,button,submit,widgets};
}
(async () => {
  const f = await fixture();
  try {
    const panels = f.root.querySelectorAll('.wf-shop-step-panel'), form = f.root.querySelector('form');
    check(panels.length === 3 && !panels[0].hidden && panels[1].hidden && panels[2].hidden, 'Three steps start at contact');
    check(form.elements.firstName.value === 'Petar' && form.elements.email.value === 'test@example.invalid', 'Verified customer profile prefills contact');
    check(f.root.querySelectorAll('.wf-shop-step')[2].disabled, 'A future step is not directly reachable');
    form.elements.email.value = 'invalid'; await f.submit();
    check(!panels[0].hidden && f.calls.length === 0, 'Invalid contact cannot advance or send a quote');
    form.elements.email.value = 'test@example.invalid'; await f.submit();
    check(!panels[1].hidden && panels[0].hidden, 'Valid contact advances to delivery');
    check(form.elements.addressId.value === '12' && form.elements.street.value === 'Sačuvana ulica' && form.elements.street.readOnly, 'Owned saved address is selected and protected from edits');
    f.button('Nova adresa').click(); await settle();
    check(form.elements.addressId.value === '' && !form.elements.street.readOnly, 'New address enables manual input');
    for (const [name,value] of Object.entries({street:'Nova ulica',number:'5',postalCode:'11000',city:'Novo mesto'})) form.elements[name].value = value;
    f.button('Nazad').click(); await settle();
    check(!panels[0].hidden && form.elements.street.value === 'Nova ulica', 'Back navigation preserves address draft');
    await f.submit(); await f.submit();
    check(!panels[2].hidden && panels[1].hidden && f.calls.length === 0, 'Payment is the third step and does not prematurely create a quote');
    await f.submit();
    check(f.calls.length === 1 && f.calls[0].action === 'quote' && f.calls[0].contact.payment === '1', 'Review preserves the existing cash payment code');
    check(f.root.querySelector('.wf-shop-confirmation-details').textContent.includes('Nova ulica 5') && f.root.textContent.includes('Gotovina'), 'Review shows contact, delivery and payment');
    check(f.root.querySelectorAll('.wf-shop-review .wf-shop-lines').length === 1, 'Review renders one item table');
    f.button('Nazad').click(); await settle(); form.elements.city.value = 'Izmena'; form.elements.city.dispatchEvent(new f.w.Event('input',{bubbles:true}));
    check(!f.root.querySelector('.wf-shop-review').children.length, 'Editing delivery invalidates a stale review');
    await f.submit(); await f.submit();
    const confirm = f.button('Potvrdi porudžbinu'); check(!!confirm && !confirm.disabled, 'Candidate cash confirmation is available');
    confirm.click(); confirm.click(); await settle();
    check(f.calls.filter(call => call.action === 'submit').length === 1, 'Double click sends one confirmation');
    check(f.root.textContent.includes('Provera je uspešna'), 'Cash flow reaches its Candidate receipt');
  } finally {f.dom.window.close();}
  const guest = await fixture(false);
  try {
    const form = guest.root.querySelector('form');
    check(!form.elements.addressId && !form.elements.firstName.value, 'Guest sees neither another profile nor shared saved addresses');
    for (const [name,value] of Object.entries({firstName:'Gost',lastName:'Test',email:'guest@example.invalid'})) form.elements[name].value = value;
    await guest.submit(); form.elements.delivery.value = 'pickup'; form.elements.delivery.dispatchEvent(new guest.w.Event('change'));
    check(!form.elements.street.required && form.elements.street.closest('.wf-shop-address').hidden && form.elements.pickup.required, 'Pickup skips shipping address validation');
    await guest.submit(); await guest.submit();
    check(guest.calls[0].contact.delivery === 'pickup' && guest.calls[0].contact.pickup === 'store', 'Pickup uses the configured warehouse choice');
  } finally {guest.dom.window.close();}
  const protectedGuest = await fixture(false, true);
  try {
    const form = protectedGuest.root.querySelector('form');
    for (const [name,value] of Object.entries({firstName:'Gost',lastName:'Test',email:'guest@example.invalid',street:'Test',number:'1',postalCode:'11000',city:'Test'}))form.elements[name].value=value;
    check(protectedGuest.widgets.length===0,'Protection does not expire while the buyer enters the first step');
    await protectedGuest.submit();await protectedGuest.submit();
    check(protectedGuest.widgets.length===1,'Protection starts on the payment step');
    await protectedGuest.submit();const confirm=protectedGuest.button('Potvrdi porudžbinu');
    check(confirm.disabled,'Pending protection disables the final confirmation');
    const widget=protectedGuest.widgets[0];widget.input.value='fixture-token';widget.options.callback('fixture-token');
    check(!confirm.disabled,'A successful protection callback enables confirmation');
    widget.options['expired-callback']();check(confirm.disabled,'Protection expiry still blocks the new three-step checkout');
    protectedGuest.button('Ponovi proveru').click();await settle();
    check(protectedGuest.root.querySelector('.wf-shop-review h2') && protectedGuest.calls.filter(c=>c.action==='quote').length===1,'Protection retry retains the reviewed order');
  }finally{protectedGuest.dom.window.close();}
  const live = await fixture(false, false, true);
  try {
    const form=live.root.querySelector('form');
    check(live.root.textContent.includes('Stvarna probna kupovina') && live.widgets.length===0,'Real purchase is explicit before buyer contact and protection starts later');
    for(const [name,value]of Object.entries({firstName:'Kupac',lastName:'Test',email:'buyer@example.com'}))form.elements[name].value=value;
    await live.submit();await live.submit();await live.submit();
    const confirm=live.button('Potvrdi stvarnu porudžbinu');check(!!confirm && confirm.disabled && live.widgets.length===1,'Live Candidate confirmation always requires protection');
    check(!live.root.textContent.includes('bez kreiranja stvarne porudžbine'),'A real purchase never claims to be a simulation');
    const widget=live.widgets[0];widget.input.value='fixture-token';widget.options.callback('fixture-token');confirm.click();await settle();
    check(live.root.textContent.includes('Porudžbina 26S01000001 je kreirana') && !!live.button('Nastavi na AllSecure plaćanje'),'Real order receipt names AllSecure and requires a separate payment action');
    check(!live.calls.some(call=>call.action==='payment-start'),'Order confirmation does not automatically initiate payment');
  } finally {live.dom.window.close();}
  console.log('Commerce three-step checkout:', checks, 'checks passed');
})().catch(error => {console.error(error);process.exitCode=1;});
