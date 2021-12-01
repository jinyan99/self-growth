// 这里的node代码。会用babel处理
import React from 'react'
import {renderToString } from 'react-dom/server'
import express from 'express'
import {StaticRouter,matchPath, Route,Switch} from 'react-router-dom'
//通过这个matchPath属性能够判定当前组件当前这个component是不是匹配到了
import {Provider} from 'react-redux'
import {getServerStore} from '../src/store/store'
import routes from '../src/App'
import Header from '../src/component/Header'
import proxy from 'http-proxy-middleware';

//这段代码就是 要在server层面引入我们的app。去渲染我们的app。
const store = getServerStore()
const app = express()
app.use(express.static('public'))// 以public目录作为静态资源目录-没有加公共路径前缀

app.get('*',(req,res)=>{
  //监听所有路由。
  // 获取根据路由渲染出的组件，并且拿到loadData方法 获取数据

  //客户端来的api开头的请求-----H部分代码
  app.use(
    '/api',
    proxy({target: "http://localhost:9090", changeOrigin: true})
  )
  /*   面条式写法
  if (req.url.startsWith('/api/')) {
    //就不渲染页面，使用axios转发 axios.get
  } */

//下面这段代码是matchPath官方示例代码，可以搬过来直接用
const promises = [];// 先定义个数组来存储所有网络请求
// 路由匹配
routes.some(route=>{
  const match = matchPath(req.path,route)
  //通过match来判定当前组件能不能被渲染的
  if(match){//如果match匹配到了，我们就获取下当前组件
    const {loadData} = route.component
    if(loadData){//如果loadData存在化，说明当前组件需要异步去获取数据
      //包装层promsie-d部分代码
      // const promise = new Promise((res,rej)=>{
      //  //是一种规避报错，可以考虑加些日志。
      //   loadData(store).then(res).catch(res)
      // })
    //包装时用这个 promises.push(promise)
      promises.push(loadData(store))
    }
  }
})

// 最后在渲染层面去等待所有网络请求结束--再去渲染(把渲染的逻辑塞到promise.all里面)
  Promise.all(promises).then(()=>{
    const context = {};

    // 把react组件，解析成html
    const content = renderToString(
      //这个方法就是把react组件解析成dom(html),是由renderToString API做好的
      //里面的babel解析jsx成虚拟dom，然后用rendreTOString把页面解析出来
      <Provider store={store}>
        {/* 下面staticrouter的用法，得加location属性，把req.url传递给staticrouter，这样后端就能知道要响应什么路由--
        静态路由具体见react-router-dom中文文档静态路由https://serializedowen.github.io/docs/react-router-dom/API/static-router
        ---> 接收一个context属性，在咱们匹配到的route的渲染自定义组件里，props中会自动接收这个上下文值，咱们给上下文自定义赋值，然后在本content后面
        就能使用到context了
        */}
        <StaticRouter location={req.url} context={context}> 
          <Header></Header>
          <Switch>
          {routes.map(route=><Route {...route}></Route>)}
          </Switch>
        </StaticRouter>
      </Provider>

    )
    console.log('context', context);
    if(context.statuscode) {
      //状态的切换和页面跳转
      res.status(context.statuscode);
    }
    if(context.action=="REPLACE") {
      res.redirect(302,context.url)
    }
    // 然后插入字符串模板 ---> 页面先加载后端给的App组件，最后再水合渲染一遍前端的App组件（若两次App组件dom不一致或props数据不一致则会引起组件重渲染闪白现象）
    res.send(`
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>react ssr</title>
      </head>
      <body>
        <div id="root">${content}</div>
        <script>
          window.__context=${JSON.stringify(store.getState())}
        </script>
        <script src="/bundle.js"></script>
      </body>
    </html>

    `)//为什么58行src路径可以直接写/bundlejs呢，因为在本文件13行里把它做了静态资源目录
  }).catch(()=>{
    res.send('报错页面500')
  })
  
})
app.listen(9093,()=>{
  console.log('监听完毕')
})

//这样入口serve层就写完了