//这文件里面是个actioncreator概念的文件，
//这版要加入的是 异步Action的概念，通过setTimeout模拟实现异步
//场景：当有同样数值时拒绝添加的条件下，当你todo列表已经有123值了存到本地存储里的
//已经有123值了，当你再添加123时同时快速把已有的123给删了，期望情况应该是新的123能添加进去
//   但实际上他添加不进去，因为在下面17行做判断的时候，还是以当时删之前的state值做比较判断的
//   没拿到最新的state值，还会误以为本地已存在相同的值拒绝添加，导致与期望情况相反，新123也没添加进去
//   这时区别主要在16行函数中的接受的state写成接受的函数形式，在3秒后执行回掉能拿到最新值。
export function createSet(payload) {
    return {
        type:'set',
        payload
    }
}
export function createRemove(payload) {
    return {
        type:'remove',
        payload
    }
}
let idSeq = Date.now();
export function createAdd(text) {
    console.log(text,'输入的值-actions里');
    return (dispatch, state) => { 
        //这2个参数，state是用来查询现有的state数据。dispatch用来查询之后发起真正的action请求
        console.log(state,'3秒前的拿的state')
        setTimeout(()=>{
        console.log('3秒后异步actio的',state);
         const {todos} = state;
                if(!todos.find(todo=> todo.text === text)) {
                    dispatch({
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
        type:'toggle',
        payload
    }
}