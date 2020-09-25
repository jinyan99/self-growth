import { createStore, combineReducers, applyMiddleware } from 'redux';

import reducers from './reducers';
import thunk from 'redux-thunk';

export default createStore(
    combineReducers(reducers),
    {
        departDate: Date.now(),//出发日期的初始值，，，出发日期是客户端用户点出来的，从url中获取
        arriveDate: Date.now(), //到达日期的默认值，与出发日期的不同的是，到达日期是从后段接口中获取的。
        departTimeStr: null,//小时分都从后段获取
        arriveTimeStr: null,//小时分都从后段获取
        departStation: null,//出发车展获取
        arriveStation: null,//到达车站从ur中获取
        trainNumber: null,//车次号
        durationStr: null,//运行时间必须从后段获取
        tickets: [], //出票渠道，应该来自与后段接口
        isScheduleVisible: false,//时刻表浮层应该有 状态决定
        searchParsed: false, //这个变成true以后，我们才能进行异步数据请求
    },
    applyMiddleware(thunk)
);
