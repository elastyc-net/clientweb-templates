(function () {
  'use strict';
  document.querySelectorAll('[data-wf-orders]').forEach(function (root) {
    if (root.dataset.ready) return; root.dataset.ready='true';
    var host=root.closest('[data-wf-commerce-url]'); if(!host)return;
    var generation=0;
    function el(tag,text,cls){var n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
    function load(ref,page){
      var sequence=++generation,url=new URL(host.dataset.wfCommerceUrl,location.href);url.searchParams.set('operation','orders');if(ref)url.searchParams.set('productId',ref);if(page)url.searchParams.set('page',page);
      root.setAttribute('aria-busy','true');root.replaceChildren(el('p','Učitavanje narudžbina…','wf-shop-help'));
      fetch(url,{credentials:'same-origin',cache:'no-store',headers:{Accept:'application/json'}}).then(function(response){return response.json().then(function(data){if(!response.ok||!data.ok){var error=new Error(data.message||'Narudžbine trenutno nisu dostupne.');error.status=response.status;throw error;}return data;});}).then(function(data){
        if(sequence!==generation)return;root.replaceChildren();
        if(data.order){
          var back=el('button','← Moje narudžbine','wf-shop-link');back.type='button';back.onclick=function(){navigate('');};root.appendChild(back);
          root.appendChild(el('h2',data.order.number||data.order.reference));
          root.appendChild(el('p',[data.order.date,data.order.status,data.order.delivery].filter(Boolean).join(' · ')));
          root.appendChild(el('p','Vrednost narudžbine: '+(data.order.total||'0')+' '+(data.order.currency||'')));
          var list=el('div',undefined,'wf-orders__items');
          data.items.forEach(function(item){var card=el('article');card.append(el('strong',item.name||item.sku),el('p',item.sku+' · '+item.quantity+' '+item.unit),el('p','Jedinična cena bez PDV-a: '+item.netUnitPrice+' '+(data.order.currency||'')+' · PDV '+item.vat+'%'));list.appendChild(card);});root.appendChild(list);
          if(!data.items.length)root.appendChild(el('p','Narudžbina trenutno nema dostupne stavke.','wf-shop-help'));
        }else{
          if(!data.orders.length)root.appendChild(el('p','Još nemate narudžbine.','wf-shop-help'));
          var list=el('div',undefined,'wf-orders__list');
          data.orders.forEach(function(order){var button=el('button',undefined,'wf-orders__row');button.type='button';button.append(el('strong',order.number||order.reference),el('span',[order.date,order.status].filter(Boolean).join(' · ')),el('span',(order.total||'0')+' '+(order.currency||'')));button.onclick=function(){navigate(order.reference);};list.appendChild(button);});root.appendChild(list);
          if(data.page>1){var previous=el('button','Prethodna','wf-shop-link');previous.onclick=function(){load('',data.page-1);};root.appendChild(previous);}
          if(data.page*data.limit<data.total){var next=el('button','Sledeća','wf-shop-link');next.onclick=function(){load('',data.page+1);};root.appendChild(next);}
        }
      }).catch(function(error){if(sequence!==generation)return;root.replaceChildren(el('p',error.message,'wf-shop-help'));if(error.status===401){var link=el('a','Prijava','wf-shop-btn');link.href=root.dataset.accountUrl||'/nalog';root.appendChild(link);}else{var retry=el('button','Pokušaj ponovo','wf-shop-link');retry.onclick=function(){load(ref,page);};root.appendChild(retry);}}).finally(function(){if(sequence===generation)root.setAttribute('aria-busy','false');});
    }
    function navigate(ref){var url=new URL(location.href);if(ref)url.searchParams.set('ref',ref);else url.searchParams.delete('ref');history.pushState(null,'',url.pathname+url.search);load(ref);}
    window.addEventListener('popstate',function(){load(new URL(location.href).searchParams.get('ref')||'');});
    window.addEventListener('elastyc:commerce-auth-changed',function(){generation++;root.replaceChildren();load('');});
    load(new URL(location.href).searchParams.get('ref')||'');
  });
})();
