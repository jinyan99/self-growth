import React,{useState} from 'react'
function App() {
  console.log("App render -->"+ performance.now())
  //performance的单位是微妙，一秒=1000毫秒，1毫秒=1000微秒
  const [num, setNum] = useState(0);
  function changeNum() {
    setNum(8);
    //这时第一次会触发渲染，重复的按第二次，也会重新渲染，重复按第三次不会重新渲染。
    //目前还没有特别精确解释，得看源码才能知道了。
    //不用太担心性能因为：步骤2会真真切切会重新渲染，步骤3只是执行一下App函数，并不会重新渲染App组件。
    //并且如果有子组件，子组件函数也不会在步骤3执行。所以不用太担心性能（所以一个相对解决办法是把复杂代码写子组件去）。
    //

  }
  return (
    <div id="App" className="App">
        num: {num}
      <button onClick={changeNum}>change num</button>
    </div>
  );
}
export default App;