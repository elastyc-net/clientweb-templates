(() => {
  const sandbox = window.parent !== window || !!document.querySelector('base[target="_blank"]');
  const query = new URLSearchParams(location.search);
  const candidate = query.get('channel') === 'candidate';
  let preview = sandbox || candidate;
  let trial = false;
  function route(path) {
    if (!candidate) return path;
    const params = new URLSearchParams({channel:'candidate',wf_path:path});
    const release = query.get('release');
    if (release && /^r-[0-9]{14}-[a-f0-9]{8}-[a-f0-9]{12}$/.test(release)) params.set('release',release);
    return '/page.php?' + params;
  }
  document.querySelectorAll('[data-dt-route]').forEach(a => a.href = route(a.dataset.dtRoute));
  const header = document.querySelector('[data-dt-header]');
  let checking = 0;
  function paint(user) {
    if (!header) return;
    header.querySelector('[data-dt-guest]').hidden = !!user;
    const details = header.querySelector('[data-dt-account]');
    details.hidden = !user;
    details.open = false;
    header.querySelector('[data-dt-name]').textContent = user?.displayName || 'Moj profil';
    header.querySelector('[data-dt-avatar]').textContent = (user?.displayName || '').trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase();
    header.querySelector('[data-dt-group]').textContent = user?.userGroup || 'Korisnički račun';
  }
  async function session() {
    if (sandbox) return;
    const generation = ++checking;
    try {
      const r = await fetch('/incKomponente/auth/config.php',{credentials:'same-origin',cache:'no-store'});
      const data = await r.json();
      if (generation === checking && data.ok) paint(data.user);
    } catch { /* Keep the normal login link available. */ }
  }
  if (header) {
    header.querySelector('[data-dt-logout]').addEventListener('click',async event=>{
      const button=event.currentTarget;button.disabled=true;
      const error=header.querySelector('[data-dt-auth-error]');error.textContent='';
      try {
        const r=await fetch('/incKomponente/auth/logout.php',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:'{}'});
        if (!r.ok || !(await r.json()).ok) throw new Error();
        ++checking;paint(null);location.replace(route('/prijava'));
      } catch {error.textContent='Odjava nije uspjela. Pokušajte ponovo.';button.disabled=false;}
    });
    const details=header.querySelector('details');
    details.addEventListener('keydown',e=>{if(e.key==='Escape'){details.open=false;details.querySelector('summary').focus();}});
    document.addEventListener('click',e=>{if(!details.contains(e.target))details.open=false;});
    window.addEventListener('pageshow',session);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)session();});
    session();
  }
  function loadScript(src) {
    return new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=reject;document.head.append(script);});
  }
  function stylesheet(href){const link=document.createElement('link');link.rel='stylesheet';link.href=href;document.head.append(link);}
  const login=document.querySelector('[data-dt-login]');
  if(login){
    if(sandbox){login.innerHTML='<form class="dt-form"><div class="dt-field"><label>Korisničko ime<input class="dt-control" autocomplete="username" disabled></label></div><div class="dt-field"><label>Lozinka<input class="dt-control" type="password" autocomplete="current-password" disabled></label></div><button class="dt-button" disabled>Prijava</button></form>';}
    else {
      stylesheet('/common/Elastyc/FrontAuth/front-auth.css?v=8');
      loadScript('/common/Elastyc/FrontAuth/front-auth.js?v=23').then(()=>{
        window.ElastycFrontAuth.init({host:login,title:false,stayOnPage:true,returnUrl:route('/prijava'),onSessionChange:session});
      }).catch(()=>login.textContent='Prijava se nije učitala. Osvježite stranicu.');
    }
  }
  const host=document.querySelector('[data-dt-warranty]');
  if(!host)return;
  const previewFields=[
  {
    "key": "field1320",
    "naziv": "Detalji kupnje",
    "tip": "label",
    "obavezno": "F",
    "tooltip": "",
    "connectedfield": "",
    "connectedfieldvalue": ""
  },
  {
    "key": "field1321",
    "naziv": " Datum kupnje",
    "tip": "datum",
    "obavezno": "T",
    "tooltip": "",
    "connectedfield": "",
    "connectedfieldvalue": ""
  },
  {
    "key": "field1322",
    "naziv": "Naziv trgovine ili web prodajnog mjesta",
    "tip": "text",
    "obavezno": "T",
    "tooltip": "",
    "connectedfield": "",
    "connectedfieldvalue": ""
  },
  {
    "key": "field1323",
    "naziv": "Broj računa",
    "tip": "text",
    "obavezno": "T",
    "tooltip": "",
    "connectedfield": "",
    "connectedfieldvalue": ""
  },
  {
    "key": "field1348",
    "naziv": "Cijena uređaja",
    "tip": "numeric",
    "obavezno": "T",
    "tooltip": "",
    "connectedfield": "",
    "connectedfieldvalue": ""
  },
  {
    "key": "field1797",
    "naziv": "Naziv tvrtke instalatera",
    "tip": "text",
    "obavezno": "F",
    "tooltip": "",
    "connectedfield": "",
    "connectedfieldvalue": ""
  },
  {
    "key": "field1324",
    "naziv": "Preslika računa",
    "tip": "file",
    "obavezno": "T",
    "tooltip": "",
    "connectedfield": "",
    "connectedfieldvalue": ""
  },
  {
    "key": "field1326",
    "naziv": "Osobni podaci",
    "tip": "label",
    "obavezno": "F",
    "tooltip": "",
    "connectedfield": "",
    "connectedfieldvalue": ""
  },
  {
    "key": "field1327",
    "naziv": "Ime",
    "tip": "text",
    "obavezno": "T",
    "tooltip": "",
    "connectedfield": "",
    "connectedfieldvalue": ""
  },
  {
    "key": "field1328",
    "naziv": "Prezime",
    "tip": "text",
    "obavezno": "T",
    "tooltip": "",
    "connectedfield": "",
    "connectedfieldvalue": ""
  },
  {
    "key": "field2745",
    "naziv": "OIB",
    "tip": "text",
    "obavezno": "T",
    "tooltip": "U slučaju pravne osobe, upisati OIB od pravne osobe",
    "connectedfield": "",
    "connectedfieldvalue": ""
  },
  {
    "key": "field1330",
    "naziv": "Email adresa",
    "tip": "text",
    "obavezno": "T",
    "tooltip": "",
    "connectedfield": "",
    "connectedfieldvalue": ""
  },
  {
    "key": "field1331",
    "naziv": "Kontakt broj",
    "tip": "text",
    "obavezno": "T",
    "tooltip": "",
    "connectedfield": "",
    "connectedfieldvalue": ""
  },
  {
    "key": "field1332",
    "naziv": "Adresa",
    "tip": "text",
    "obavezno": "T",
    "tooltip": "",
    "connectedfield": "",
    "connectedfieldvalue": ""
  },
  {
    "key": "field1333",
    "naziv": "Mjesto",
    "tip": "text",
    "obavezno": "T",
    "tooltip": "",
    "connectedfield": "",
    "connectedfieldvalue": ""
  },
  {
    "key": "field1334",
    "naziv": "Poštanski broj",
    "tip": "text",
    "obavezno": "T",
    "tooltip": "",
    "connectedfield": "",
    "connectedfieldvalue": ""
  },
  {
    "key": "field1336",
    "naziv": "Proizvođač",
    "tip": "select",
    "obavezno": "T",
    "tooltip": "",
    "connectedfield": "",
    "connectedfieldvalue": "",
    "options": [
      {
        "value": "Gree",
        "label": "Gree"
      },
      {
        "value": "Azuri",
        "label": "Azuri"
      }
    ]
  },
  {
    "key": "field1796",
    "naziv": "Slika serijskog broja 1 - Molimo priložite sliku serijskog broja unutarnje jedinice",
    "tip": "file",
    "obavezno": "F",
    "tooltip": "Serijski broj nalazi se na naljepnici unutarnje jedinice. Najčešće se nalazi na okviru maske uređaja.",
    "connectedfield": "",
    "connectedfieldvalue": ""
  },
  {
    "key": "field1807",
    "naziv": "Slika serijskog broja 2 - Molimo priložite sliku serijskog broja vanjske jedinice",
    "tip": "file",
    "obavezno": "F",
    "tooltip": "",
    "connectedfield": "",
    "connectedfieldvalue": ""
  },
  {
    "key": "field1802",
    "naziv": "Da biste dovršili registraciju, molimo Vas da potvrdite:",
    "tip": "label",
    "obavezno": "F",
    "tooltip": "",
    "connectedfield": "",
    "connectedfieldvalue": ""
  },
  {
    "key": "field1801",
    "naziv": "Prihvaćam opće uvjete dodatnog jamstva i pravila privatnosti",
    "tip": "checkbox",
    "obavezno": "T",
    "tooltip": "",
    "connectedfield": "",
    "connectedfieldvalue": ""
  }
]
;
  let schema,token,requestId,phone,busy=false,submitted=false;
  const inputs=new Map();
  function node(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e;}
  function showError(key,message){const entry=inputs.get(key);if(!entry)return;entry.error.textContent=message;entry.input.setAttribute('aria-invalid',message?'true':'false');}
  function validate(entry){
    const {field:f,input:i}=entry;let value=i.type==='checkbox'?(i.checked?'T':'F'):i.value.trim();
    if(i.type!=='file'&&i.type!=='checkbox')i.value=value;
    let error='';
    if(f.obavezno==='T'&&(!value||i.type==='checkbox'&&!i.checked||i.type==='file'&&!i.files.length))error='Ovo polje je obavezno.';
    else if(i.type==='email'&&value&&!i.validity.valid)error='Unesite ispravnu email adresu.';
    else if(!sandbox&&f.key==='field1331'&&value&&(!phone||!phone.isValidNumber()))error=phone?'Unesite ispravan kontakt broj.':'Provjera telefona nije dostupna. Osvježite stranicu.';
    else if(i.type==='number'&&value&&(!i.validity.valid||!Number.isFinite(Number(value))||Number(value)<0))error='Unesite ispravnu cijenu.';
    else if(i.type==='date'&&value&&(!i.validity.valid||value>new Date().toLocaleDateString('en-CA')))error='Provjerite datum kupnje.';
    else if(i.type==='file'&&i.files.length){const file=i.files[0];if(file.size>8*1024*1024)error='Najveća dopuštena veličina je 8 MB.';else if(!/\.(pdf|jpe?g|png)$/i.test(file.name))error='Priložite PDF, JPG ili PNG datoteku.';}
    showError(f.key,error);return !error;
  }
  function render(fields){
    host.textContent='';
    if(trial)host.append(node('p','dt-notice','Kontrolisana testna prijava — nije stvarni zahtjev za jamstvo.'));
    if(preview)host.append(node('p','dt-notice','Pregled nove forme — slanje je isključeno i neće se kreirati predmet.'));
    const form=node('form','dt-form');form.noValidate=true;
    let group;
    function section(title){group=node('fieldset');group.append(node('legend','',title));form.append(group);}
    for(const f of fields){
      if(f.tip==='label'){section(f.naziv);continue;}
      if(f.key==='field1336')section('Uređaj i prilozi');
      if(!group)section('Podaci prijave');
      const wrap=node('div','dt-field'+(f.tip==='file'?' dt-field-wide':'')+(f.tip==='checkbox'?' dt-field-wide dt-check':''));
      const id='dt-'+f.key;const label=node('label','',f.naziv.trim());label.htmlFor=id;
      if(f.obavezno==='T'){const a=node('span','dt-required','*');a.setAttribute('aria-hidden','true');label.append(a);}
      const input=node(f.tip==='select'?'select':'input',f.tip==='checkbox'?'dt-checkbox':'dt-control');input.id=id;input.name=f.key;input.required=f.obavezno==='T';
      if(f.tip==='select'){
        input.append(new Option('Odaberite proizvođača',''));
        for(const option of f.options||[])input.append(new Option(option.label,option.value));
      }else input.type={text:'text',numeric:'number',datum:'date',file:'file',checkbox:'checkbox'}[f.tip]||'text';
      if(input.type==='checkbox')input.value='T';
      if(input.type==='text')input.maxLength=500;
      if(f.tip==='numeric'){input.min='0';input.step='0.01';input.inputMode='decimal';}
      if(f.tip==='datum')input.max=new Date().toLocaleDateString('en-CA');
      if(f.tip==='file')input.accept='.pdf,.jpg,.jpeg,.png';
      const auto={field1327:'given-name',field1328:'family-name',field1330:'email',field1331:'tel',field1332:'street-address',field1333:'address-level2',field1334:'postal-code'};
      if(auto[f.key])input.autocomplete=auto[f.key];
      if(f.key==='field1330'){input.type='email';input.inputMode='email';input.autocapitalize='none';input.spellcheck=false;}
      if(f.key==='field1331'){input.type='tel';input.placeholder='';}
      const help=node('p','dt-help',f.tooltip|| (f.tip==='file'?'PDF, JPG ili PNG · do 8 MB':''));help.id=id+'-help';
      const error=node('p','dt-field-error');error.id=id+'-error';error.setAttribute('aria-live','polite');
      input.setAttribute('aria-describedby',help.id+' '+error.id);
      if(f.tip==='checkbox'){const text=node('div');text.append(label,help,error);wrap.append(input,text);}else wrap.append(label,input,help,error);
      group.append(wrap);const entry={field:f,input,error};inputs.set(f.key,entry);
      input.addEventListener('blur',()=>validate(entry));
      input.addEventListener('input',()=>{if(input.getAttribute('aria-invalid')==='true')validate(entry);});
      input.addEventListener('change',()=>validate(entry));
    }
    const actions=node('div','dt-actions');actions.append(node('p','','* Obavezna polja'));
    const button=node('button','dt-button','Pošalji prijavu');button.type='submit';actions.append(button);form.append(actions);
    const status=node('p','dt-status');status.setAttribute('role','status');form.append(status);host.append(form);
    const phoneInput=inputs.get('field1331').input;
    if(!sandbox){
    stylesheet('/common/intl-tel-input/dist/css/intlTelInput.min.css?v=29.1.2');
    loadScript('/common/intl-tel-input/dist/js/intlTelInputWithUtils.min.js?v=29.1.2').then(()=>{
      phone=window.intlTelInput(phoneInput,{initialCountry:'hr',countryOrder:['hr'],countrySelectorMode:'DROPDOWN',countryNameLocale:'hr',allowedNumberTypes:null,allowNumberExtensions:false,allowPhonewords:false,numberDisplayFormat:'NATIONAL',placeholderNumberPolicy:'OFF',separateDialCode:true,strictMode:true});
      phoneInput.addEventListener('countrychange',()=>{if(phoneInput.value)validate(inputs.get('field1331'));});
    }).catch(()=>{status.textContent='Provjera telefona nije dostupna. Osvježite stranicu prije slanja.';status.classList.add('dt-error');});
    }
    form.addEventListener('submit',async e=>{
      e.preventDefault();if(busy||submitted)return;
      const invalid=Array.from(inputs.values()).filter(entry=>!validate(entry));
      if(invalid.length){status.textContent='Provjerite označena polja.';status.classList.add('dt-error');invalid[0].input.focus();return;}
      if(preview){status.classList.remove('dt-error');status.textContent='Podaci su provjereni. Ovo je pregled — prijava nije poslana.';return;}
      busy=true;button.disabled=true;button.textContent='Slanje…';status.textContent='';
      const data=new FormData(form);data.set('field1331',phone.getNumber());data.set('csrf',token);data.set('schemaHash',schema);data.set('requestId',requestId);
      try{
        const r=await fetch('/deltron-jamstvo.php',{method:'POST',credentials:'same-origin',body:data});const result=await r.json();
        if(!r.ok||!result.ok){for(const [key,message] of Object.entries(result.fields||{}))showError(key,message);throw new Error(result.message||'Prijava nije poslana. Sačuvan je vaš unos.');}
        submitted=true;host.textContent='';const panel=node('div','dt-success');panel.setAttribute('role','status');panel.append(node('h2','','Prijava je zaprimljena'),node('p','','Broj prijave: '+result.acckey));if(result.followup?.errors?.length)panel.append(node('p','dt-notice','Prijava je spremljena. Potvrda ili obavijesti još nisu potvrđene. Nemojte ponavljati prijavu; sačuvajte broj prijave za provjeru.'));host.append(panel);panel.tabIndex=-1;panel.focus();
      }catch(error){status.textContent=error.message||'Nije moguće potvrditi ishod. Provjerite prijavu prije ponovnog slanja.';status.classList.add('dt-error');}
      finally{busy=false;button.disabled=false;button.textContent='Pošalji prijavu';}
    });
  }
  if(sandbox){render(previewFields);return;}
  fetch('/deltron-jamstvo.php',{credentials:'same-origin',cache:'no-store'}).then(async r=>{const data=await r.json();if(!r.ok||!data.ok)throw new Error(data.message);schema=data.schemaHash;token=data.csrf;requestId=data.requestId;if(candidate&&query.get('deltron_trial')==='1'&&data.trialAllowed===true){preview=false;trial=true;}render(data.fields);}).catch(()=>{host.textContent='Obrazac trenutno nije dostupan. Osvježite stranicu ili pokušajte ponovo kasnije.';});
})();
