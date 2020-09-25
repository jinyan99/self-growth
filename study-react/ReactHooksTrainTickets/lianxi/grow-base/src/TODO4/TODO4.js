import React, { useState, useRef, useEffect} from 'react';
//加入reducer与store概念

//reducer就是一个拦截器，在dispatch肚子里触发使用的拦截器，
//触发后返回对象，继续由dispatch函数剩余逻辑使用---思想就是为了更纯粹，单一性纯粹性透明集中化思想。
//单独抽出处理action返回要更新state值，再由setTodos方法更新函数调用，这样就是为了让拦截器处理action处理数据更纯粹，单一性原则，
//把2版文件的switch与set更新方法拆开了，让数据处理更纯粹，职责分明简化单一性原则。

//由于在组件上下文中我们无法在过去的渲染周期中获取到异步数据获取组件当前最新的state，所以我们只好把全部的state数据同步到组件上下文之外
//也就是下面的88行store对象，就是把单个主组件TODOList里的状态值抽离出组件上下文之外，把状态值变成全局性的不会因主组件渲染重置的一组状态值
//---也就是store的诞生
    /* 顶层建的store对象存的所有初始化状态值变量数据，一开始是空的，还得在主组件中把state数据同步到外界store变量值中
     */
import {
    createAdd,
    createSet,
    createToggle
} from './actions.js';

  //新加的bindactioncreators概念函数写完后，传给控制层组件Control用的
function bindActionCreators(actionCreators,dispatch) {
   //这时传进来的1参是个对象，{addTodo: createAdd(这个函数返回的还是个函数) }
    const ret = {};
    for(let key in actionCreators) {
        ret[key] = function(...args) {
            const actionCreator = actionCreators[key];
            const action = actionCreator(...args);
            dispatch(action)
        }
    }
    return ret;
}

//某一行项数据，最小粒度化组件
function TodoItem(props) {
    const {todo} = props;
    return <li className="todo-item">
        <input
            type="checkbox"
            onChange
            checked
        >
        </input>
    <label className={1 ? 'complete': ''}>{todo}</label>
    <button onClick>&#xd7;</button>
    </li>
}
function Todos(props) {
    const { todos } = props;
    return (
        <ul>
            {
                todos.map(todo => {
                    console.log(todo,'数组中的项')
                    return (<TodoItem
                        todo={todo.text}
                        key
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
         const state = {
          todos,
       }
        console.log(action,'看看要增加的数据')
        //  @异步改造部分代码
        if ('function' === typeof action) {
            console.log('actioncreator是一个函数')
            //得到传过来的函数，将这个函数再传disoatch参和store数据执行调用下，把dispatch作为参数传进去
            //记住这种用法，函数里能直接调用自己的函数名
            action(dispatch, state )
            return
        }
        console.log(action,'不是函数的情况，就是个传统action对象')
       const newState = reducer(store,action)
       console.log(newState.todos,'看看把')
       //是一个state数据的话，可以简单这样写，若有多个状态值，总不能依次setState吧
       //setTodos(newState.todos)   所以建个setters对象，可以自动遍历更新数据。setters就是多个setState方法集合叫复数形式
       const setters = { //这是针对多个状态值必须要产生的setters对象
           todos:setTodos,
           incrementCount: setIncrementCount
       }
       for(let key in newState) {
            setters[key](newState[key])
       }

    }
    //增加的reducer概念(原本state值和提交的奏折)reducer比上版优点就是也是在dispatch逻辑中触发这个reducer，
    //reducer作为拦截器作用，把所有要更新的数据
    //都会拦截到一块，哪个action要做什么一目了然，拦截好后做些处理，再反出去(要更新的)新st
    //ate值(这个是总state值可以全面覆盖之前总state的。所以总state也是个对象，各个state值名字作为对象的key，
    //对应value为要换成的对应新state值)，再反给dispatch接着由dispatch逻辑操作更新数据
    function reducer(state, action) {
        const {type,payload} = action
        const {todos} = state;
        console.log(todos,'看看')
        switch(type) {
            case 'set':
                return {
                    ...state,
                    todos:payload,//记住这种用法，会把state里的todos属性给覆盖了
                }
            case 'add':
                return {
                    ...state,
                    todos: [...todos,payload],
                }
            case 'remove':
                return {
                    ...state,
                    todos: todos.filter(todo => {
                        return todo.id !== payload
                    }),
                }
            case 'toggle':
                return {
                    ...state,
                    todos: todos.map(todo=>{
                        return todo.id ===payload
                            ? {
                                ...todo,
                                complete: !todo.complete,
                            }
                            : todo
                    })
                }
            default:
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
            <Todos todos={todos}></Todos>
        </div>
    )
    }

export default TodoList;