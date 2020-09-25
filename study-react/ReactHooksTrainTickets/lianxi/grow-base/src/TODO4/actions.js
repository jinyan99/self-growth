//这文件里面是个actioncreator概念的文件，
//这版要加入store概念和reducer概念
export function createSet(payload) {
    return {
        type:'set',
        payload
    }
}
let idSeq = Date.now();
export function createAdd(text) {
    console.log(text,'要改的state值')
    return  {
                    type: 'add',
                    payload:{
                        id: ++idSeq,
                        text,
                        compolete: false}
                }
}
/*  这版是融进dispatch版本的，和3版的不一样，这是接受的getState回掉作为参数，异步取数据时保证获取到最新的state值
export function createAdd(text) {
    return (dispatch,getState) => {
        setTimeout(()=>{
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
} */
export function createToggle(payload) {
    return {
        type:'toggle',
        payload
    }
}
export function createRemove(payload) {
    return {
        type:'remove',
        payload
    }
}