const stage=document.getElementById("stage"),world=document.getElementById("world"),nodesLayer=document.getElementById("nodes"),svg=document.getElementById("edges"),details=document.getElementById("details"),detailsBody=document.getElementById("detailsBody");
let sourceNodes=[],mode="architecture",panX=0,panY=0,scale=.86,drag=null,nodeDrag=null,lastItems=[],lastPositions=new Map(),nodeById=new Map();
const positionStorageKey="meduza-map-node-positions-v3";let manualPositions={};try{manualPositions=JSON.parse(localStorage.getItem(positionStorageKey)||"{}")}catch(_){manualPositions={}}

function esc(v){return String(v??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[ch]))}
function statusText(n){return({root:"центр",done:"готово",current:"вы здесь",verify:"проверка",blocked:"заблокировано",protected:"контракт",deferred:"отложено",active:"раздел",branch:"раздел"})[n.status]||n.status||"раздел"}

function buildTree(){
  nodeById=new Map(sourceNodes.map(n=>[n.id,{...n,children:[]}]));
  let root=null;
  for(const n of nodeById.values()){
    if(!n.parent){if(!root||n.id==="meduza")root=n;continue}
    const p=nodeById.get(n.parent);if(p)p.children.push(n)
  }
  for(const n of nodeById.values()){
    n.children.sort((a,b)=>(a.order??999)-(b.order??999)||a.title.localeCompare(b.title,"ru"));
    const src=sourceNodes.find(s=>s.id===n.id);n.expanded=src?.expanded??false;
  }
  return root
}
function taskKeep(){
  const keep=new Set();
  for(const n of nodeById.values())if(n.type==="task"){let c=n;while(c){keep.add(c.id);c=c.parent?nodeById.get(c.parent):null}}
  return keep
}
function visibleByMode(n,keep){if(mode==="all")return true;if(mode==="architecture")return n.type!=="task";return keep.has(n.id)}
function visibleItems(root){
  const out=[],keep=taskKeep();
  function walk(n,depth,parent){if(!visibleByMode(n,keep))return;out.push({node:n,depth,parent});if(!n.children.length||!n.expanded)return;for(const c of n.children)walk(c,depth+1,n)}
  walk(root,0,null);return out
}
function layout(items){
  const ids=new Set(items.map(i=>i.node.id)),byParent=new Map(),y=new Map();let row=0;
  for(const i of items){if(!i.parent)continue;if(!byParent.has(i.parent.id))byParent.set(i.parent.id,[]);byParent.get(i.parent.id).push(i.node.id)}
  function place(id){const kids=(byParent.get(id)||[]).filter(k=>ids.has(k));if(!kids.length){const v=row++*148;y.set(id,v);return v}const vals=kids.map(place),v=vals.reduce((s,x)=>s+x,0)/vals.length;y.set(id,v);return v}
  if(items[0])place(items[0].node.id);
  const vals=[...y.values()],center=vals.length?(Math.min(...vals)+Math.max(...vals))/2:0,map=new Map();
  for(const i of items){const base={x:i.depth*330,y:(y.get(i.node.id)??0)-center},saved=manualPositions[i.node.id];map.set(i.node.id,saved?{...saved}:base)}
  return map
}
function cls(n){return "node"+(n.id==="meduza"?" root":"")+(n.children.length?" expandable":"")+" "+(n.status||"branch")}
function drawEdges(){svg.innerHTML="";for(const i of lastItems){if(!i.parent)continue;const a=lastPositions.get(i.parent.id),b=lastPositions.get(i.node.id);if(!a||!b)continue;const l=document.createElementNS("http://www.w3.org/2000/svg","line");for(const [k,v] of Object.entries({x1:a.x,y1:a.y,x2:b.x,y2:b.y,class:i.depth===1?"edge primary":"edge"}))l.setAttribute(k,v);svg.appendChild(l)}}
function showDetails(n){const deps=n.depends_on?.length?"\nЗависит от: "+n.depends_on.join(", "):"",protects=n.protects?.length?"\nЗащищает: "+n.protects.join(", "):"";detailsBody.innerHTML="<h2>"+esc(n.title)+"</h2><div class='meta'>"+esc(n.type)+" · "+esc(statusText(n))+"</div><pre>"+esc((n.body||n.subtitle||"").trim()+deps+protects)+"</pre>";details.classList.remove("hidden")}
function render(){
  const root=buildTree();if(!root)return;
  if(mode==="tasks"){const keep=taskKeep();for(const n of nodeById.values())if(n.type!=="task"&&keep.has(n.id)){n.expanded=true;const src=sourceNodes.find(s=>s.id===n.id);if(src)src.expanded=true}}
  const items=visibleItems(root),pos=layout(items),keep=taskKeep();lastItems=items;lastPositions=pos;nodesLayer.innerHTML="";svg.innerHTML="";
  for(const i of items){
    const n=i.node,p=pos.get(n.id),el=document.createElement("div");el.className=cls(n);el.style.left=p.x+"px";el.style.top=p.y+"px";
    const has=n.children.some(c=>visibleByMode(c,keep)),hint=has?"<span class='branch-hint'>"+(n.expanded?"открыто":"есть ветки")+"</span>":"<span class='leaf-mark'>•</span>";
    el.innerHTML="<div class='node-head'><span class='status-dot'></span><div class='node-copy'><div class='node-title'>"+esc(n.title)+"</div><div class='node-sub'>"+esc(n.subtitle)+"</div></div>"+hint+"</div><div class='node-foot'><span class='status-label'>"+esc(statusText(n))+"</span><span class='type-label "+(n.type==="task"?"task":"")+"'>"+(n.type==="task"?"задача":"архитектура")+"</span><span>"+(has?"ветки":"конечный узел")+"</span></div>";
    el.addEventListener("mousedown",e=>{if(e.button!==0)return;e.stopPropagation();const cur=lastPositions.get(n.id);if(!cur)return;nodeDrag={id:n.id,node:n,has,startX:e.clientX,startY:e.clientY,x:cur.x,y:cur.y,el,moved:false};if(n.id!=="meduza")el.classList.add("dragging-node")});
    el.addEventListener("dblclick",e=>{e.stopPropagation();showDetails(n)});nodesLayer.appendChild(el)
  }
  drawEdges();applyTransform()
}
function applyTransform(){world.style.transform="translate("+panX+"px,"+panY+"px) scale("+scale+")"}
stage.addEventListener("wheel",e=>{e.preventDefault();scale=Math.max(.34,Math.min(1.55,scale*(e.deltaY>0?.91:1.1)));applyTransform()},{passive:false});
stage.addEventListener("mousedown",e=>{if(e.target.closest(".node")||e.target.closest("button")||e.target.closest(".details"))return;drag={x:e.clientX,y:e.clientY,panX,panY};stage.classList.add("dragging")});
window.addEventListener("mousemove",e=>{if(nodeDrag){const dx=e.clientX-nodeDrag.startX,dy=e.clientY-nodeDrag.startY;if(Math.hypot(dx,dy)>6)nodeDrag.moved=true;if(nodeDrag.moved&&nodeDrag.id!=="meduza"){const x=nodeDrag.x+dx/scale,y=nodeDrag.y+dy/scale;manualPositions[nodeDrag.id]={x,y};lastPositions.set(nodeDrag.id,{x,y});nodeDrag.el.style.left=x+"px";nodeDrag.el.style.top=y+"px";drawEdges()}return}if(!drag)return;panX=drag.panX+(e.clientX-drag.x)/scale;panY=drag.panY+(e.clientY-drag.y)/scale;applyTransform()});
window.addEventListener("mouseup",()=>{if(nodeDrag){const d=nodeDrag;d.el?.classList.remove("dragging-node");if(d.moved&&d.id!=="meduza")localStorage.setItem(positionStorageKey,JSON.stringify(manualPositions));else if(!d.moved&&d.has){const src=sourceNodes.find(s=>s.id===d.node.id);if(src)src.expanded=!src.expanded}else if(!d.moved)showDetails(d.node);nodeDrag=null;render()}drag=null;stage.classList.remove("dragging")});
document.querySelectorAll(".modes button").forEach(b=>b.onclick=()=>{mode=b.dataset.mode;document.querySelectorAll(".modes button").forEach(x=>x.classList.toggle("active",x===b));details.classList.add("hidden");render()});
zoomIn.onclick=()=>{scale=Math.min(1.55,scale*1.12);applyTransform()};zoomOut.onclick=()=>{scale=Math.max(.34,scale/1.12);applyTransform()};reset.onclick=()=>{panX=0;panY=0;scale=.86;applyTransform()};resetLayout.onclick=()=>{manualPositions={};localStorage.removeItem(positionStorageKey);render()};closeDetails.onclick=()=>details.classList.add("hidden");
fetch("./data/nodes.json").then(r=>{if(!r.ok)throw new Error("HTTP "+r.status);return r.json()}).then(n=>{sourceNodes=n;render()}).catch(e=>nodesLayer.innerHTML="<div style='color:#ff8b8b;width:420px'>Ошибка загрузки карты: "+esc(e.message)+"</div>");
