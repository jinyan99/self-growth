import React, { useState, useRef } from 'react';

// 给雏形状态容器加了actioncreator与dsipatch的概念，新加了actionsjs文件

import {
    createAdd,
    createSet,
    createToggle
} from './actions.js';



let idSeq = Date.now();
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
    console.log(',.,.,.,.,.,，。，。。')
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
    const {dispatch} = props;
    const inputRef = useRef();
    const onSubmit = (e) => {
        e.preventDefault();
        const newText = inputRef.current.value.trim()
        console.log(newText,'输入的值')
        if(newText.length == 0) {return}
        //createAdd函数只是生成action对象的，还需要dispatch发出去
        dispatch(createAdd({
            id: ++idSeq,
            text: newText,
            complete: false
        }))
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

function TodoList(props) {

    const [todos,setTodos] = useState([])
    const dispatch = (action) => {
        const {type, payload} = action;
        //对应这不同的type值，payload值也是不同的。对于set，payload是一个完整的todos数组
        //对于add，payload是一个新的todo对象。对于remove和toggle，payload就是一个todo对象的id。
        //后面把这个switch抽离出去去掉setTodos的职责，剩下的单一性仅返回新state值，就是reducer。单独抽出处理action返回要更新state值，再由setTodos调用，这样就是为了让拦截处理action处理数据更纯粹，单一性原则
        switch (type) {
            case 'set':
                setTodos(payload);
                break;
            case 'add':
                setTodos(todos => [...todos,payload] );
                break;
            case 'remove':
                break;
            case 'toggle':
                break;
            default:
        }
    }
    return (
        <div className="todo-list">
            <h1>代办demo</h1>
            <Control
                dispatch={dispatch}
            ></Control>
            <Todos todos={todos}></Todos>
        </div>
    )
}
export default TodoList;