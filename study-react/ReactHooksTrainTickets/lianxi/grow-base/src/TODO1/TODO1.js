import React, { useState, useRef } from 'react';

//redux之前的雏形：是最笨的存储状态容器 的实现---把一些状态值存到组件内部的state里

//缺点：这种addtodos往状态容器里更新数据，就特别分散，具体到每个组件发生的事件，没办法总体性描述对todos进行了各自怎样的工作。
//    必须透明集中化思想：引入action与中心节点函数dispatch的概念，复杂度相似度相同的操作集中在一个文件里，统一由外界多方面调用

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
    const {addTodo} = props;
    const inputRef = useRef();
    const onSubmit = (e) => {
        e.preventDefault();
        const newText = inputRef.current.value.trim()
        console.log(newText,'输入的值')
        if(newText.length == 0) {return}
        addTodo({
            id: ++idSeq,
            text: newText,
            complete: false
        })
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
    const addTodo = (todo)=> {
        console.log(todo,'接受到todo值')
        //这是setstate函数的参数多种写法之写回掉参数，可以写变量等。用这种写能保证往里填数组项不会覆盖之前的数组
        setTodos(todos => [...todos,todo])
    }
   
    return (
        <div className="todo-list">
            <h1>代办demo</h1>
            <Control
                addTodo={addTodo}
            ></Control>
            <Todos todos={todos}></Todos>
        </div>
    )
}
export default TodoList;