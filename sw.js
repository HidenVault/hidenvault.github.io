self.addEventListener("fetch",e=>{
  e.respondWith(caches.open("v1").then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(res=>{c.put(e.request,res.clone());return res}))));
});
