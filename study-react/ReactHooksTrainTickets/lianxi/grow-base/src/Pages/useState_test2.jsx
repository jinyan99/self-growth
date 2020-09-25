import React,{useState} from 'react'
function App() {
  console.log("App render -->"+ performance.now())
  const [a, setA] = useState('A');
  const [b, setB] = useState('B');
  const [c, setC] = useState('C');
  //写在普通的同步环境函数里，这样执行，一并执行3个set，最终会合并只会触发一次App的渲染。
  //但是当你放在异步里setTimeout里的话这三个代码会触发3次App组件渲染。这和类组件的state挺像的。
  //和类组件里的setStae一样都会批量异步更新的，但这个useSttae会跟新一次覆盖掉之前对应state的所有值
  //这是与类组件不同的地方
  function changeState() {
    console.log('begin')
    setA('AA');
    console.log('a end')
    setB('BB');
    console.log('b end')
    setC('CC');
    console.log('c end')
  }
  return (
    <div id="App" className="App">
        a: {a}, b: {b}, c: {c}
      <button onClick={changeState}>change state</button>
    </div>
  );
}
export default App