import { createStore, combineReducers, applyMiddleware } from 'redux';

import reducers from './reducers';
import thunk from 'redux-thunk';

import { h0 } from '../common/fp';
import { ORDER_DEPART } from './constant';

export default createStore(
    combineReducers(reducers),
    {
        from: null,
        to: null,
        departDate: h0(Date.now()),//当前时刻
        highSpeed: false,//能从url中获取的参数，是否选择了高铁动车----上面这4个字段就已经能涵盖header和日期导航了
//list组件的列表数据状态容器
        trainList: [],
//bottom组件的前两个按钮用到的全局store数据
        orderType: ORDER_DEPART,//车次的排序类型用于在bottom组件用到的，它应该是个枚举值，怎么定义枚举呢，用常量定义,用1代表出发站类型，用2常量代表耗时排序
        onlyTickets: false,//bottom组件里只看有票的的状态控制
  //下面的tickettypes和trainTypes和departStations和arriveStation四个基础数据都是bottom组件综合浮层里bottom-modal组件需要用到的数据
        ticketTypes: [],//bottom组件里用到的浮层里的基础数据，可以store中透传下去，这属于基础数据，可以store统一管理，选中项不能在store里
        checkedTicketTypes: {},//store中存的上行的用户选中的项，用对象来表示便于查询，都是需要存在全局状态容器里的。只不过在综合浮层里需要把选中的数据做层缓存处理再拦截提交
        trainTypes: [], //所有车次类型
        checkedTrainTypes: {},//选中的车次类型
        departStations: [],//出发车站
        checkedDepartStations: {},//选中的出发车展
        arriveStations: [],//到达车站
        checkedArriveStations: {},//选中的到达车站
//下面是bottom组件里浮层里的时间滑块的4个时间值
        departTimeStart: 0, //出发时间一天24小时值
        departTimeEnd: 24,//出发时间截止
        arriveTimeStart: 0,//到达时间
        arriveTimeEnd: 24,//到达时间截止
//开关状态显示的
       isFiltersVisible: false,//筛选浮层的显示隐藏
        searchParsed: false,//程序一启动必须立刻解析浏览器的地址栏参数，上面前4个参数是用来向服务端查寻必要数据
        //的比如车次列表筛选浮层的各种备选项，我们只能解析后进行副作用发起请求，所以要有个变量，来标示此刻是已经解析完成参数了可以发起请求
        //况且在解析完成之前，显示任何东西都是没有意义的(因为我们要在后面副作用使用它)
    },
    applyMiddleware(thunk)
);
