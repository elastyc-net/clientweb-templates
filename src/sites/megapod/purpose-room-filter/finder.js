var commercial=["Komercijalna upotreba","Komercijalna / industrijska upotreba","Poslovni prostor","Kućna i komercijalna upotreba","Stambeni i poslovni prostor","Stambeni i poslovni prostori"];
var home=["Kućna upotreba","Stambeni prostor","Upotreba u domaćinstvu","Kućna i komercijalna upotreba","Stambeni i poslovni prostor","Stambeni i poslovni prostori"];
// Tenant-owned room curation. Values must match existing catalogue attributes.
var purposeRooms={
  home:["Stambeni prostor","Dečija soba","Hodnik","Kuhinja","Trpezarija","Terasa","Garaza"],
  commercial:["Kancelarija","Prodajni prostor","Hotel","Restoran","Igraonica","Decije igraliste","Teretana","Sportska sala","Zdravstvena ustanova","Magacin","Server sala","Elektro soba","Terasa","Garaza"]
};
function roomPlaceholder(){return state.purpose==="home"?"Sve prostorije u domu":"Svi poslovni prostori";}
function allowedRooms(values){
  var allowed=purposeRooms[state.purpose]||[];
  return values.filter(function(item){return item.count>0&&allowed.indexOf(item.value)>=0;});
}
var state={purpose:"home",room:"",color:"",seq:0};
var rooms=root.querySelector("[data-rooms]");
var colors=root.querySelector("[data-colors]");
var summary=root.querySelector("[data-summary]");
var go=root.querySelector("[data-go]");
var purposeButtons=root.querySelectorAll("[data-purpose]");

function encode(value){
  return btoa(unescape(encodeURIComponent(JSON.stringify(value)))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
function group(data,name){
  var ordered=(data.filters&&data.filters.ordered)||[];
  for(var i=0;i<ordered.length;i++) if(ordered[i].name===name) return ordered[i].values||[];
  return [];
}
function visible(values,selected){
  return values.filter(function(item){return item.count>0||item.value===selected;});
}
function purposeValues(){
  return state.purpose==="commercial"?commercial:home;
}
function purposeLabel(){
  return state.purpose==="commercial"?"Za posao":"Za dom";
}
function attributes(){
  var list=[{name:"Namena",values:purposeValues().slice()}];
  if(state.room) list.push({name:"Tip prostorije",values:[state.room]});
  if(state.color) list.push({name:"Boja",values:[state.color]});
  return list;
}
function destination(){
  var pairs=[];
  attributes().forEach(function(item){
    item.values.forEach(function(value){pairs.push("da="+encodeURIComponent(item.name+":"+value));});
  });
  return "/katalog"+(pairs.length?"?"+pairs.join("&"):"");
}
function paint(){
  purposeButtons.forEach(function(button){
    button.setAttribute("aria-pressed",button.getAttribute("data-purpose")===state.purpose?"true":"false");
  });
  var text=purposeLabel();
  if(state.room) text+=" · "+state.room;
  if(state.color) text+=" · "+state.color;
  summary.textContent=text;
  go.href=destination();
}
function fill(node,values,selected,blank){
  node.replaceChildren();
  var first=document.createElement("option");
  first.value="";
  first.textContent=blank;
  node.appendChild(first);
  values.forEach(function(item){
    var option=document.createElement("option");
    option.value=item.value;
    option.textContent=item.value;
    node.appendChild(option);
  });
  node.value=values.some(function(item){return item.value===selected;})?selected:"";
}
function load(){
  var seq=++state.seq;
  paint();
  rooms.disabled=true;
  colors.disabled=true;
  var input={q:"",category:"all",page:1,limit:1,sort:"default",filters:[],attributes:attributes(),ranges:[],aggregate:["Tip prostorije","Boja"],countsOnly:true};
  var url="/page.php?wf_action=provider&channel=production&wf_path=%2Fkatalog&wf_instance=product-list-primary&wf_input="+encode(input);
  fetch(url,{headers:{Accept:"application/json"}}).then(function(response){
    if(!response.ok) throw new Error("status");
    return response.json();
  }).then(function(payload){
    if(seq!==state.seq) return;
    if(!payload||!payload.ok||!payload.data) throw new Error("payload");
    var roomValues=allowedRooms(group(payload.data,"Tip prostorije"));
    var colorValues=visible(group(payload.data,"Boja"),state.color);
    var dropped=false;
    if(state.room&&!roomValues.some(function(item){return item.value===state.room&&item.count>0;})){state.room="";dropped=true;}
    if(state.color&&!colorValues.some(function(item){return item.value===state.color&&item.count>0;})){state.color="";dropped=true;}
    fill(rooms,roomValues,state.room,roomPlaceholder());
    fill(colors,colorValues,state.color,"Sve nijanse");
    var count=Number(payload.data.total)||0;
    summary.textContent=purposeLabel()+(state.room?" · "+state.room:"")+(state.color?" · "+state.color:"")+" · "+new Intl.NumberFormat("sr-RS").format(count)+" proizvoda";
    go.href=destination();
    rooms.disabled=false;
    colors.disabled=false;
    if(dropped) load();
  }).catch(function(){
    if(seq!==state.seq) return;
    rooms.disabled=false;
    colors.disabled=false;
    fill(rooms,[],"",roomPlaceholder());
    fill(colors,[],"","Sve nijanse");
    summary.textContent="Izbor trenutno nije dostupan. Katalog je i dalje otvoren.";
    go.href="/katalog";
  });
}
root.querySelector(".mpf-switch").addEventListener("click",function(event){
  var button=event.target.closest("button");
  if(!button||button.getAttribute("aria-pressed")==="true") return;
  state.purpose=button.getAttribute("data-purpose");
  state.room="";
  state.color="";
  fill(rooms,[],"",roomPlaceholder());
  fill(colors,[],"","Sve nijanse");
  load();
});
rooms.addEventListener("change",function(){state.room=rooms.value;load();});
colors.addEventListener("change",function(){state.color=colors.value;load();});
load();
