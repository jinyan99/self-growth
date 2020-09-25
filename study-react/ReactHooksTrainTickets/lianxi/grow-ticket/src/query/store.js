import {createStore,combineReducers,applyMiddleware} from 'redux'
import reducers from './reducers'
import thunk from 'redux-thunk'
import {h0} from '../common/fp'
import { ORDER_DEPART } from './constant'

export default createStore(
    combineReducers(reducers),
    {
        from: '北京',
        to: '上海',
        departDate:h0(Date.now()),
        highSpeed: false,//上页传过来的数据，这都得加到store字段里
        trainList: [],
        orderType: ORDER_DEPART, //bottom组件用到的
        onlyTickets: false,
        ticketTypes:[],//bottom组件里用到的浮层里的基础数据，可以store中透传下去
        checkedTicketTypes: {},
        trainTypes:[],
        checkedTrainTypes:{},
        departStations: [],
        checkedDepartStations: {},
        arriveStations:[],
        checkedArriveStations: {},
        //4个时间滑块用到的初始state值
        departTimeStart:0,
        departTimeEnd: 24,
        arriveTimeStart:0,
        arriveTimeEnd:24
        //
    },
    applyMiddleware(thunk)
)