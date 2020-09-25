// //本文件 就是service worker的上下文，在它的上下文中 : 
//     //1:你不能访问dom
//     //2:也不能访问window，localstorage等对象
//     //这是一个全新的上下文，只有一些特有的全局对象你才能访问。比如 self全局变量代表这个serviceworker的全局作用域对象
//     //我们与serviceworker打交道，只能通过在self上监听事件等等操作
// /* service worke 编程就是与它的生命周期打交道
// 关于生命周期一共有三种事件 install 和 activate 和fetch 安装和激活是两个东西，安装会触发install不会自动激活*/
// self.addEventListener('install', event => {
//     /* install事件是在一个新的service worker脚本被安装后触发，只要该文件内容有一丝丝不同(swjs文件改动，html里改动不算)，浏览器 就会认为这是两个不同的service worker
//     版本，新的版本会被下载安装即触发这个install安装事件，但并不会立即生效，因为当前生效的是上个版本
//     生效一个版本后会自动默认触发install 和activate两个周期，初次安装，和当前激活事件，若当前不是激活版本就不会触发生命周期
//     当内容改后，刷新浏览器，会有install安装触发，但激活事件不会触发，因为最新的版本不会自动激活处于waiting状态，上个版本仍然
//     保持激活状态，这个版本激活状态不是自动切换的是手动触发的
//     */
//    //这waitUntil的参数应该传个prosmise，当promsie完成之后，这个install事件的逻辑才会真正完成---意味着它会推出activate事件的执行
//    //event.waitUntil()
//    event.waitUntil(self.skipWaiting())//这个skipwaiting参数是强制停止旧版本的webservice worker并激活新的serviceworker，直接激活没有等待时间
//    //文件一更改后，就自动强制执行新版本的激活
//     console.log('intsall', event)
// })
// self.addEventListener('activate', event => {
//     /* activate事件是代表当前servoiceworker版本被启用的状态 */
//     console.log('activate', event)
//     //这个clients指的是serverworker控制的所有页面，claim方法能让页面在首次加载后同样受到serviceworker的控制
//     //因为默认情况下，首次是不受控制的
//     event.waitUntil(self.clients.claim())
// })
// self.addEventListener('fetch', event => {
//     //fetch事件是专门用来捕获中间请求或资源请求的，当你的html页面link链接了个css资源文件，这时就会触发这个事件，zai
//     //在事件对象request属性中能知道你当前的是css资源请求
//     console.log('fetch', event)
// })




//先定义个缓存空间名字，名字可以写版本号v1
const CACHE_NAME = 'cache-v1';
self.addEventListener('install', event => {
        console.log('intsall', event)
    //在waitUntil中写，先打开特定的缓存空间，然后写入必要的资源数据，这样我们就能确保serviceworker在
    //激活之后，立刻就能响应特定的资源请求，在serviceworker上下文中可以设置多个缓存空间。所有缓存空间的
    //集合叫做caches(),他是全局对象，可以直接用。打开一个缓存空间用caches.open(缓存空间名字)方法。
        event.waitUntil(caches.open(CACHE_NAME).then(cache => {
    //open得到的是一个promsie在它点then中可以得到缓存空间的句柄,用then里的cache就可以写入缓存了
        cache.addAll([ //数组里每一项就是资源的路径，下面缓存了2个资源，一个html页面一个css资源
            '/', //把项目根目录下的indexhtml首页给缓存了
            './index.css' //写入css资源的缓存
        ]);//写入缓存的方法，数组里的资源列表应该在构建时自动写入，不能人工维护，太容易出错了
    }));

self.addEventListener('activate', event => {
     console.log('activate', event)
     //我们希望在下次激活之前，完成对cache的清理所以还得在waitUntil中写方法
     event.waitUntil(caches.keys().then(cacheNames => {
         return Promise.all(cacheNames.map(cacheName => {
             if(cacheName !== CACHE_NAME) {
                 //遍历到对应名字的缓存空间值，给他delete删除caches总对象中的属性，返回新数组，由all全部调用后进入下个周期
                 return caches.delete(cacheName) //用来清除缓存
             }
            //这个函数最后还是返回的promse
         }))
     }))
 })

 self.addEventListener('fetch', event => {
        //我们可以捕获到包括html和css在内的所有资源请求，然后去cahce中查询
        //如果查到了，就返回回来。否则就发送网络请求获取
          console.log('fetch', event)
          event.respondWidth(caches.open(CACHE_NAME).then(cache => {
              //判断缓存里面有没有当前请求的资源
            return cache.match(event.request).then(response => {
                if(response) {
                    return response;
                }
                //不存在的话，去fetch请求，请求完再往cache里存一份。
                return fetch(event.request).then(response => {
                    cache.put(event.request, response.clone())
                    //注意。得到的response 是流式的所以它只能读取一次。为了缓存可重复读取，我们要克隆一份出来
                    return response;
                })
            })
          }))
         })




     })