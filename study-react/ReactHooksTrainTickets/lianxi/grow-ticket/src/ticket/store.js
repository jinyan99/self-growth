import {createStore, combineReducers, applyMiddleware} from 'redux'
import reducers from './reducers'
import thunk from 'redux-thunk'

export default createStore(
    combineReducers(reducers),
    {
        departDate: Date.now(),//出发日期，月天那种
        arriveDate: Date.now(),
        departTimeStr: null, //出发时间，时间戳那种
        arriveTimeStr: null,
        departStation: null,
        arriveStation: null,
        trainNumber: null, //车次号
        durationStr: '9:00', //运行时间必须从后段获取
        tickets: [],
        isScheduleVisible: false,//时刻表浮层由状态开关值确定
        searchParsed: false, //代表url解析完毕，可以进行异步数据请求了
    },
    applyMiddleware(thunk)
)