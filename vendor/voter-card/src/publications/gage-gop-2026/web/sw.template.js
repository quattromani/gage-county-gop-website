const PREFIX='gage-gop-card-'+encodeURIComponent(self.registration.scope)+'-';
const CACHE=PREFIX+__CACHE__;
const ASSETS=__ASSETS__;
const full=path=>new URL(path,self.registration.scope).href;
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
async function ready(cache){return (await Promise.all(ASSETS.map(path=>cache.match(full(path))))).every(Boolean);}
self.addEventListener('message',event=>event.waitUntil((async()=>{
 try{
  const cache=await caches.open(CACHE);
  if(event.data.type==='SAVE'){
   await cache.addAll(ASSETS.map(path=>new Request(full(path),{cache:'reload'})));
   if(!await ready(cache))throw new Error('Some files could not be saved.');
   for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);
  }
  event.ports[0]?.postMessage({ready:await ready(cache)});
 }catch(error){event.ports[0]?.postMessage({error:error.message});}
})()));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||!url.href.startsWith(self.registration.scope))return;
 const indexRequest=event.request.mode==='navigate' && (url.pathname===new URL(self.registration.scope).pathname||url.pathname.endsWith('/index.html'));
 event.respondWith((async()=>{
  try{return await fetch(event.request);}catch{
   const key=indexRequest?full('./'):event.request;
   const keys=[CACHE,...(await caches.keys()).filter(k=>k.startsWith(PREFIX)&&k!==CACHE)];
   for(const name of keys){const match=await (await caches.open(name)).match(key);if(match)return match;}
   return new Response('This file is not saved offline. Reconnect to view it, or open a PDF you previously downloaded.',{status:503,headers:{'Content-Type':'text/plain'}});
  }
 })());
});
