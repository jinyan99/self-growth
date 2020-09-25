import {createStore, combineReducers, applyMiddleware} from 'redux'
import reducers from './reducers'
import thunk from 'redux-thunk'
export default createStore(
    combineReducers(reducers),
    {
        trainNumber: null,
        departStation: null,
        arriveStation: null,
        arriveDate: Date.now(),
        departDate: Date.now(),
        departTimeStr: null,
        arriveTimeStr: null,
        durationStr: null, //行程时间
        searchParsed: false, //标记url参数是否解析完成
        price: null, //票价
        seatType: null,
        passengers: [],//数组里每项包含了每个成员的信息
    },
    applyMiddleware(thunk)
)
//App组件的props中接受的参数和store里全局状态的状态值是一样的，基本是对等的