const cacheName = 'my_app_cache'

let filesToCache = [
  './index.css',
  './components/BillItem/style.module.less',
  './components/CustomIcon/index.jsx',
  './components/Header/style.module.less',
  './components/Nav/style.model.less',
  './components/PopupAddBill/style.module.less',
  './components/PopupDate/index.jsx',
  './components/PopupType/style.module.less',
]

self.addEventListener('install', function(e) {
  // Perform install steps
  console.log('Service worker installed.'); // 初始化 Cache Storage 
  const cacheOpenPromise = caches.open(cacheName).then(cache => {
    cache.addAll(filesToCache)
  }); // 安装过程中，等待 Cache Storage 配置完成 
  e.waitUntil(cacheOpenPromise)
});


self.addEventListener('fetch', function(e){
  console.log(e)
  // if (!request.url.endsWith('.js')) return false;
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