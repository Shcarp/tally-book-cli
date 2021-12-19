const cacheName = 'my_app_cache'
const RUNTIME = 'runtime'

let filesToCache = [
  '/src/index.html',
  '/src/index.css',
  '/src/components/BillItem/style.module.less',
  '/src/components/CustomIcon/index.jsx',
  '/src/components/Header/style.module.less',
  '/src/components/Nav/style.model.less',
  '/src/components/PopupAddBill/style.module.less',
  '/src/components/PopupDate/index.jsx',
  '/src/components/PopupType/style.module.less',
  '/src/container/About/style.module.less'
]

self.addEventListener('install', function(e) {
  // Perform install steps
  console.log('Service worker installed.'); // 初始化 Cache Storage 
  const cacheOpenPromise = caches.open(cacheName).then(cache => {
    cache.addAll(filesToCache)
  }).then(self.skipWaiting()); // 安装过程中，等待 Cache Storage 配置完成 
  e.waitUntil(cacheOpenPromise)
});

self.addEventListener('activate', event => {
  const currentCaches = [cacheName, RUNTIME]

  event.waitUntil(
      caches.keys().then(cacheNames => {
          return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
      }).then(cachesToDelete => {
          return Promise.all(cachesToDelete.map(cacheToDelete => {
              return caches.delete(cacheToDelete) // 删除不存在的过期缓存
          }))
      }).then(() => self.clients.claim()) // 启用新的 Service Worker
  )
})

self.addEventListener('fetch', event => {
    if (event.request.method === 'POST' || event.request.method.method === 'post') {
        return fetch(event.request).then(response => {
            return response
        })
    }
    if (event.request.url.includes('3000/api')) {
        return fetch(event.request).then(response => {
            return response
        })
    }
    

  // 跳过跨域请求
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            // 从缓存中匹配请求的资源
            caches.match(event.request).then(cachedResponse => {
                // 存在则直接返回
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                // 不存在则回退网络请求
                return caches.open(RUNTIME).then(cache => {
                    return fetch(event.request).then(response => {
                        // 拷贝响应资源存入 runtime 缓存.
                            return cache.put(event.request, response.clone()).then(() => {
                                return response;
                            })
                    })
                })
            })
        )
    }
})

