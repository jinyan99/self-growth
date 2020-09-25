
import React from 'react';
import ThemeContext from './base-context';
import LazyTest from './Pages/test_lazy.jsx';
import UseHook from './Pages/use_Hooks.jsx';
import StateReducer from './Pages/useState_useReducer2.jsx';
import TodoList from './TODO6/TODO6.js';
class App extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      value1:'测memo 状态值',
      value2: 'ha'
    }
  }
  componentDidMount() {
    this.setState({value2:2})
  }
  //错误边界，用于降级ui渲染显示
  static getDerivedStateFrmError(){return {hasError:true}}
  render() {
    const { value1 } = this.state;
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar {...{a:1}} b="io"></Toolbar>
        <LazyTest value={value1} ></LazyTest>
        <UseHook ref="bang"></UseHook>
        <hr></hr>
        <TodoList></TodoList>
        <hr/>
        <h1>下面是useState与useReducer的练习讨论</h1>
        <StateReducer/>
      </ThemeContext.Provider>
    );
  }
}

class Toolbar extends React.PureComponent {
  constructor(props){
    super(props)
    console.log(props,'Toolbar里的prop值');
    // 得到{a: 1, b: "io"}打印值
  }
  static contextType = ThemeContext;
  render(){
    const contextvalue = this.context;
    return (
    <div>
          {contextvalue}
    </div>
  );
  }
}
export default App
