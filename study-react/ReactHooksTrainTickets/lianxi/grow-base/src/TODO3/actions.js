//这文件里面是个actioncreator概念的文件，
//这版是只把actions抽离出文件，dispatch参数也抽离进来了，不是dispatch定义的函数代码 抽进来是这个参数抽进来了
//，和action写在一起了，。。dispatch定义还是得在主文件中声明这个基本函数。
//这时叫真正的actioncreater概念文件----因为这时dispatch容纳了 actioncreator return出action对象和函数的形式都可以接受。。

export function createSet(payload) {
    return {
        type:'set',
        payload
    }
}
let idSeq = Date.now();
export function createAdd(text) {
    console.log(text,'要改的state值')
    //通过在原本只负责反action对象的函数中return个回调函数(形参为dispatch的)，来融进dispatch
    return (dispatch,state) => {
        const {todos} = state;//得到state是个对象
        console.log(todos,'hahahah叫啊叫')
        if(!todos.find(todo=> todo.text === text)) {
            dispatch({//添加相同数据后会拒绝disptach更新的
                type: 'add',
                payload: {
                    id: ++idSeq,
                    text,
                    compolete: false
                },
            })
        }
    }
}
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