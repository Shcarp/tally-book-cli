const cacheName = 'my_app_cache'
self.addEventListener('install', function(event) {
  console.log(1111)
  // Perform install steps
  console.log('Service worker installed.'); // 初始化 Cache Storage 
  const cacheOpenPromise = caches.open(cacheName); // 安装过程中，等待 Cache Storage 配置完成 
  e.waitUntil(cacheOpenPromise);
});


self.addEventListener('fetch', function(e){
  if (!request.url.endsWith('.js')) return false;
  const promise = caches.open(cacheName).then(cache => {
    return cache.match(e.request).then(res => {
      if (res) {
        return Promise.resolve(res)
      } else {
        const req = new Request(e.request.url)
        return fetch(corsRequest).then(res => {
          cache.put(request, res.clone());
          return res;
        })
      }
    })
  })
  e.respondWith(promise)
})