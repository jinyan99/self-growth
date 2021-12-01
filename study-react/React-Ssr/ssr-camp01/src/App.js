//小a部分
// import React from 'react'
// import React, {useState} from 'react';
// function App(props) {
//   const [count,setCount] = useState(1);
//   return <div>
//     <h1>哈喽 {props.title} ! {count} </h1>
//     <button onClick={() => serCount(count + 1)}>累加</button>
//   </div>
// }
// export default <App title="开课吧"></App>





import React from 'react'
import {Route} from 'react';
import Index from './container/Index'
import About from './container/About'
import User from './container/User'
import Notfound from './container/Notfound';
// import './App.css';

//小 b 部分代码
//这种是写成用路由包裹起来的组件
// export default (
//   <div>
//     <Route path="/" exact component={Index}></Route>
//     <Route path="/about" exact component={About}></Route>
//   </div>
// )






//  小 c 部分代码
// 改造成js的动态配置，才能获取组件
export default [
  {
    path:"/",
    component:Index,
    // loadData:Index.loadData, 这种方式拿到loadData也是可以的，先按照组件里拿吧
    // exact:true,
    key:'index' //因为我们要遍历去拿组件
    //嵌套子路由的方式当作layout，不写嵌套子路由，写成不精确处理也会有layout的效果。
  },
  {
    path:"/about",
    component:About,
    exact:true,
    key:'about'
  },
  {
    path:"/user",
    component:User,
    exact:true,
    key:'user'
  },
  {
    component:Notfound
  }
]