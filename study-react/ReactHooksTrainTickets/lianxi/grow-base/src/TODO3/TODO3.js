import React, { useState, useRef } from "react";

// 这个是比上版更增加了，actions向真正actioncreator概念 转化。此主文件的dispatch随着action一起抽离到actions文件了
//  说这种actions文件可以叫actioncreator了，得有bindactioncreator函数的加入才可以用来在主组件与action文件之间做
//个中间桥梁(可以把dispatch从主组件向actions文件里函数交接过去)，这就是bindactioncreator的作用
//  bindactioncreator的另个作用就是可以对原有传过来的action函数对其 自顶向上 封装一层函数(可以比喻为给action函数向(主组件的)外加了个中间层)
//  (能接受自定义参数能在中间层写函数逻辑的函数，派发action时可以在中间层执行些逻辑)
//  这样就对原本的action函数扩展了一层接受参数写中间逻辑的功能---这也是bindactioncreator的一个重要作用 牢记！
//  流程结构：
//  bindactioncreator  => dispatch(action)
//  dispatch函数内部中     =>  action(dispatch,state)

import { createAdd, createSet, createToggle } from "./actions.js";

//新加的bindactioncreators概念函数写完后，传给控制层组件Control用的
function bindActionCreators(actionCreators, dispatch) {
  //这时传进来的1参是个对象，{addTodo: createAdd(这个函数返回的还是个函数) }
  //就是返回的是个新对象，key和传进来的一样，value值是包装了dispatch功能的createAdd函数。
  const ret = {};
  for (let key in actionCreators) {
    ret[key] = function (...args) {
      const actionCreator = actionCreators[key];
      //actionCreator就是那个createAdd函数
      //下面执行了下得到的action还是个函数，dispatch下就会到下面的111行
      const action = actionCreator(...args);
      dispatch(action);
    };
  }
  return ret;
}

//某一行项数据，最小粒度化组件
function TodoItem(props) {
  const { todo } = props;
  return (
    <li className="todo-item">
      <input type="checkbox" onChange checked></input>
      <label className={1 ? "complete" : ""}>{todo}</label>
      <button onClick>&#xd7;</button>
    </li>
  );
}
function Todos(props) {
  console.log(",.,.,.,.,.,，。，。。");
  const { todos } = props;
  return (
    <ul>
      {todos.map((todo) => {
        console.log(todo, "数组中的项");
        return <TodoItem todo={todo.text} key></TodoItem>;
      })}
    </ul>
  );
}

function Control(props) {
  const { addTodo } = props; //这版把前版的直接传dispatch给废除掉了，传的是包装了dispatch功能的createAdd action函数
  const inputRef = useRef();
  const onSubmit = (e) => {
    e.preventDefault();
    const newText = inputRef.current.value.trim();
    console.log(newText, "输入的值");
    if (newText.length == 0) {
      return;
    }
    /*
      createAdd函数只是生成action对象的，还需要dispatch发出去
      dispatch(createAdd({
            id: ++idSeq,
            text: newText,
            complete: false
        })) */
    addTodo(newText);
    inputRef.current.value = "";
  };
  return (
    <div className="control">
      <h1>todos DEMO</h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          className="new-todo"
          placeholder="what needs to be done"
          ref={inputRef}
        ></input>
      </form>
    </div>
  );
}

//  bindactioncreator  => dispatch(action)
//  dispatch函数内部中     =>  action(dispatch,state)
function TodoList(props) {
  const [todos, setTodos] = useState([]);

  const dispatch = (action) => {
    const state = {
      todos,
    };
    console.log(action, "看看要增加的数据");
    //  @异步改造部分代码
    if ("function" === typeof action) {
      console.log("actioncreator是一个函数");
      //得到传过来的函数，将这个函数再传disoatch参和store数据执行调用下，把dispatch作为参数传进去
      //记住这种用法，函数里能直接调用自己的函数名
      action(dispatch, state);
      return;
    }
    console.log(action, "不是函数的情况，就是个传统action对象");
    const { payload } = action;
    setTodos((todos) => [...todos, payload]);
  };
  return (
    <div className="todo-list">
      <h1>代办demo</h1>
      <Control
        {...bindActionCreators(
          {
            addTodo: createAdd,
          },
          dispatch
        )}
      ></Control>
      <Todos todos={todos}></Todos>
    </div>
  );
}
export default TodoList;
