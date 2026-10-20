const V='bdbus-v1';
const A=['./','index.html','manifest.webmanifest','icon.svg','https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'];
self.addEventListener('install',e=>{
e.waitUntil(caches.open(V).then(c=>Promise.all(A.map(u=>c.add(new Request(u,{mode:u.startsWith('http')?'no-cors':'same-origin'})).catch(()=>{})))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
const r=e.request;
if(r.method!=='GET')return;
const same=new URL(r.url).origin===location.origin;
const keep=res=>{const cp=res.clone();caches.open(V).then(c=>c.put(r,cp)).catch(()=>{});return res;};
e.respondWith(same
?fetch(r).then(keep).catch(()=>caches.match(r).then(m=>m||caches.match('index.html')))
:caches.match(r).then(m=>m||fetch(r).then(keep)));
});
