(async()=>{
"use strict";
const $=id=>document.getElementById(id);
const iconSvg='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>';
let site,data;
try{[site,data]=await Promise.all(["data/site.json","data/products.json"].map(url=>fetch(url).then(r=>{if(!r.ok)throw Error(url);return r.json()})))}catch(e){$("products-grid").innerHTML='<p>Could not load products. Please check data/products.json.</p>';return}
document.title=(site.name||"The Fullstack Failures")+" — Products";
$("footer").textContent=site.footer||"";
const products=data.products||[], types=data.types||{};
let active="all",query="";
const allTypes=[...new Set(products.map(p=>p.type||"other"))];
const chips=$("chips");
[["all","All"],...allTypes.map(k=>[k,(types[k]||{}).label||k])].forEach(([key,label])=>{
const b=document.createElement("button");b.className="chip";b.type="button";b.role="tab";b.dataset.key=key;b.textContent=label;b.setAttribute("aria-selected",key==="all");
b.addEventListener("click",()=>{active=key;render()});chips.append(b);
});
function card(p){
const a=document.createElement("a");a.className="product-card";a.href=p.url||"#";a.rel="noopener noreferrer";if(p.type!=="apk"&&p.type!=="exe")a.target="_blank";
const head=document.createElement("div");head.className="card-head";
const logo=document.createElement("div");logo.className="product-icon";
if(p.icon&&/^(https?:|assets\/|\.\/)/.test(p.icon)){const img=document.createElement("img");img.src=p.icon;img.alt="";img.loading="lazy";img.width=54;img.height=54;logo.append(img)}else logo.innerHTML='<svg viewBox="0 0 24 24"><path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5zM4 7.5l8 4.5 8-4.5M12 12v9"/></svg>';
head.append(logo);if(p.new){const badge=document.createElement("span");badge.className="badge";badge.textContent="Just launched";head.append(badge)}
const title=document.createElement("h3");title.textContent=p.title||"Untitled";
const desc=document.createElement("p");desc.textContent=p.description||"A project from The Fullstack Failures.";
const meta=document.createElement("div");meta.className="meta";[p.price,p.version,p.size,(types[p.type]||{}).platform].filter(Boolean).forEach(s=>{const x=document.createElement("span");x.textContent=s;meta.append(x)});
const bottom=document.createElement("div");bottom.className="card-bottom";const cat=document.createElement("span");cat.className="category";cat.textContent=(types[p.type]||{}).label||"More";const cta=document.createElement("span");cta.className="card-cta";cta.append(document.createTextNode((types[p.type]||{}).action||"Open"));cta.insertAdjacentHTML("beforeend",iconSvg);bottom.append(cat,cta);
a.append(head,title,desc,meta,bottom);return a;
}
function render(){
chips.querySelectorAll("button").forEach(b=>b.setAttribute("aria-selected",String(b.dataset.key===active)));
const shown=products.filter(p=>(active==="all"||p.type===active)&&(!query||[p.title,p.description,p.type,(p.tags||[]).join(" ")].join(" ").toLowerCase().includes(query)));
$("products-grid").replaceChildren(...shown.map(card));$("empty").hidden=shown.length>0;
}
$("q").addEventListener("input",e=>{query=e.target.value.trim().toLowerCase();render()});
$("clear").addEventListener("click",()=>{query="";active="all";$("q").value="";render()});render();
const toast=msg=>{const t=$("toast");t.textContent=msg;t.classList.add("on");setTimeout(()=>t.classList.remove("on"),2300)};
$("share").addEventListener("click",async()=>{try{if(navigator.share)await navigator.share({title:document.title,url:location.href});else{await navigator.clipboard.writeText(location.href);toast("Link copied to clipboard")}}catch(e){if(e.name!=="AbortError")toast("Copy the page URL to share")}})
})();