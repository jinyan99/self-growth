//combinereducer函数专门用于reducer是拆分版本使用的

//引入reducer模块化概念 ：reducer模块化根据各个sttae状态值模块化的，不是根据单个状态值的各种操作type类型模块化的。
//          所以下面对象每个key值是对应的state值，value是一套reducer函数列举各种可能的操作类型的函数


//就相当于redux中combinereducer的源码啦，接受一个对象所有reducer函数的集合对象。
function combineReducers(reducers) {
    //就是把接受过来的对象(清晰地含所有reducer模块函数，拿进来整合到常规的一个总reducer进去)
    //最后抛出总reducer(拦截作用)函数，这个总reducer函数返回的还是个newstate对象值，返回给dispatch继续更新用。
    return function reducer(state,action) {
       const changed = {};
        for(let key in reducers) {
            changed[key] = reducers[key](state[key],action)
        }
        //这个总的reducer函数负责接受遍历reducers对象所有reducer，整合到一个对象里，反出去由dispatch函数逻辑使用
        return {
            ...state,
            ...changed,
        }
    }
}


const reducers = {//作用就是让对应的sttae值都只代表对应的todos值或increment值，而不是下面之前版本reducer函数里的state代表所有值
    todos(state, action) {//里的state值
        const {type,payload} = action;
        switch(type) {
            case 'set':
                return {
                    todos:payload,
                }
            case 'add':
                return  [
                  ...state,payload
                ]
            case 'remove':
                return state.filter(todo => {
                        return todo.id !== payload
                    })
            case 'toggle':
                return state.map(todo=>{
                        return todo.id ===payload
                            ? {
                                ...todo,
                                complete: !todo.complete,
                            }
                            : todo
                    })
            default:
        }
    },
    incrementCount(state,action) {
        const {type} =action;
        console.log('执行increment了符合下面的add项',action)
        //即todos里的一条action，type为add的话，也会触发这个state值增加数量的更新
        switch(type) {
            case 'set':
            case 'add':
                return state+1;
            default:;
        }        return state
    }
}
const reducers1 = combineReducers(reducers);
//上面是返回的总的一个reducer函数
export default reducers1;