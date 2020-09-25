import React,{useReducer,useState} from 'react'
//useReducer概念：https://segmentfault.com/a/1190000020088192
//官方文档： https://zh-hans.reactjs.org/docs/hooks-reference.html#specifying-the-initial-state
//本文参考项目：https://www.jianshu.com/p/9138e63fd1a9参考他的项目
//这是第二版，引入了useReducer的概念，解决了1版useState的问题，useReducer有三个参数，详见官方文档
import Usestae from './useState_test'
import Usestae2 from './useState_test2'
//useReducer的2参初始化
const initialState = {
  price: 0,
  num: 0,
  money: 0,
};
//useReducer的3参，惰性初始化。这里回掉的参数就是useReducer的2参
function init(initialCount) {
  return {...initialCount};
}
//作为useReducer的1参，reducer函数
function myReducer(state, action) {
  console.log(JSON.parse(JSON.stringify(state)))
  switch(action.type) {
    case 'changePrice':
      return {
        ...state,
        price: action.price,
        money: action.price * state.num
      }
    case 'changeNum':
      return {
        ...state,
        num: action.num,
        money: state.price * action.num
      }
    default:
      throw new Error();
  }
}
//好处：虽然效果原理和上一版一样，但是这个是使组件更干净，复杂逻辑能从组件中抽离出来运用了状态容器的思想
//useReducer改造代码后，不用考虑状态异步的问题，性能也好。相关的业务逻辑也可以
//拆分到单独文件去了，使组件更干净。
function App() {
  const [state, dispatch] = useReducer(myReducer, initialState, init);
  console.log(state,'看看useReducer返回的参数')
  return (
    <div id="App" className="App">
      <p>Price: {state.price}<button onClick={() => dispatch({type:'changePrice', price: 8})}>change price</button></p>
      <p>Num: {state.num}<button onClick={() => dispatch({type:'changeNum', num: 2})}>change num</button></p>
      <p>Money: {state.money}</p>
      <button onClick={() => {
          dispatch({type:'changePrice', price: 6.6});
          dispatch({type:'changeNum', num: 3});
        }}>change price and num</button>
        <hr/>
        <Usestae />
        <hr/>
        <Usestae2 />
    </div>
  );
}
export default App