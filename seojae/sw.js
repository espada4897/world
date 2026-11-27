// 밤의 서재: 인터넷이 끊겨도 마지막으로 연 서재가 열리게. 화면은 늘 새로 물어보고, 안 되면 저장본.
const C='seojae-2deb624c48';
self.addEventListener('install',e=>{ self.skipWaiting(); e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./manifest.webmanifest','./icon-192.png']).catch(()=>{}))); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('seojae-')&&k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{ const r=e.request; if(r.method!=='GET') return; const u=new URL(r.url);
  if(u.origin===location.origin&&(r.mode==='navigate'||u.pathname.endsWith('/seojae/'))){
    e.respondWith(fetch(r.url,{cache:'no-cache',credentials:'same-origin'}).then(res=>{ const cp=res.clone(); caches.open(C).then(c=>c.put('./',cp)); return res; }).catch(()=>caches.match('./'))); return; }
  if(u.origin===location.origin&&/\.png$|\.webmanifest$/.test(u.pathname)||/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{ if(res.ok||res.type==='opaque'){ const cp=res.clone(); caches.open(C).then(c=>c.put(r,cp)); } return res; }))); }
});
