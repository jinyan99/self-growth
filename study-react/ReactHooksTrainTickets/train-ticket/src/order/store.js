import { createStore, combineReducers, applyMiddleware } from 'redux';

import reducers from './reducers';
import thunk from 'redux-thunk';

export default createStore(
    combineReducers(reducers),
    {
        trainNumber: null, //车次
        departStation: null, //出发车站
        arriveStation: null, //到达车站
        seatType: null, //座席类型
        departDate: Date.now(), //出发日期
        arriveDate: Date.now(), //到达日期
        departTimeStr: null, //出发时间字符串表示
        arriveTimeStr: null, //到达时间字符串表示
        durationStr: null, //形程时间
        price: null, //票价
        passengers: [], //每个成员包含了乘客的选中信息
        menu: null, //弹出的菜单的数据结构还不知道，暂且设为null
        isMenuVisible: false, //菜单是否可见
        searchParsed: false, //标记url参数是否解析完成
    },
    applyMiddleware(thunk)
);
