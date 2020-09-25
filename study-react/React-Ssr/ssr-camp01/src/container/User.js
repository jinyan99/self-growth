import React from 'react'
import {connect} from 'react-redux'
import {getUserInfo} from '../store/user'
import {Redirect} from 'react-router-dom'
function User(props){
  console.log(props.userinfo)
  //比如登陆逻辑判断   判断cookie token等
  //没登陆就跳转到登陆页
  //return <Redirect to="/"></Redirect>
  return <div>
    <h1>
      你好{props.userinfo.name}!,你们最棒的人是{props.userinfo.best}
    </h1>
  </div>
}
User.loadData = (store)=>{
  return store.dispatch(getUserInfo())
}
export default connect(
  state=>{
    return {
      userinfo:state.user.userinfo
    }
  }
)(User)
