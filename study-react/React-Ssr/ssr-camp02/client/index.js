import React from 'react'
import ReactDom from 'react-dom'
import {BrowserRouter, Route} from 'react-router-dom'
import {Provider} from 'react-redux'
import routes from '../src/App'
import {getClientStore} from '../src/store/store'
import Header from '../src/component/Header'

// 注水 客户端入口
const Page = (<Provider store={getClientStore()}>
  <BrowserRouter>
  <Header></Header>
    {routes.map(route=> <Route {...route}></Route>)}
  </BrowserRouter>
</Provider>)

//如果你单纯的csr渲染就不应该用注水脱水这个功能，不能从store里拿数据了，而是应该用render来操作。
if(window.__content) {
  //ssr
  ReactDom.hydrate(Page, document.getElementById('root'))
} else {
  //csr
  ReactDom.render(Page, document.getElementById('root'))
}