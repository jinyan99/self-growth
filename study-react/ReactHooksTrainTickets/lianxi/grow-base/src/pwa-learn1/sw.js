//定义个缓存空间名字
const CACHE_NAME = 'cache-v1';
self.addEventListener('install', event => {
    console.log('触发安装事件了')
    event.waitUntil(caches.open(CACHE_NAME).then(cache => {
        console.log('开始缓存资源了')
        cache.addAll([
            '/',
            './index.css'
        ])
    }))
})
self.addEventListener('activate', event => {
    console.log('触发激活事件了hah')
    event.waitUntil(caches.keys().then(cacheNames => {
        return Promise.all(cacheNames.map(cacheName => {
            if(cacheName !==  CACHE_NAME) {
                return caches.delete(cacheName)
            }
        }))
    }))
})
self.addEventListener('fetch', event => {
    console.log('触发捕获事件了', event)
    event.responseWidth(caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(response => {
            if(response) {
                return response;
            }
            return fetch(event.request).then(response => {
                cache.put(event.request, response.clone())
                //注意。得到的response 是流式的所以它只能读取一次。为了缓存可重复读取，我们要克隆一份出来
                return response;
            })
        })
    }))
})