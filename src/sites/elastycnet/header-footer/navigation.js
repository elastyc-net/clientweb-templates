(function(){
  document.querySelectorAll('[data-es-nav]').forEach(function(nav){
    if(nav.dataset.esReady==='true')return;
    nav.dataset.esReady='true';
    var header=nav.closest('[data-wf-header]');
    var toggle=nav.querySelector('[data-es-nav-toggle]');
    var list=nav.querySelector('.es-nav-list');
    if(!header||!toggle||!list)return;
    var mobile=window.matchMedia('(max-width:980px)');
    var groups=Array.from(list.children).filter(function(li){return li.dataset.wfMenuHasChildren==='true';});
    var closeTimer=null,previousOverflow=null;
    function groupButton(li){return li.querySelector(':scope > .es-nav-group-button');}
    function closeGroups(except){groups.forEach(function(li){if(li===except)return;li.removeAttribute('data-es-open');delete li.dataset.esHoverOpened;var button=groupButton(li);if(button)button.setAttribute('aria-expanded','false');});}
    function setOpen(li,open){clearTimeout(closeTimer);closeGroups(open?li:null);if(open)li.setAttribute('data-es-open','true');else li.removeAttribute('data-es-open');groupButton(li).setAttribute('aria-expanded',String(open));}
    function closeMobile(){header.removeAttribute('data-wf-menu-open');toggle.setAttribute('aria-expanded','false');closeGroups();if(previousOverflow!==null){document.body.style.overflow=previousOverflow;previousOverflow=null;}}
    groups.forEach(function(li,index){
      var button=groupButton(li),panel=li.querySelector(':scope > .es-nav-children');
      if(!button||!panel)return;
      button.id='es-menu-trigger-'+index;panel.id='es-menu-panel-'+index;
      button.setAttribute('aria-controls',panel.id);button.setAttribute('aria-expanded','false');panel.setAttribute('aria-labelledby',button.id);
      button.addEventListener('click',function(event){var keepOpen=!mobile.matches&&event.detail>0&&li.dataset.esHoverOpened==='true';delete li.dataset.esHoverOpened;setOpen(li,keepOpen||li.dataset.esOpen!=='true');});
      li.addEventListener('pointerenter',function(event){if(!mobile.matches&&event.pointerType!=='touch'){var wasOpen=li.dataset.esOpen==='true';setOpen(li,true);if(!wasOpen)li.dataset.esHoverOpened='true';}});
      li.addEventListener('pointerleave',function(){delete li.dataset.esHoverOpened;if(!mobile.matches){closeTimer=setTimeout(function(){if(!li.contains(document.activeElement))setOpen(li,false);},160);}});
      li.addEventListener('focusout',function(){setTimeout(function(){if(!li.contains(document.activeElement)&&!li.matches(':hover'))setOpen(li,false);},0);});
      button.addEventListener('keydown',function(event){if(event.key==='ArrowDown'){event.preventDefault();setOpen(li,true);var first=panel.querySelector('a,button');if(first)first.focus();}});
    });
    toggle.addEventListener('click',function(){var open=header.getAttribute('data-wf-menu-open')==='true';if(open)closeMobile();else{header.setAttribute('data-wf-menu-open','true');toggle.setAttribute('aria-expanded','true');previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';}});
    nav.addEventListener('click',function(event){if(event.target.closest('a'))closeMobile();});
    nav.addEventListener('keydown',function(event){
      if(event.key==='Escape'){
        var active=groups.find(function(li){return li.dataset.esOpen==='true';});
        event.preventDefault();if(active){closeGroups();groupButton(active).focus();}else{closeMobile();toggle.focus();}
      }
      var top=Array.from(list.children).map(function(li){return li.querySelector(':scope > a,:scope > button');});
      var index=top.indexOf(event.target);if(index<0||mobile.matches)return;
      var next=index;
      if(event.key==='ArrowRight')next=(index+1)%top.length;else if(event.key==='ArrowLeft')next=(index+top.length-1)%top.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=top.length-1;else return;
      event.preventDefault();closeGroups();top[next].focus();
    });
    document.addEventListener('pointerdown',function(event){if(!header.contains(event.target))closeMobile();});
    document.addEventListener('focusin',function(event){if(!header.contains(event.target))closeGroups();});
    var lastMobile=mobile.matches;
    window.addEventListener('resize',function(){if(mobile.matches!==lastMobile){lastMobile=mobile.matches;closeMobile();}});
  });
})();
