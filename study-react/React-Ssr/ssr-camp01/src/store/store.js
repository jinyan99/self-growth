// 存储的入口
import {createStore,applyMiddleware,combineReducers } from 'redux'
import thunk from 'redux-thunk'
import indexReducer from './index'
import userReducer from './user'
import axios from 'axios';
const reducer = combineReducers({
  index:indexReducer,
  user:userReducer
})

//gg部分代码----前端的请求直接映射到本地就可以了，甚至都不用做baseurl
const serverAxios = axios.create({
  baseURL: 'http://localhost:9090/'
})
const clientAxios = axios.create({
  baseURL: "/"
})






// export default store
export const getServerStore = ()=>{
  // 服务端用的，server端默认是没有初始化数据的，通过server的dispatch来获取和充实
  //
  return createStore(reducer,applyMiddleware(thunk))
 // return createStore(reducer,applyMiddleware(thunk.withExtraArgument(serverAxios)))
}


export const getClientStore = ()=>{//getClientStore里才有window的属性设置呢
  // 通过window.__context来获取数据
  // 浏览器端是要有初始化数据的
  const defaultState = window.__context ?window.__context:{}
  return createStore(reducer,defaultState,applyMiddleware(thunk))
 // return createStore(reducer,defaultState,applyMiddleware(thunk.withExtraArgument(clientAxios)))
}
