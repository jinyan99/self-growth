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


/**
 * 梳理下流程：先打包clientindex再打包serverindex，再node执行serverbudnlejs文件起服务即可
 * 1. 需要client目录---> client就是前端的项目文件结构，只不过最后渲染是采用的ReactDom.hydrate渲染到页面节点（因为此时页面上已经有dom和事件监听了，此时引入的js只需要配合作出交互后的js逻辑，所以不用render了用hydrate渲染不用初始化dom和事件监听）
 * 2. server目录 --> 
 *    1.起node服务，让浏览器访问到这，拿到client的对应路由组件
 *    2.调用组件的loadData静态方法，传入server的store，然后执行loadData期间更新了server-store数据，然后将这个更新过路由组件数据的server-store，以全局变量的形式加到html模版里---完成注水动作
 *    3.然后再把和client一样的App组件加到html里res出去（已经往html里注水）一同返回浏览器，
 * 3. 浏览器访问node服务的ip：拿到html（带注水的数据和插入好App组件的html），会渲染这个html，然后html里内联了clientbundlejs，又会渲染一遍App组件到html节点里（这时候采用的是hydrate渲染）
 * 4. 这时候浏览器：页面先加载后端给的App组件，html最后才执行引入的bundlejs，所以最后react再注水渲染一遍前端的App组件
			（dom与已有的服务端一致，要做的就是textContent的更新和为元素完成事件的绑定和交互处理）
			（若两次App组件前后dom不一致或props前后数据不一致则会引起组件重渲染闪白现象）
 */