import React, {useState,useEffect} from 'react'
import {connect} from 'react-redux'
import {getIndexList} from '../store/index'
function Index(props){
  const [count ,setCount] = useState(1)
 
  //d部分effect代码
  useEffect(()=>{//实现个didmoount的效果
    // 异步数据首页显示默认是显示不到同构里的显示界面的，要额外设置下，让首页异步数据实现ssr。
    if(!props.list.length){
      //笔记13的解决方案 加的判断，若为空的话就是客户端获取数据，
      props.getIndexList()
    }
  }, [])
  
  
  return <div>
    <h1>哈喽 {props.title} !  {count}</h1>
    <button onClick={()=>setCount(count+1)}>累加</button>
    <hr/>
      <ul>
        {props.list.map(item=>{
          return <li key={item.id}>{item.name}</li>
        })}
      </ul>
  </div>
}
//静态方法
Index.loadData = (store)=>{
  return store.dispatch(getIndexList())
}

export default connect(
  state=>({list:state.index.list}),
  {getIndexList}
)(Index)
