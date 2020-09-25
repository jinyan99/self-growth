import {createStore,combineReducers, applyMiddleware} from 'redux';
import reducers from './reducer'
import thunk from 'redux-thunk'
export default createStore(
    combineReducers(reducers),
    {
        from: '北京',
        to: '上海',
        isCitySelectorVisible: false,
        currentSelectingLeftCity: false,
        cityData: null,
        isLoadingCityData: false,
        isDateSelectorVisible: false,
        departDate: Date.now(),
        highSpeed: false
    },
    applyMiddleware(thunk)
)
//createStore函数返回的是state对象值集合

//默认reduxstore是只能处理同步数据流的，并没有自动封装
//像之前源码实现异步action那样的dispatch里的判断功能，
//所以在react的redux中可通过thunk中间件实现异步功能，
//是中间件就是加dispatch里分支判断的，负责往里传dispacth参数的，
//和bindActionCreator是两个概念，redux中也封装的bindactioncreator概念。