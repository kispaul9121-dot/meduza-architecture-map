import fs from "node:fs";
import path from "node:path";

const root=process.cwd(),contentRoot=path.join(root,"content"),output=path.join(root,"site","data","nodes.json");

function walk(dir){let out=[];for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())out=out.concat(walk(f));else if(e.isFile()&&e.name.endsWith(".md"))out.push(f)}return out}
function scalar(raw){const v=raw.trim();if(v==="true")return true;if(v==="false")return false;if(/^-?\d+(\.\d+)?$/.test(v))return Number(v);if(v.startsWith("[")&&v.endsWith("]"))return v.slice(1,-1).split(",").map(x=>x.trim()).filter(Boolean);return v.replace(/^["']|["']$/g,"")}
function parseMeta(text,file){const meta={};for(const line of text.split("\n")){if(!line.trim()||line.trim().startsWith("#"))continue;const i=line.indexOf(":");if(i<0)throw new Error("Bad metadata in "+file+": "+line);meta[line.slice(0,i).trim()]=scalar(line.slice(i+1))}return meta}
function parseFile(file){
  const text=fs.readFileSync(file,"utf8").replace(/\r\n/g,"\n"),nodes=[];
  const re=/---node\n([\s\S]*?)\n---\n([\s\S]*?)(?=\n---node\n|$)/g;let m;
  while((m=re.exec(text))){const meta=parseMeta(m[1],file);if(!meta.id||!meta.title||!meta.type)throw new Error("id/title/type required in "+file);nodes.push({...meta,parent:meta.parent||null,status:meta.status||"branch",order:meta.order??999,expanded:meta.expanded??false,body:m[2].trim(),source_file:path.relative(root,file).replaceAll("\\","/")})}
  if(!nodes.length)throw new Error("No ---node blocks in "+file);return nodes
}
const nodes=walk(contentRoot).flatMap(parseFile),ids=new Set();
for(const n of nodes){if(ids.has(n.id))throw new Error("Duplicate id: "+n.id);ids.add(n.id)}
for(const n of nodes)if(n.parent&&!ids.has(n.parent))throw new Error("Unknown parent "+n.parent+" for "+n.id);
const roots=nodes.filter(n=>!n.parent);if(roots.length!==1)throw new Error("Expected exactly one root, found "+roots.length);
nodes.sort((a,b)=>(a.order??999)-(b.order??999)||a.title.localeCompare(b.title,"ru"));
fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(nodes,null,2)+"\n");console.log("Built",nodes.length,"nodes");
