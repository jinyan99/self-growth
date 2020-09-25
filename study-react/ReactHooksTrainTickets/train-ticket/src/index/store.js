import { createStore, combineReducers, applyMiddleware } from 'redux';

import reducers from './reducers';
//这个专门用来支持异步action的
import thunk from 'redux-thunk';

export default createStore(
    //createStore的第二个参数是传的state的默认值对象，可以传可不穿
    combineReducers(reducers),
    {//store文件中在这2个参数的位置，可以写初始state值的设计，提前规定好下面的字段都要起什么作用。
        from: '北京',
        to: '上海',
        isCitySelectorVisible: false, //城市浮层的字段开关
        currentSelectingLeftCity: false,
        cityData: null, //异步按需加载的city数据，也是全局性多页面用到的，所以不能写成组件内部的
        isLoadingCityData: false,//城市数据加载中的状态是否正在加载城市数据，后面做些节流操作用到的
        isDateSelectorVisible: false,//日期选择浮层的开关字段
        departDate: Date.now(),
        highSpeed: false, //是否选择了高铁动车状态开关
    },
    applyMiddleware(thunk)
);
