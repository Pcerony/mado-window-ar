import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=new URL('./dist/',import.meta.url);
const mime={html:'text/html',css:'text/css',js:'text/javascript',mjs:'text/javascript',svg:'image/svg+xml'};
http.createServer(async(req,res)=>{
  try {const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(name.includes('..'))throw Error();const path=new URL('.'+(name==='/'?'/index.html':name),root);if(!fileURLToPath(path).startsWith(fileURLToPath(root)))throw Error();const data=await readFile(path);res.writeHead(200,{'Content-Type':mime[path.pathname.split('.').pop()]||'application/octet-stream'});res.end(data);}catch{res.writeHead(404);res.end('Not found');}
}).listen(4178,'127.0.0.1',()=>console.log('http://localhost:4178'));
