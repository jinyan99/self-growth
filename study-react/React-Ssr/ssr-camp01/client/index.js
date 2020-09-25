import React from 'react'
import ReactDom from 'react-dom'
import {BrowserRouter, Route,Switch} from 'react-router-dom'
import {Provider} from 'react-redux'
import routes from '../src/App'
import {getClientStore} from '../src/store/store'
import Header from '../src/component/Header'

// 注水 
//这个文件写的是客户端入口文件代码，最终也是要变成那个client Bundle，完成这个打包
//还是得需要webpack的支持，得建个针对它的webpack配置文件建立webpack.client.js 。

const Page = (<Provider store={getClientStore()}>
  <BrowserRouter>
  <Header></Header>
  <Switch>
    {routes.map(route=> <Route {...route}></Route>)}
  </Switch>
  </BrowserRouter>
</Provider>)

//注意这里就不能用ReactDOM.render了，因为render的初始化既做dom初始化有做事件监听
//现在我们server 渲染那个首屏html页已经出来了已经默认把html放好在浏览器了，所以我们就换个api
//叫做注水的reactdom的api。----ReactDom.hydrate
ReactDom.hydrate(Page, document.getElementById('root'))
//这个page渲染完毕之后，其实就已经变成了一个多页应用。
//配置完之后，浏览器url中直接输入路由路径显示对应的路由是没问题的，
