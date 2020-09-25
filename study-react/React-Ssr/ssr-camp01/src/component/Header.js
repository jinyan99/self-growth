import React from 'react'
import {Link} from 'react-router-dom'
//通过路由标签link，做个简单的路由导航
function Header(props){
  return <div>
    <Link to="/">首页</Link> | 
    <Link to="/about">关于</Link> ｜
    <link to="/user">user</link>
    <link to="/sdcwe">不存在</link>
  </div>
}

export default Header