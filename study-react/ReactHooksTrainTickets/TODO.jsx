import React,{useEffect,useState,useMemo,useRef, useCallback} from 'react'
import {
    createSet,
    createAdd,
    createRemove,
    createToggle
} from './actions' //这是第二种概念，后种写法一直在沿用
import './App.css'
import reducer from './reducers';//引入拆分版本的reducer
//let idSeq = Date.now();

//第三种写法加的概念，用的函数
function bindActionCreators(actionCreators,dispatch) {
    const ret = {};
    for(let key in actionCreators) {
        ret[key] = function(...args) {
            const actionCreator = actionCreators[key];
            const action = actionCreator(...args)
            dispatch(action);
        }
    }
    return ret;
}

const Control = memo(function Control(props) {
    const {dispatch,idSeq,addTodo} = props
    const inputRef = useRef()
    const onSubmit =(e)=>{
        e.preventDefault();
        const newText = inputRef.current.value.trim()
        if(newText.length ===0) {
            return
        }
      /*   dispatch({
            type: 'add',
            payload: {
                id:++idSeq,
                text: newText,
                complete:false
            }
        }) */
       /*  dispatch(createAdd({
            id: ++idSeq,
            text: newText,
            complete: false
        })) */
       /*  addTodo({
            id: ++idSeq,
            text: newText,
            complete: false
        }) */
        addTodo(newText )//@异步改造部分代码，让上版的addTodo处理纯粹点，只负责填个newText值
        inputRef.current.value=''
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
})
const TodoItem = memo(function TodoItem(props) {
    const {todo:{ //对解构出来的todo再次进行解构
        id,
        text,
        complete,
        },
       // dispatch,
        removeTodo,
        toggleTodo
    } = props;
    const onChange = ()=> {
        toggleTodo(id)
   //   dispatch({type: 'toggle',payload: id})   这是第一种dispatch的写法。
        dispatch(createToggle(id))
    }
    const onRemove = () => {
        removeTodo(id)
       // dispatch({type:'remove',payload: id})
       // dispatch(createRemove(id))
    }
    return (
        <li className="todo-item">
            <input
                type="checkbox"
                onChange={onChange}
                checked={complete}>
            </input>
        <label className={complete ? 'complete' : ''}>{text}</label>
        <button onClick={onRemove}>&#xd7;</button>
        </li>
    )
})
const Todos = memo(function Todos(props) {
    const {todos, /*dispatch,*/removeTodo,toggleTodo} = props;

    return <ul>
        {
            todos.map(todo =>{
                return (<TodoItem
                    key={todo.id}
                    todo={todo}
                    /* dispatch={dispatch}*/
                    removeTodo={removeTodo}
                    toggleTodo={toggleTodo}
                >
                </TodoItem>)
            })
        }
    </ul>
})

const LS_KEY = '_$-todos_';

//只要在组件之外创造个store变量，用来存储所有的state
let store = {
    todos:[],
    incrementCount: 0
}//组件创建完后，还得在组件TodoList中同步一下,如何同步呢，用useeffect见下面的@同步部分代码


function TodoList() {
    const [todos,setTodos] = useState([])
   //多增条state 数据
    const [incrementCount, setIncrementCount] = useState(0);

    useEffect(()=> [ //@同步代码
        Object.assign(store, {
            todos,
            incrementCount,
        })
    ],[todos,incrementCount])




    const addTodo = useCallback((todo)=>{
        //这是setstate函数的参数多种写法之写回掉参数，可以写变量等。用这种写能保证往里填数组项不会覆盖之前的数组
        setTodos(todos => [...todos,todo])
    },[]);
    const removeTodo = useCallback((id)=>{
        setTodos(todos => todos.filter(todo => {
            return todo.id !== id
    }))
    },[])

    const toggleTodo = useCallback((id)=>{
    setTodos(todos=> todos.map(todo=>{
        return todo.id ===id
            ? {
                ...todo,
                complete: !todo.complete,
            }
            : todo
    }))
    },[]);
   /*  useEffect(()=> {
        localStorage.setItem(LS_KEY, JSON.stringify(todos))
    },[todos])
    useEffect(()=> {
        const todos = JSON.parse(localStorage.getItem(LS_KEY))
        setTodos(todos);
    },[])  这样写的话每次一刷新，get不到存的值总是拿到默认值[]，把副作用的顺序换一下就好了 
    大家以后对副作用的顺序要稍加注意*/
    //由于dispatch是作为属性传到子组件中的，所以这里我们需要用usecallback包裹起来dispatch



    /* //reducers拆分版本后的函数见引入的reducersjs文件
    //下面是reducer未拆分版本处理，没拆分时对于多个state值action处理就不太好处理得reducer拆分
    function reducer(state, action) {
        const {type,payload} = action
        const {todos,incrementCount} = state;
        switch(type) {
            case 'set':
                return {
                    ...state,
                    todos:payload,
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
    } */
    //引用reducer函数后，dispatch的函数概念就职责简化了，而且dispatch只接受一个总的reducer所以reducers拆分后需要借助combinereudcer解决
    const dispatch = useCallback((action) => {
        // const state={
        //     todos,
        //     incrementCount
        // }
        const setters = {
            todos: setTodos,
            incrementCount:setIncrementCount
        }
        //  @异步改造部分代码
        if ('function' === typeof action) {
            action(dispatch,/*state 由于store的加入改成*/ ()=>store )
            //由于是异步的action，所以在异步回掉之后我们还是只能访问到上次渲染周期的state数据，这是没意义的因此用的函数参数来获取当前最新的state。---就是action2参为一个回掉函数
            //由于在组件上下文中我们无法在过去的渲染周期中获取到异步数据获取组件当前最新的state，所以我们只好把全部的state数据同步到组件上下文之外
            //也就是上面的128行store对象---也就是store的诞生
            return
        }
        const newState = reducer( store ,action)
        //reducer的1参改成store后，218的state就没用了可以注视了，依赖可以删了，usecallback也可以删了
        for(let key in newState) {
            setters[key](newState[key])
        }
    },/*[todos,incrementCount]*/)

    /*    //这是引入reducer之前的用的dispatch函数
     const dispatch = useCallback((action) => {
        const {type,payload} = action;
        switch (type) {
            case 'set':
                setTodos(payload);
                setIncrementCount(c=>c+1);
                break;
            case 'add':
                setTodos(todos => [...todos,payload])
                setIncrementCount(c=>c+1)
                break;
            case 'remove':
                setTodos(todos => todos.filter(todo => {
                    return todo.id !== payload
                }))
                break;
            case 'toggle':
                setTodos(todos=> todos.map(todo=>{
                    return todo.id ===payload
                        ? {
                            ...todo,
                            complete: !todo.complete,
                        }
                        : todo
                }))
                break;
            default:
        }
    },[])//除了settodos，我们没有对任何变量进行依赖，所以第二个参数是空数组 */
    useEffect(()=> {
        const todos = JSON.parse(localStorage.getItem(LS_KEY))
       // setTodos(todos);
      // dispatch({type: 'set', payload: todos})
        dispatch(createSet(todos));
    },[])
    useEffect(()=> {
        localStorage.setItem(LS_KEY, JSON.stringify(todos))
    },[todos])


    return (
    <div className="todo-list">
       {/*  <Control dispatch={dispatch}/> */}
       <Control
            {
                ...bindActionCreators({
                    addTodo: createAdd
                }, dispatch)
            }
       >

       </Control>
        <Todos dispatch={dispatch} /* toggleTodo={toggleTodo} */ todos={todos}></Todos>
       <Todos
       {
           ...bindActionCreators({
               removeTodo: createRemove
           },dispatch)
       }>
       </Todos>
    </div>
)}
export default TodoList;