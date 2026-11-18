(()=>{
  'use strict';
  const root=document.querySelector('[data-mp-references]');
  if(!root||root.dataset.ready)return;
  root.dataset.ready='true';
  const cards=Array.from(root.querySelectorAll('[data-mp-project]'));
  const search=root.querySelector('[data-mp-search]');
  const type=root.querySelector('[data-mp-type]');
  const sector=root.querySelector('[data-mp-sector]');
  const count=root.querySelector('[data-mp-count]');
  const more=root.querySelector('[data-mp-more]');
  const empty=root.querySelector('[data-mp-empty]');
  const dialog=root.querySelector('dialog');
  const normalize=s=>s.toLocaleLowerCase('sr-Latn').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'dj');
  let limit=12,focusBefore=null,hashBefore='',scrollBefore='';
  function syncURL(){
    try{const u=new URL(location.href);[['q',search.value],['pod',type.value],['prostor',sector.value]].forEach(([k,v])=>v?u.searchParams.set(k,v):u.searchParams.delete(k));history.replaceState(null,'',u);}catch(_){/* An opaque CMS sandbox can deny History. Filters still work. */}
  }
  function apply(reset=true,remember=true){
    if(reset)limit=12;
    const q=normalize(search.value.trim());
    const matches=cards.filter(c=>(!type.value||c.dataset.type===type.value)&&(!sector.value||c.dataset.sector===sector.value)&&(!q||normalize(c.textContent).includes(q)));
    const visible=new Set(matches.slice(0,limit));cards.forEach(c=>c.hidden=!visible.has(c));
    count.textContent=`Prikazano ${Math.min(limit,matches.length)} od ${matches.length} projekata`;
    empty.hidden=matches.length!==0;more.hidden=matches.length<=limit;
    more.textContent=`Prikažite još projekata (${Math.max(0,matches.length-limit)})`;
    if(remember)syncURL();
  }
  function reset(){search.value='';type.value='';sector.value='';apply();}
  root.querySelectorAll('[data-mp-reset]').forEach(b=>b.addEventListener('click',reset));
  search.addEventListener('input',()=>apply());type.addEventListener('change',()=>apply());sector.addEventListener('change',()=>apply());
  more.addEventListener('click',()=>{limit+=12;apply(false);});
  function readURL(){try{const p=new URL(location.href).searchParams;search.value=p.get('q')||'';type.value=p.get('pod')||'';sector.value=p.get('prostor')||'';}catch(_){}apply(true,false);}
  readURL();
  const title=dialog.querySelector('[data-mp-title]'),photo=dialog.querySelector('[data-mp-photo]'),floor=dialog.querySelector('[data-mp-floor]'),space=dialog.querySelector('[data-mp-space]'),catalog=dialog.querySelector('[data-mp-catalog]'),contact=dialog.querySelector('[data-mp-contact]');
  function openProject(id,remember=true){
    const card=cards.find(c=>c.dataset.mpProject===id);if(!card)return;
    if(typeof dialog.showModal!=='function')return;
    if(!dialog.open){focusBefore=document.activeElement;hashBefore=location.hash;scrollBefore=document.body.style.overflow;}
    title.textContent=card.dataset.name;photo.src=card.querySelector('img').src;photo.alt=`${card.dataset.name} — ${card.dataset.type}`;
    floor.textContent=card.dataset.type;space.textContent=card.dataset.sector;
    catalog.href='/katalog?category='+encodeURIComponent(card.dataset.type==='PVC podovi'?'PVC Podovi':card.dataset.type);
    contact.href='mailto:megapod@megapod.rs?subject='+encodeURIComponent('Upit za projekat po uzoru na '+card.dataset.name);
    if(!dialog.open)dialog.showModal();document.body.style.overflow='hidden';
    if(remember)try{const u=new URL(location.href);u.hash='projekat-'+id;history.replaceState(null,'',u);}catch(_){}
  }
  root.addEventListener('click',e=>{const link=e.target.closest('[data-mp-open]');if(!link||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;if(typeof dialog.showModal!=='function')return;e.preventDefault();openProject(link.dataset.mpOpen);});
  dialog.querySelector('[data-mp-close]').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
  dialog.addEventListener('close',()=>{document.body.style.overflow=scrollBefore;try{const u=new URL(location.href);u.hash=hashBefore.startsWith('#projekat-')?'':hashBefore;history.replaceState(null,'',u);}catch(_){}if(focusBefore&&focusBefore.isConnected)focusBefore.focus({preventScroll:true});});
  function hashProject(){const id=location.hash.replace(/^#projekat-/,'');if(location.hash.startsWith('#projekat-'))openProject(id,false);}
  window.addEventListener('popstate',()=>{readURL();hashProject();});window.addEventListener('hashchange',hashProject);hashProject();
})();
