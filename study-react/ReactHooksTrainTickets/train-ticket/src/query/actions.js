import { ORDER_DURATION, ORDER_DEPART } from './constant';

import { h0 } from '../common/fp';

export const ACTION_SET_FROM = 'SET_FROM';
export const ACTION_SET_TO = 'SET_TO';
export const ACTION_SET_DEPART_DATE = 'SET_DEPART_DATE';
export const ACTION_SET_HIGH_SPEED = 'SET_HIGH_SPEED';
export const ACTION_SET_TRAIN_LIST = 'SET_TRAIN_LIST';
export const ACTION_SET_ORDER_TYPE = 'SET_ORDER_TYPE';
export const ACTION_SET_ONLY_TICKETS = 'SET_ONLY_TICKETS';
export const ACTION_SET_TICKET_TYPES = 'SET_TICKET_TYPES';
export const ACTION_SET_CHECKED_TICKET_TYPES = 'SET_CHECKED_TICKET_TYPES';
export const ACTION_SET_TRAIN_TYPES = 'SET_TRAIN_TYPES';
export const ACTION_SET_CHECKED_TRAIN_TYPES = 'SET_CHECKED_TRAIN_TYPES';
export const ACTION_SET_DEPART_STATIONS = 'SET_DEPART_STATIONS';
export const ACTION_SET_CHECKED_DEPART_STATIONS = 'SET_CHECKED_DEPART_STATIONS';
export const ACTION_SET_ARRIVE_STATIONS = 'SET_ARRIVE_STATIONS';
export const ACTION_SET_CHECKED_ARRIVE_STATIONS = 'SET_CHECKED_ARRIVE_STATIONS';
export const ACTION_SET_DEPART_TIME_START = 'SET_DEPART_TIME_START';
export const ACTION_SET_DEPART_TIME_END = 'SET_DEPART_TIME_END';
export const ACTION_SET_ARRIVE_TIME_START = 'SET_ARRIVE_TIME_START';
export const ACTION_SET_ARRIVE_TIME_END = 'SET_ARRIVE_TIME_END';
export const ACTION_SET_IS_FILTERS_VISIBLE = 'SET_IS_FILTERS_VISIBLE';
export const ACTION_SET_SEARCH_PARSED = 'SET_SEARCH_PARSED';

export function setFrom(from) {
    return {
        type: ACTION_SET_FROM,
        payload: from,
    };
}
export function setTo(to) {
    return {
        type: ACTION_SET_TO,
        payload: to,
    };
}
export function setDepartDate(departDate) {
    return {
        type: ACTION_SET_DEPART_DATE,
        payload: departDate,
    };
}
//除了在下面的筛选按钮切换之外。在页面的初始化中我们也需要直接进行set的，，所以这里保留set，复制个新的toggle开头的。
export function setHighSpeed(highSpeed) {
    return {
        type: ACTION_SET_HIGH_SPEED,
        payload: highSpeed,
    };
}
//这也是个可切换的值，也要异步actioncrretaor的，return出的函数
export function toggleHighSpeed() {//也是不需要参数的
    return (dispatch, getState) => {
        const { highSpeed } = getState();

        dispatch(setHighSpeed(!highSpeed));
    };
}
export function setTrainList(trainList) {
    return {
        type: ACTION_SET_TRAIN_LIST,
        payload: trainList,
    };
}
//这是个开关型的，就不适合用set前缀了
export function toggleOrderType() {
    //由于异步获取的，所以用return回掉函数
    return (dispatch, getState) => {
        const { orderType } = getState();
        if (orderType === ORDER_DEPART) {
            dispatch({
                type: ACTION_SET_ORDER_TYPE,
                payload: ORDER_DURATION,
            });
        } else {
            dispatch({
                type: ACTION_SET_ORDER_TYPE,
                payload: ORDER_DEPART,
            });
        }
    };
}
//不用set直接改写成toggle
export function toggleOnlyTickets() {
    //切换状态都有可能在异步环境下，所以都写成函数形式的，getState来获取最新值
    return (dispatch, getState) => {
        const { onlyTickets } = getState();

        dispatch({
            type: ACTION_SET_ONLY_TICKETS,
            payload: !onlyTickets,
        });
    };
}
export function setTicketTypes(ticketTypes) {
    return {
        type: ACTION_SET_TICKET_TYPES,
        payload: ticketTypes,
    };
}
export function setCheckedTicketTypes(checkedTicketTypes) {
    return {
        type: ACTION_SET_CHECKED_TICKET_TYPES,
        payload: checkedTicketTypes,
    };
}
export function setTrainTypes(trainTypes) {
    return {
        type: ACTION_SET_TRAIN_TYPES,
        payload: trainTypes,
    };
}
export function setCheckedTrainTypes(checkedTrainTypes) {
    return {
        type: ACTION_SET_CHECKED_TRAIN_TYPES,
        payload: checkedTrainTypes,
    };
}
export function setDepartStations(departStations) {
    return {
        type: ACTION_SET_DEPART_STATIONS,
        payload: departStations,
    };
}
export function setCheckedDepartStations(checkedDepartStations) {
    return {
        type: ACTION_SET_CHECKED_DEPART_STATIONS,
        payload: checkedDepartStations,
    };
}
export function setArriveStations(arriveStations) {
    return {
        type: ACTION_SET_ARRIVE_STATIONS,
        payload: arriveStations,
    };
}
export function setCheckedArriveStations(checkedArriveStations) {
    return {
        type: ACTION_SET_CHECKED_ARRIVE_STATIONS,
        payload: checkedArriveStations,
    };
}
//浮层里时间滑块相关的的actionCreator
export function setDepartTimeStart(departTimeStart) {
    return {
        type: ACTION_SET_DEPART_TIME_START,
        payload: departTimeStart,
    };
}
export function setDepartTimeEnd(departTimeEnd) {
    return {
        type: ACTION_SET_DEPART_TIME_END,
        payload: departTimeEnd,
    };
}
export function setArriveTimeStart(arriveTimeStart) {
    return {
        type: ACTION_SET_ARRIVE_TIME_START,
        payload: arriveTimeStart,
    };
}
export function setArriveTimeEnd(arriveTimeEnd) {
    return {
        type: ACTION_SET_ARRIVE_TIME_END,
        payload: arriveTimeEnd,
    };
}
//也是boor值的处理
export function toggleIsFiltersVisible() {
    return (dispatch, getState) => {
        const { isFiltersVisible } = getState();

        dispatch({
            type: ACTION_SET_IS_FILTERS_VISIBLE,
            payload: !isFiltersVisible,
        });
    };
}
export function setSearchParsed(searchParsed) {
    return {
        type: ACTION_SET_SEARCH_PARSED,
        payload: searchParsed,
    };
}


//还要额外的声明两个，来把departDate置为前一天或后一天

export function nextDate() {
    //通过return函数异步actioncreator获取到当前的departdate
    return (dispatch, getState) => {
        const { departDate } = getState();
       //departDate是个零时刻的时间戳
       //牢记一天是86400秒，  就是加一天的毫秒数，作为departdate
        dispatch(setDepartDate(h0(departDate) + 86400 * 1000));
    };
}
export function prevDate() {
    return (dispatch, getState) => {
        const { departDate } = getState();

        dispatch(setDepartDate(h0(departDate) - 86400 * 1000));
    };
}
