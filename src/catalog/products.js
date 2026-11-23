(function(){
function decode(value){if(!value)return null;try{var text=decodeURIComponent(Array.prototype.map.call(atob(value.replace(/-/g,"+").replace(/_/g,"/")),function(c){return "%"+("00"+c.charCodeAt(0).toString(16)).slice(-2);}).join(""));return JSON.parse(text);}catch(e){return null;}}
function encode(value){var bytes=unescape(encodeURIComponent(JSON.stringify(value)));return btoa(bytes).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");}
function el(tag,className,text){var node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;}
function money(value,currency){return new Intl.NumberFormat("sr-RS",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(value)||0)+"\u00a0"+(/^[A-Z]{3}$/.test(currency||"")?currency:"RSD");}
function clip(value,max){value=String(value||"").trim();return value.length>max?value.slice(0,max):value;}
document.querySelectorAll(".wf-instance[data-wf-component=\"product-list\"]").forEach(function(host){
if(host.dataset.wfCatalogReady==="true")return;
host.dataset.wfCatalogReady="true";
var root=host.querySelector(".wf-catalog");
if(!root)return;
var results=root.querySelector("[data-wf-results]"),filters=root.querySelector("[data-wf-filters]"),status=root.querySelector("[data-wf-status]"),count=root.querySelector("[data-wf-count]"),pagination=root.querySelector("[data-wf-pagination]"),search=root.querySelector("[data-wf-search]"),category=root.querySelector("[data-wf-category]"),sort=root.querySelector("[data-wf-sort]"),form=root.querySelector("[data-wf-search-form]"),chips=root.querySelector("[data-wf-chips]"),filterToggle=root.querySelector("[data-wf-filters-toggle]");
var input=decode(host.dataset.wfProviderInput);if(!input||typeof input!=="object"||Array.isArray(input))input={};
input.page=input.page||1;input.limit=input.limit||24;input.sort=input.sort||"default";input.filters=input.filters||[];input.attributes=input.attributes||[];input.ranges=input.ranges||[];
var baseInput=decode(host.dataset.wfProviderBaseInput)||input;
var compiledCategory=baseInput.category&&baseInput.category!=="all"?String(baseInput.category):"";
var navigationCategory=!compiledCategory&&root.dataset.categoryNavigationContext==="true"&&input.category&&input.category!=="all"?String(input.category):"";
var lockedCategory=compiledCategory||navigationCategory;
if(navigationCategory){var title=root.querySelector("[data-wf-catalog-title]");if(title)title.textContent=navigationCategory;}
if(lockedCategory){input.category=lockedCategory;var categoryLabel=category&&category.closest("label");if(categoryLabel)categoryLabel.hidden=true;}
var lockedBrands=[];
(baseInput.filters||[]).forEach(function(group){if(group.field==="field11"){(group.values||[]).forEach(function(value){if(lockedBrands.indexOf(String(value))<0)lockedBrands.push(String(value));});}});
function restoreLockedBrands(){if(!lockedBrands.length)return;input.filters=(input.filters||[]).filter(function(group){return group.field!=="field11";});input.filters.push({field:"field11",values:lockedBrands.slice()});}
var facetMemory=null;
var storageKey="wf-catalog-facets:v2:"+(host.dataset.wfPage||location.pathname)+"#"+(host.dataset.wfInstance||"")+":"+lockedCategory+":"+host.dataset.wfFiltersCollapsed+":"+(host.dataset.wfOpenFilters||"");
var scrollKey="wf-catalog-scroll:"+(host.dataset.wfPage||location.pathname)+"#"+(host.dataset.wfInstance||"")+":"+lockedCategory;
function readStore(storageName,key){try{var raw=window[storageName].getItem(key);if(!raw)return null;return JSON.parse(raw);}catch(e){return null;}}
function writeStore(storageName,key,value){try{window[storageName].setItem(key,JSON.stringify(value));}catch(e){}}
var facetStore=readStore("localStorage",storageKey);
if(!facetStore||typeof facetStore!=="object"||Array.isArray(facetStore))facetStore={};
var filtersCollapsed=host.dataset.wfFiltersCollapsed==="true";
var openFilterTokens=String(host.dataset.wfOpenFilters||"").split(/[,;\n]/).map(function(token){return token.trim().toLowerCase();}).filter(Boolean);
function authorOpens(key,title){if(!filtersCollapsed)return true;var facet=String(key||"").toLowerCase();var name=String(title||"").toLowerCase();return openFilterTokens.some(function(token){return token===facet||token===name;});}
function rememberedOpen(key,title){if(facetMemory&&Object.prototype.hasOwnProperty.call(facetMemory,key))return facetMemory[key];if(Object.prototype.hasOwnProperty.call(facetStore,key))return !!facetStore[key];return authorOpens(key,title);}
function persistFacet(key,open){facetStore[key]=!!open;writeStore("localStorage",storageKey,facetStore);}
var savedScroll=readStore("sessionStorage",scrollKey);
var historyNavigation=false;
try{var navigationEntries=window.performance&&window.performance.getEntriesByType?window.performance.getEntriesByType("navigation"):[];historyNavigation=!!(navigationEntries.length?navigationEntries[0].type==="back_forward":window.performance&&window.performance.navigation&&window.performance.navigation.type===2);}catch(e){}
var restoreScrollOnce=true;
var scrollReady=false;
function saveScroll(){if(!scrollReady)return;writeStore("sessionStorage",scrollKey,window.scrollY||window.pageYOffset||0);}
function maybeRestoreScroll(){if(!restoreScrollOnce)return;restoreScrollOnce=false;if(historyNavigation&&typeof savedScroll==="number"&&isFinite(savedScroll)){var max=Math.max(0,document.documentElement.scrollHeight-window.innerHeight);window.scrollTo(0,Math.min(Math.max(0,savedScroll),max));}scrollReady=true;}
var pendingId="";
var serial=0;
var fromHistory=false;
if(window.parent!==window&&(host.dataset.wfCatalogBridge==="true"||host.hasAttribute("data-wf-provider-preview")||host.hasAttribute("data-wf-provider-preview-error")))host.dataset.wfCatalogBridge="true";
function requestId(){serial+=1;var suffix=Math.random().toString(36).replace(/[^a-z0-9]/g,"").slice(0,8);var prefix=("00000000"+serial.toString(36)).slice(-8);return (prefix+suffix).slice(0,40);}
function selected(kind,key,value){return (input[kind]||[]).some(function(group){return (group.field===key||group.name===key)&&group.values.indexOf(value)>=0;});}
function removeValue(kind,key,value){if(kind==="filters"&&key==="field11"&&lockedBrands.indexOf(value)>=0)return;var keyName=kind==="filters"?"field":"name";input[kind]=(input[kind]||[]).filter(function(group){if(group[keyName]!==key)return true;group.values=group.values.filter(function(item){return item!==value;});return group.values.length>0;});input.page=1;}
function updateFilter(kind,key,value,checked){if(kind==="filters"&&key==="field11"&&lockedBrands.indexOf(value)>=0&&!checked)return;var keyName=kind==="filters"?"field":"name",list=(input[kind]||[]).filter(function(group){return group[keyName]!==key;}),current=(input[kind]||[]).find(function(group){return group[keyName]===key;}),values=current?current.values.slice():[];if(checked&&values.indexOf(value)<0)values.push(value);if(!checked)values=values.filter(function(item){return item!==value;});if(values.length){var group={values:values};group[keyName]=key;list.push(group);}input[kind]=list;input.page=1;load(true);}
function resetInput(){input.q="";input.category=lockedCategory||"all";input.sort="default";input.page=1;input.filters=[];input.attributes=[];input.ranges=[];restoreLockedBrands();search.value="";sort.value="default";if(category)category.value=input.category;}
function readUrl(fromPop){var params=new URLSearchParams(window.location.search);if(!urlHasCatalogState()){if(!fromPop)return;input.q="";input.category=lockedCategory||"all";input.sort="default";input.page=1;input.filters=[];input.attributes=[];input.ranges=[];restoreLockedBrands();if(search)search.value="";if(sort)sort.value="default";if(category)category.value=input.category;return;}input.q=params.has("q")?clip(params.get("q"),160):"";input.category=lockedCategory||(params.has("category")?(clip(params.get("category"),80)||"all"):"all");input.sort=params.has("sort")?(clip(params.get("sort"),20)||"default"):"default";input.page=1;if(params.has("page")){var page=parseInt(params.get("page"),10);if(page>0&&page<100000)input.page=page;}input.filters=[];input.attributes=[];input.ranges=[];params.getAll("df").slice(0,50).forEach(function(item){var parts=String(item).split(":");if(parts.length<2)return;var field=clip(parts.shift(),40),value=clip(parts.join(":"),160);if(!/^[a-z0-9]+$/.test(field)||!value)return;updateStored("filters","field",field,value);});params.getAll("da").slice(0,50).forEach(function(item){var parts=String(item).split(":");if(parts.length<2)return;var name=clip(parts.shift(),120),value=clip(parts.join(":"),160);if(!name||!value)return;updateStored("attributes","name",name,value);});params.getAll("dr").slice(0,10).forEach(function(value){var parts=String(value).split(":");if(parts.length!==3||!/^fieldn[0-9]{1,4}$/.test(parts[0]))return;var range={field:parts[0]};if(parts[1]!==""&&isFinite(Number(parts[1])))range.min=Number(parts[1]);if(parts[2]!==""&&isFinite(Number(parts[2])))range.max=Number(parts[2]);input.ranges.push(range);});restoreLockedBrands();search.value=input.q||"";sort.value=input.sort||"default";category.value=input.category||"all";}
function updateStored(kind,keyName,key,value){var current=(input[kind]||[]).find(function(group){return group[keyName]===key;});if(!current){current={values:[]};current[keyName]=key;input[kind].push(current);}if(current.values.indexOf(value)<0)current.values.push(value);}
function urlHasCatalogState(){var params=new URLSearchParams(window.location.search);return params.has("q")||params.has("category")||params.has("sort")||params.has("page")||params.has("df")||params.has("da")||params.has("dr");}
function writeUrl(push){var params=new URLSearchParams(window.location.search);function setOrDelete(key,value){if(value)params.set(key,value);else params.delete(key);}setOrDelete("q",input.q||"");setOrDelete("category",(!lockedCategory||navigationCategory)&&input.category&&input.category!=="all"?input.category:"");setOrDelete("sort",input.sort&&input.sort!=="default"?input.sort:"");setOrDelete("page",input.page&&input.page!==1?String(input.page):"");params.delete("df");params.delete("da");params.delete("dr");(input.filters||[]).forEach(function(group){(group.values||[]).forEach(function(value){if(group.field==="field11"&&lockedBrands.indexOf(value)>=0)return;params.append("df",group.field+":"+value);});});(input.attributes||[]).forEach(function(group){(group.values||[]).forEach(function(value){params.append("da",group.name+":"+value);});});(input.ranges||[]).forEach(function(range){params.append("dr",range.field+":"+(range.min===undefined?"":range.min)+":"+(range.max===undefined?"":range.max));});var query=params.toString();var next=window.location.pathname+(query?"?"+query:"")+window.location.hash;var current=window.location.pathname+window.location.search+window.location.hash;if(next===current)return;var historyState={wfCatalog:host.dataset.wfInstance||""};try{if(push)history.pushState(historyState,"",next);else history.replaceState(historyState,"",next);}catch(error){/* Opaque preview can deny History; keep filtering through the parent provider. */}}
function renderChips(){if(!chips)return;chips.innerHTML="";var active=0;function add(label,remove){active+=1;var button=el("button","",label+" ×");button.type="button";button.addEventListener("click",function(){remove();load(true);});chips.appendChild(button);}if(input.q)add(input.q,function(){input.q="";search.value="";input.page=1;});if(!lockedCategory&&input.category&&input.category!=="all")add(input.category,function(){input.category="all";category.value="all";input.page=1;});(input.filters||[]).forEach(function(group){(group.values||[]).forEach(function(value){if(group.field==="field11"&&lockedBrands.indexOf(value)>=0)return;add(value,function(){removeValue("filters",group.field,value);});});});(input.attributes||[]).forEach(function(group){(group.values||[]).forEach(function(value){add(value,function(){removeValue("attributes",group.name,value);});});});(input.ranges||[]).forEach(function(range){add((range.field==="fieldn13"?"Cena: ":"Raspon: ")+(range.min===undefined?"…":rangeText(range.min,{dataset:{wfRangeField:range.field}}))+"–"+(range.max===undefined?"…":rangeText(range.max,{dataset:{wfRangeField:range.field}})),function(){input.ranges=input.ranges.filter(function(existing){return existing!==range;});input.page=1;});});if(active){var clear=el("button","","Očisti sve");clear.type="button";clear.setAttribute("data-wf-clear","true");clear.addEventListener("click",function(){resetInput();load(true);});chips.appendChild(clear);}if(filterToggle){var filterLabel=filterToggle.querySelector("[data-wf-filter-label]")||filterToggle;filterLabel.textContent=active?"Filteri ("+active+")":"Filteri";}}

function cancelOffers(){if(window.ElastycCatalogOffers)window.ElastycCatalogOffers.cancel(host);window.ElastycCatalogOffersQueue=(window.ElastycCatalogOffersQueue||[]).filter(function(entry){return entry.host!==host;});}
function scheduleOffers(items){if(window.ElastycCatalogOffers){window.ElastycCatalogOffers.load(host,root,items);return;}window.ElastycCatalogOffersQueue=(window.ElastycCatalogOffersQueue||[]).filter(function(entry){return entry.host!==host;});window.ElastycCatalogOffersQueue.push({host:host,root:root,items:items});}
function detailUrl(id){var path=root.dataset.detailUrl||"/proizvod";return path+(path.indexOf("?")<0?"?":"&")+"id="+encodeURIComponent(id||"");}

function facetKey(group){return group.kind==="category"?"category":(group.kind==="attribute"?"attribute:":group.kind==="range"?"range:":"filter:")+group.name;}
function groups(data){var facets=data.filters||{};if(Array.isArray(facets.ordered))return facets.ordered;var out=[];if(facets.categories&&facets.categories.length)out.push({kind:"category",name:"field22",label:"Kategorija",values:facets.categories});(facets.direct||[]).forEach(function(g){out.push({kind:"direct",name:g.field,label:g.label,values:g.values});});(facets.attributes||[]).forEach(function(g){out.push({kind:"attribute",name:g.name,label:g.name,values:g.values});});return out;}
function rangeNumber(value,upper){return Math[upper?"ceil":"floor"](Number(value)*100+(upper?-1:1)*1e-6)/100;}
function rangeValues(group){var current=(input.ranges||[]).find(function(r){return r.field===group.name;})||{};var low=rangeNumber(group.min,false),high=rangeNumber(group.max,true);if(current.min!==undefined){low=Math.min(low,current.min);high=Math.max(high,current.min);}if(current.max!==undefined){low=Math.min(low,current.max);high=Math.max(high,current.max);}return {min:low,max:high,low:current.min===undefined?low:current.min,high:current.max===undefined?high:current.max,current:current};}
function rangeText(value,node){return new Intl.NumberFormat("sr-RS",{minimumFractionDigits:node.dataset.wfRangeField==="fieldn13"?2:0,maximumFractionDigits:node.dataset.wfRangeField==="fieldn13"?2:6}).format(Number(value));}
function parseRange(value){var text=String(value).trim().replace(/[\s\u00a0]/g,"");if(!text)return undefined;if(text.indexOf(",")>=0){if(!/^-?(?:[0-9]+|[0-9]{1,3}(?:\.[0-9]{3})+)(?:,[0-9]+)?$/.test(text))return NaN;text=text.replace(/\./g,"").replace(",",".");}else if(/^-?[0-9]{1,3}(?:\.[0-9]{3})+$/.test(text))text=text.replace(/\./g,"");return /^-?[0-9]+(?:\.[0-9]+)?$/.test(text)?Number(text):NaN;}
function rangeControl(group){
  var node=el("div","wf-catalog__range"),sliders=el("div","wf-catalog__range-sliders"),fields=el("div","wf-catalog__range-fields"),labels=el("div","wf-catalog__range-labels"),values=rangeValues(group);
  node.dataset.wfRangeField=group.name;sliders.setAttribute("data-wf-range-sliders","");fields.setAttribute("data-wf-range-fields","");
  ["min","max"].forEach(function(side){
    var slider=el("input"),label=el("label"),number=el("input"),text=side==="min"?"Od":"Do",value=side==="min"?values.low:values.high,output=el("output");output.dataset.wfRangeLabel=side;labels.appendChild(output);
    slider.type="range";slider.min=String(values.min);slider.max=String(values.max);slider.step="0.01";slider.value=String(value);slider.disabled=values.min===values.max;slider.dataset.wfRangeSlider=side;slider.setAttribute("aria-label",group.label+" "+text.toLowerCase());sliders.appendChild(slider);
    label.appendChild(el("span","",text));number.type="text";number.inputMode="decimal";number.dataset.wfRangeValue=side;number.value=values.current[side]===undefined?"":rangeText(values.current[side],node);number.placeholder=rangeText(side==="min"?values.min:values.max,node);number.setAttribute("aria-label",group.label+" "+text.toLowerCase()+" — ručni unos");label.appendChild(number);fields.appendChild(label);
  });
  var apply=el("button","","Primeni");apply.type="button";apply.setAttribute("data-wf-range-apply","");fields.appendChild(apply);node.appendChild(labels);node.appendChild(sliders);
  var manual=el("details","wf-catalog__range-manual");manual.setAttribute("data-wf-range-manual","");manual.open=root.dataset.priceFilterMode!=="slider-popover";manual.appendChild(el("summary","","Unesi raspon"));manual.appendChild(fields);node.appendChild(manual);syncRange(node);return node;
}
function syncRange(node){
  var low=node.querySelector('[data-wf-range-slider="min"]'),high=node.querySelector('[data-wf-range-slider="max"]');if(!low||!high)return;
  low.setAttribute("aria-valuemax",high.value);high.setAttribute("aria-valuemin",low.value);
  [low,high].forEach(function(slider){slider.setAttribute("aria-valuetext",rangeText(slider.value,node));});
  [low,high].forEach(function(slider){var label=node.querySelector('[data-wf-range-label="'+slider.dataset.wfRangeSlider+'"]');if(label)label.textContent=rangeText(slider.value,node);});
  var span=Number(high.max)-Number(low.min),start=span?(Number(low.value)-Number(low.min))/span*100:0,end=span?(Number(high.value)-Number(low.min))/span*100:100;
  node.style.setProperty("--wf-range-start",start+"%");node.style.setProperty("--wf-range-end",end+"%");
}
function commitRange(node){
  var low=node.querySelector('[data-wf-range-value="min"]'),high=node.querySelector('[data-wf-range-value="max"]'),range={field:node.dataset.wfRangeField};
  if(low.value.trim()!=="")range.min=parseRange(low.value);if(high.value.trim()!=="")range.max=parseRange(high.value);
  var valid=low.validity.valid&&high.validity.valid&&(range.min===undefined||isFinite(range.min))&&(range.max===undefined||isFinite(range.max))&&(range.min===undefined||range.max===undefined||range.min<=range.max);
  low.setAttribute("aria-invalid",valid?"false":"true");high.setAttribute("aria-invalid",valid?"false":"true");
  if(!valid){status.textContent="Proverite donju i gornju granicu.";return;}
  if(range.min!==undefined)low.value=rangeText(range.min,node);if(range.max!==undefined)high.value=rangeText(range.max,node);
  input.ranges=(input.ranges||[]).filter(function(r){return r.field!==range.field;});if(range.min!==undefined||range.max!==undefined)input.ranges.push(range);input.page=1;load(true);
}
function bindFilters(){
  filters.addEventListener("click",function(event){var summary=event.target.closest("summary");if(summary&&summary.parentElement.hasAttribute("data-wf-facet")&&filters.contains(summary)){var details=summary.parentElement;window.setTimeout(function(){persistFacet(details.dataset.wfFacet,details.open);},0);}var apply=event.target.closest("[data-wf-range-apply]");if(apply)commitRange(apply.closest("[data-wf-range-field]"));});
  filters.addEventListener("keydown",function(event){if(event.key==="Enter"&&event.target.matches("[data-wf-range-value]")){event.preventDefault();commitRange(event.target.closest("[data-wf-range-field]"));}});
  filters.addEventListener("input",function(event){var slider=event.target;if(!slider.matches("[data-wf-range-slider]"))return;var node=slider.closest("[data-wf-range-field]"),side=slider.dataset.wfRangeSlider,other=node.querySelector('[data-wf-range-slider="'+(side==="min"?"max":"min")+'"]');if(side==="min"&&Number(slider.value)>Number(other.value)||side==="max"&&Number(slider.value)<Number(other.value))slider.value=other.value;node.querySelector('[data-wf-range-value="'+side+'"]').value=rangeText(slider.value,node);syncRange(node);});
  filters.addEventListener("change",function(event){
    var node=event.target;if(node.matches("[data-wf-range-slider]")){node.dispatchEvent(new Event("input",{bubbles:true}));commitRange(node.closest("[data-wf-range-field]"));return;}
    if(node.matches("[data-wf-range-value]")){var range=node.closest("[data-wf-range-field]"),slider=range.querySelector('[data-wf-range-slider="'+node.dataset.wfRangeValue+'"]');var parsed=parseRange(node.value);if(slider&&parsed!==undefined&&isFinite(parsed)){slider.value=String(parsed);node.value=rangeText(parsed,range);}syncRange(range);return;}
    if(!node.matches("input[data-wf-filter-kind]"))return;var kind=node.dataset.wfFilterKind,key=node.dataset.wfFilterKey,value=node.value;
    if(kind==="category"){input.category=node.checked?value:"all";if(category)category.value=input.category;input.page=1;load(true);}else updateFilter(kind,key,value,node.checked);
  });
}
function renderFilters(data){
  var previous={};facetMemory={};filters.querySelectorAll("details[data-wf-facet]").forEach(function(node){facetMemory[node.dataset.wfFacet]=node.open;previous[node.dataset.wfFacet]=node;});var next=[];
  if(category){category.innerHTML="";var all=el("option","","Sve kategorije");all.value="all";category.appendChild(all);(data.filters.categories||(groups(data).find(function(group){return group.kind==="category";})||{}).values||[]).forEach(function(item){var option=el("option","",item.label+" ("+item.count+")");option.value=item.value;category.appendChild(option);});category.value=input.category||"all";}
  groups(data).forEach(function(group){
    if(group.kind==="category"&&lockedCategory||group.kind==="direct"&&group.name==="field11"&&lockedBrands.length)return;
    if(group.kind==="range"&&(group.min===null||group.max===null))return;if(group.kind!=="range"&&(!group.values||!group.values.length))return;
    var key=facetKey(group),details=el("details","wf-catalog__filter"),summary=el("summary","",group.label),list=el("div","wf-catalog__filter-list");details.dataset.wfFacet=key;details.open=rememberedOpen(key,group.label);details.appendChild(summary);
    if(group.kind==="range")list.appendChild(rangeControl(group));else (group.values||[]).forEach(function(item){var label=el("label"),box=el("input");box.type="checkbox";box.value=item.value;box.dataset.wfFilterKind=group.kind==="category"?"category":group.kind==="attribute"?"attributes":"filters";box.dataset.wfFilterKey=group.name;box.checked=group.kind==="category"?input.category===item.value:selected(box.dataset.wfFilterKind,group.name,item.value);label.appendChild(box);label.appendChild(el("span","",item.label));label.appendChild(el("small","",String(item.count)));list.appendChild(label);});
    details.appendChild(list);
    var old=previous[key];if(old){
      var oldRange=old.querySelector("[data-wf-range-field]"),newRange=details.querySelector("[data-wf-range-field]");
      if(oldRange&&newRange){
        oldRange.querySelectorAll("[data-wf-range-slider],[data-wf-range-value]").forEach(function(control){var attr=control.hasAttribute("data-wf-range-slider")?"data-wf-range-slider":"data-wf-range-value",fresh=newRange.querySelector('['+attr+'="'+control.getAttribute(attr)+'"]');if(!fresh)return;["min","max","step","placeholder"].forEach(function(name){if(fresh.hasAttribute(name))control.setAttribute(name,fresh.getAttribute(name));});control.disabled=fresh.disabled;if(document.activeElement!==control)control.value=fresh.value;});syncRange(oldRange);
      }else if(!oldRange&&!newRange){
        var container=old.querySelector(".wf-catalog__filter-list"),labels=Array.from(container.querySelectorAll("label")),used=[];
        list.querySelectorAll("label").forEach(function(label,index){var box=label.querySelector("input"),existing=labels.find(function(candidate){return candidate.querySelector("input").value===box.value;});if(existing){existing.querySelector("input").checked=box.checked;["span","small"].forEach(function(tag){var target=existing.querySelector(tag),text=label.querySelector(tag).textContent;if(target.textContent!==text)target.textContent=text;});used.push(existing);if(container.children[index]!==existing)container.insertBefore(existing,container.children[index]||null);}else{used.push(label);container.insertBefore(label,container.children[index]||null);}});labels.forEach(function(label){if(used.indexOf(label)<0)label.remove();});
      }else old.querySelector(".wf-catalog__filter-list").replaceWith(list);
      var heading=old.querySelector("summary");if(heading.textContent!==group.label)heading.textContent=group.label;details=old;
    }
    next.push(details);
  });
  Array.from(filters.children).forEach(function(node){if(next.indexOf(node)<0)node.remove();});next.forEach(function(node,index){if(filters.children[index]!==node)filters.insertBefore(node,filters.children[index]||null);});
  if(!filters.children.length)filters.appendChild(el("p","wf-catalog__status","Filteri nisu dostupni za ovaj skup podataka."));
}
function productBadges(item,media){
  var badges=el("div","wf-product__badges"),discount=el("span","wf-product__badge wf-product__badge--discount");badges.setAttribute("data-wf-badges","");discount.setAttribute("data-wf-discount","");discount.hidden=true;badges.appendChild(discount);
  if(root.dataset.showTagBadges!=="false"){
    var allowed=String(root.dataset.badgeTags||"Akcija,Novo").split(/[,;\n]/).map(function(s){return s.trim().toLocaleLowerCase("sr");});
    (item.tags||[]).filter(function(tag){return typeof tag==="string"&&tag.toLocaleLowerCase("sr")!=="popust"&&allowed.indexOf(tag.toLocaleLowerCase("sr"))>=0;}).slice(0,2).forEach(function(tag){badges.appendChild(el("span","wf-product__badge",tag));});
  }
  media.appendChild(badges);
}
function renderProducts(data){
  results.innerHTML="";if(!data.items.length){results.appendChild(el("p","wf-catalog__empty","Nema proizvoda za izabrane uslove."));return;}
  data.items.forEach(function(item){
    var card=el("article","wf-product"),link=el("a","wf-product__link"),media=el("div","wf-product__media"),image=el("img"),content=el("div","wf-product__content"),meta=[];card.dataset.wfItemId=String(item.id||"");link.href=detailUrl(item.id);image.src=item["image-url"]||"/commonAssets/Images/coming_soon_transparent.png";image.alt=item.name||"";image.loading="lazy";image.decoding="async";media.appendChild(image);productBadges(item,media);
    if(root.dataset.showBrand==="true"&&item.brand)meta.push(item.brand);if(root.dataset.showCategory==="true"&&item.category&&!(root.dataset.hideCurrentCategory==="true"&&input.category&&input.category!=="all"&&item.category===input.category))meta.push(item.category);if(meta.length)content.appendChild(el("p","wf-product__meta",meta.join(" · ")));content.appendChild(el("h2","",item.name||item.id));
    if((root.dataset.showListDescription!=="false"||root.dataset.showGridDescription==="true")&&item.description)content.appendChild(el("p","wf-product__description",item.description));
    var footer=el("div","wf-product__footer"),prices=el("span","wf-product__prices"),regular=el("del"),actual=el("strong","wf-product__price",money(item.price,item.currency));regular.setAttribute("data-wf-regular-price","");regular.hidden=true;actual.setAttribute("data-wf-price","");actual.dataset.wfPriceState="initial";actual.hidden=root.dataset.showPrice==="false";prices.appendChild(regular);prices.appendChild(actual);footer.appendChild(prices);
    if(root.dataset.showStock==="true"){var known=item["stock-known"]===true,stock=el("span","wf-product__stock",known?(Number(item.stock)>0?"Na stanju":"Nema na stanju"):"");stock.dataset.empty=known&&Number(item.stock)<=0?"true":"false";stock.dataset.known=known?"true":"false";stock.setAttribute("data-wf-stock","");footer.appendChild(stock);}
    content.appendChild(footer);link.appendChild(media);link.appendChild(content);card.appendChild(link);results.appendChild(card);
  });
}
function renderPagination(data){
  pagination.innerHTML="";var pages=Math.max(1,Math.ceil(data.total/Math.max(1,data.limit)));if(pages<=1)return;
  function link(label,page,disabled,current){var node=el(disabled?"span":"a","",label);if(disabled)node.setAttribute("aria-disabled","true");else{var params=new URLSearchParams(window.location.search);if(page===1)params.delete("page");else params.set("page",String(page));node.href=window.location.pathname+(params.toString()?"?"+params.toString():"")+window.location.hash;node.dataset.wfPage=String(page);if(current)node.setAttribute("aria-current","page");}pagination.appendChild(node);}
  link("Prethodna",Math.max(1,data.page-1),data.page<=1,false);var start=Math.max(1,data.page-2),end=Math.min(pages,start+4);start=Math.max(1,end-4);for(var i=start;i<=end;i++)link(String(i),i,false,i===data.page);link("Sledeća",Math.min(pages,data.page+1),data.page>=pages,false);
}
function hydrateInitial(data){
  filters.querySelectorAll("details[data-wf-facet]").forEach(function(node){node.open=rememberedOpen(node.dataset.wfFacet,(node.querySelector("summary")||{}).textContent||"");});
  filters.querySelectorAll("[data-wf-range-field]").forEach(syncRange);renderChips();maybeRestoreScroll();host.dataset.wfSsrHydrated="true";if(window.ElastycCommerce)window.ElastycCommerce.mount(host,data.items||[]);scheduleOffers(data.items||[]);
}
bindFilters();
pagination.addEventListener("click",function(event){var link=event.target.closest("a[data-wf-page]");if(!link||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button>0)return;event.preventDefault();input.page=Number(link.dataset.wfPage);load(true,true);});

function normalized(payload){if(Array.isArray(payload))return{items:payload,total:payload.length,page:1,limit:payload.length||24,filters:{categories:[],direct:[],attributes:[]}};return payload&&Array.isArray(payload.items)?payload:{items:[],total:0,page:1,limit:24,filters:{categories:[],direct:[],attributes:[]}};}
function render(payload){root.dataset.wfBusy="false";var data=normalized(payload);status.textContent="";status.removeAttribute("data-error");count.textContent=data.total+" "+(data.total===1?"proizvod":"proizvoda");renderFilters(data);renderProducts(data);renderPagination(data);renderChips();maybeRestoreScroll();if(window.ElastycCommerce)window.ElastycCommerce.mount(host,data.items||[]);scheduleOffers(data.items||[]);}
function applyPayload(payload){if(pendingId&&arguments.length){}render(payload.data!==undefined?payload.data:payload);}
function load(push,scroll){cancelOffers();if(scroll===true&&root.scrollIntoView)root.scrollIntoView({behavior:"smooth",block:"start"});var id=requestId();pendingId=id;root.dataset.wfBusy="true";status.textContent="";status.removeAttribute("data-error");writeUrl(push===true);renderChips();if(host.dataset.wfCatalogBridge==="true"){window.parent.postMessage({type:"elastyc-webfront-catalog-provider-v1",pageKey:host.dataset.wfPage||"",instanceKey:host.dataset.wfInstance||"",input:input,requestId:id},"*");return;}var url=new URL(host.dataset.wfProviderUrl,window.location.href);url.searchParams.set("wf_input",encode(input));fetch(url.toString(),{credentials:"same-origin",headers:{Accept:"application/json"}}).then(function(response){if(!response.ok)throw new Error("HTTP "+response.status);return response.json();}).then(function(payload){if(pendingId!==id)return;applyPayload(payload);}).catch(function(error){if(pendingId!==id)return;root.dataset.wfBusy="false";status.textContent=error&&error.message?error.message:"Katalog trenutno nije dostupan.";status.dataset.error="true";});}
function applySearch(){input.q=search.value.trim();if(!lockedCategory&&category)input.category=category.value;input.sort=sort.value;input.page=1;load(true);}
form.addEventListener("submit",function(event){event.preventDefault();applySearch();});
var applyButton=root.querySelector("[data-wf-apply-search]");if(applyButton)applyButton.addEventListener("click",applySearch);
search.addEventListener("keydown",function(event){if(event.key==="Enter"){event.preventDefault();applySearch();}});
if(category)category.addEventListener("change",function(){if(lockedCategory)return;input.category=category.value;input.page=1;load(true);});
sort.addEventListener("change",function(){input.sort=sort.value;input.page=1;load(true);});
var filterScrollLock=null, filterPanel=filters;
var filterBody=el("div","wf-catalog__filter-body"), filterHead=el("div","wf-catalog__filter-head"), filterFoot=el("div","wf-catalog__filter-foot");
while(filters.firstChild)filterBody.appendChild(filters.firstChild);
var filterTitle=el("strong","","Filteri"), filterClose=el("button","wf-catalog__filters-close");
filterClose.type="button";filterClose.setAttribute("aria-label","Zatvori filtere");
filterClose.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';
filterHead.append(filterTitle,filterClose);
var filterClear=el("button","","Očisti"),filterApply=el("button","","Prikaži proizvode");filterClear.type=filterApply.type="button";
filterFoot.append(filterClear,filterApply);filterPanel.append(filterHead,filterBody,filterFoot);filters=filterBody;
function closeFilterPanel(restore){root.dataset.filtersOpen="false";if(filterToggle)filterToggle.setAttribute("aria-expanded","false");filterPanel.removeAttribute("role");filterPanel.removeAttribute("aria-modal");if(filterScrollLock){var lock=filterScrollLock;filterScrollLock=null;document.body.style.position=lock.position;document.body.style.top=lock.top;document.body.style.width=lock.width;document.body.style.overflow=lock.overflow;window.scrollTo(0,lock.scroll);}if(restore&&filterToggle)filterToggle.focus({preventScroll:true});}
function openFilterPanel(keyboard){root.dataset.filtersOpen="true";filterToggle.setAttribute("aria-expanded","true");if(window.innerWidth<=960){filterScrollLock={position:document.body.style.position,top:document.body.style.top,width:document.body.style.width,overflow:document.body.style.overflow,scroll:window.scrollY||0};document.body.style.position="fixed";document.body.style.top="-"+filterScrollLock.scroll+"px";document.body.style.width="100%";document.body.style.overflow="hidden";filterPanel.setAttribute("role","dialog");filterPanel.setAttribute("aria-modal","true");filterPanel.setAttribute("aria-label","Filteri proizvoda");filterPanel.tabIndex=-1;(keyboard?filterClose:filterPanel).focus({preventScroll:true});}}
if(filterToggle)filterToggle.addEventListener("click",function(event){if(root.dataset.filtersOpen==="true")closeFilterPanel(true);else openFilterPanel(event.detail===0);});
filterClose.addEventListener("click",function(){closeFilterPanel(true);});filterApply.addEventListener("click",function(){closeFilterPanel(true);});
filterClear.addEventListener("click",function(){resetInput();load(true);});
window.addEventListener("resize",function(){if(window.innerWidth>960&&filterScrollLock)closeFilterPanel(false);});
document.addEventListener("keydown",function(event){if(!filterScrollLock)return;if(event.key==="Escape"){event.preventDefault();closeFilterPanel(true);}if(event.key==="Tab"){var targets=Array.from(filterPanel.querySelectorAll("button,input,select,summary,a[href]")).filter(function(node){return !node.disabled&&node.getClientRects().length;});var first=targets[0],last=targets[targets.length-1];if(event.shiftKey&&(document.activeElement===first||document.activeElement===filterPanel)){event.preventDefault();last.focus();}else if(!event.shiftKey&&(document.activeElement===last||document.activeElement===filterPanel)){event.preventDefault();first.focus();}}});
root.querySelectorAll("[data-wf-view]").forEach(function(button){function sync(){button.setAttribute("aria-pressed",root.dataset.layout===button.dataset.wfView?"true":"false");}sync();button.addEventListener("click",function(){root.dataset.layout=button.dataset.wfView;root.querySelectorAll("[data-wf-view]").forEach(function(other){other.setAttribute("aria-pressed",other===button?"true":"false");});});});
window.addEventListener("message",function(event){if(event.source!==window.parent)return;var data=event.data;if(!data||data.type!=="elastyc-webfront-catalog-provider-result-v1")return;if(data.binding)return;if(data.requestId!==pendingId||data.instanceKey!==host.dataset.wfInstance)return;if(!data.ok){root.dataset.wfBusy="false";status.textContent=data.error||"Katalog trenutno nije dostupan.";status.dataset.error="true";return;}applyPayload({data:data.data});});
window.addEventListener("popstate",function(){readUrl(true);load(false);});
try{if("scrollRestoration" in history)history.scrollRestoration="manual";}catch(e){}
var scrollFrame=0;
window.addEventListener("scroll",function(){if(scrollFrame)return;scrollFrame=window.requestAnimationFrame(function(){scrollFrame=0;saveScroll();});},{passive:true});
window.addEventListener("pagehide",saveScroll);
readUrl();
var initial=decode(host.dataset.wfInitialData);var preview=decode(host.dataset.wfProviderPreview);
var previewError=host.dataset.wfProviderPreviewError||"";
if(initial&&Array.isArray(initial.items)){if(results.dataset.wfRendered==="true")hydrateInitial(initial);else render(initial);writeUrl(false);}else if(host.dataset.wfCatalogBridge==="true"&&preview&&!urlHasCatalogState()){render(preview);writeUrl(false);}else if(previewError){status.textContent=previewError;status.dataset.error="true";renderChips();}else load(false,false);
});
})();
