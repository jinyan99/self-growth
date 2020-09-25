import React, { useState, useRef, useEffect} from 'react';
//引入reducer模块化概念 ：reducer模块化根据各个sttae状态值模块化的，不是根据单个状态值的各种操作type类型模块化的。
/* reducer里面若state值很多，一个reducer函数穿插着对各种数据的更新，一旦state值变多就会很混乱！
    所以我们希望能让每个字段独立接受acrtion，并且计算对应的更新值----所以又引入了reducers拆分的概念。
        一般来说，reducer都比较独立，所以我们把TODOjs文件里reducers拆分相关的代码，提到单独的reducers文件中。在TODOjs文件中只需要引入import reducer from ‘./reducers’;
    reducer的意义在于能够从数据制造的纬度去处理action这样不同的action之间就不会有干扰 */

//引入拆分版本的reducer
import reducer from './reducers';
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