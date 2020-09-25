
//combinereducer函数专门用于reducer是拆分版本使用的
function combineReducers(reducers) {
    return function reducer(state,action) {
       const changed = {};
        for(let key in reducers) {
            changed[key] = reducers[key](state[key],action)
        }
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
        }
    },
    incrementCount(state,action) {
        const {type} =action;
        switch(type) {
            case 'set':
            case 'add':
                return state+1;
        }
        return state
    }
}
const reducers = combineReducers(reducers);
export default reducers