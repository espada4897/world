// 책미사 바인더: 인터넷이 끊겨도 마지막으로 본 카드첩이 열리게.
// 카드첩 자체는 늘 새로 받아 보고(새 카드가 바로 보이게), 안 되면 저장해 둔 것을 연다. 그림은 저장해 둔 것을 먼저.
const C='binder-03c441e7b6';
self.addEventListener('install',e=>{ self.skipWaiting(); e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./manifest.webmanifest','./icon-192.png']).catch(()=>{}))); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('binder-')&&k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{ const r=e.request; if(r.method!=='GET') return; const u=new URL(r.url);
  if(u.origin===location.origin&&(r.mode==='navigate'||u.pathname.endsWith('/binder/'))){
    e.respondWith(fetch(r).then(res=>{ const cp=res.clone(); caches.open(C).then(c=>c.put('./',cp)); return res; }).catch(()=>caches.match('./'))); return; }
  if(u.origin===location.origin&&/\/cardimg\/|\.png$|\.webmanifest$/.test(u.pathname)||/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{ if(res.ok||res.type==='opaque'){ const cp=res.clone(); caches.open(C).then(c=>c.put(r,cp)); } return res; }))); }
});
