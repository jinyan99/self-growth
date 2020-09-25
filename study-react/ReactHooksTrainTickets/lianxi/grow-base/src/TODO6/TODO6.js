import React, { useState, useRef, useEffect,useMemo} from 'react';
//这版主要讲异步Action的处理用法

//主要是125行，为了能解决拿到异步action后最新的state值，采取传回掉函数的形式，传参，在异步后执行回掉能拿到最新值


import reducer from './reducers';

import {
    createAdd,
    createSet,
    createToggle,
    createRemove
} from './actions.js';
  //新加的bindactioncreators概念函数写完后，传给控制层组件Control用的
function bindActionCreators(actionCreators,dispatch) {
   //这时传进来的1参是个对象，{addTodo: createAdd(这个函数返回的还是个函数) }
    const ret = {};
    for(let key in actionCreators) {
        ret[key] = function(...args) {
            console.log('这就是中间层 打印了',key,args[0])
            const actionCreator = actionCreators[key];
            const action = actionCreator(...args);
            dispatch(action)
        }
    }
    return ret;
}

//某一行项数据，最小粒度化组件
function TodoItem(props) {
    const {//记住这种解构方式
           todo: {
               id,
               text,
               complete
           },
           removeTodo
        } = props;
    const onremoveTodo = () => {
        removeTodo(id)
    }
    return <li className="todo-item">
        <input
            type="checkbox"
            onChange
            checked
        >
        </input>
    <label className={1 ? 'complete': ''}>{text}</label>
    <button onClick={onremoveTodo}>&#xd7;</button>
    </li>
}
function Todos(props) {
    const { todos, removeTodo} = props;
    return (
        <ul>
            {
                todos.map(todo => {
                    console.log(todo,'数组中的项')
                    return (<TodoItem
                        key={todo.id}
                        todo={todo}
                        removeTodo={removeTodo}
                        >
                        </TodoItem>)
                })
            }
        </ul>
    )
}


function Control(props) {
    const { addTodo } = props;
    const inputRef = useRef();
    const onSubmit = (e) => {
        e.preventDefault();
        const newText = inputRef.current.value.trim()
        console.log(newText,'输入的值')
        if(newText.length == 0) {return}
        addTodo(newText)
        inputRef.current.value = ''
    }
    return (
        <div className="control">
            <h1>todos DEMO</h1>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    className="new-todo"
                    placeholder="what needs to be done"
                    ref={inputRef}
                >
                </input>
            </form>
        </div>
    )
}

//  bindactioncreator  => dispatch(action)
//  dispatch函数内部中     =>  action(dispatch,state)
let store = {
    todos:[],
    incrementCount:0
}
function TodoList(props) {

    const [todos,setTodos] = useState([])
    //声明dispatch里要用的的状态值，必须在函数组件顶层声明，不许在里面的函数体里声明，会报错
    const [incrementCount,setIncrementCount] = useState(0);
    
    //将本组件的状态值同步到外界全局store变量中
    useEffect(()=> {
        Object.assign(store, {
            todos,
            incrementCount
        })
    })
    const dispatch = (action) => {
        console.log(action,'看看要增加的数据')
        //  @异步改造部分代码
        if ('function' === typeof action) {
            console.log('过来的action是一个函数')
            action(dispatch, store )
            return
        }
       //不是函数的情况，就是个传统action对象
       const newState = reducer(store,action)
       console.log(reducer,newState,'看看reducer拦截后返回的新state值')
       const setters = {
           todos:setTodos,
           incrementCount: setIncrementCount
       }
       for(let key in newState) {
            setters[key](newState[key])
       }

    }
    return (
        <div className="todo-list">
            <h1>代办demo</h1>
            <Control
               {
                   ...bindActionCreators({
                       addTodo: createAdd
                   },dispatch)
               }
            ></Control>
            <Todos todos={todos}
                {
                    ...bindActionCreators({
                        removeTodo: createRemove
                    }, dispatch)
                }
            >
            </Todos>
        </div>
    )
    }

export default TodoList;