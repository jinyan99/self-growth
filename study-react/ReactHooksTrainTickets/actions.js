//actioncreator就是个普通的函数
//它的唯一用处就是简化每次都写type对象的分散现象，都作为disptach的参数统一处理
//=这个文件也可以进一步封装成  把dispatch也加进这个actionCretor函数概念中来
 //如 addTodo = (payload) => {dispatch(payload)}   这个实现叫bindActionCreators函数可以写在TODOjs文件中。
export function createSet(payload) {
    return {
        type:'set',
        payload,
    }
}
let idSeq = Date.now();
export function createAdd(/*payload 改成*/ text) {
    /* return {
        type: 'add',
        payload
    } */
    return (dispatch, /*state*/getState) => {
        setTimeout(()=>{
        //const {todos} = state;
        //这个异步action在发起的时候，state已经进行不可变了，我们必须获取最新的state，可以把state改写成回掉的形式getState
        //通过getState获取到最新的state的todos. 这里改完后，TODO文件的dispatch里也得对应修改
        const {todos} = getState();
                if(!todos.find(todo=> todo.text === payload.text)) {
                    dispatch({//写上这个异步拦截后，启动项目，添加相同数据后会拒绝disptach更新的
                        type: 'add',
                        payload: {
                            id: ++idSeq,
                            text,
                            compolete: false
                        },
                    })
                }
        },3000)

    }
}
export function createToggle(payload) {
    return {
        type: 'toggle',
        payload
    }
}
export function createRemove(payload) {
    return {
        type:'remove',
        payload
    }
}