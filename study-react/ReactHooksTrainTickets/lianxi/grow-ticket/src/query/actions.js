import {h0} from '../common/fp'
import { ORDER_DEPART, ORDER_DURATION } from './constant'
export const ACTION_SET_FROM =    'SET_FROM'
export const ACTION_SET_TO =    'SET_TO'
export const ACTION_SET_DEPARTDATE =    'SET_DEPARTDATE'
export const ACTION_SET_HIGH_SPEED =    'SET_HIGHSPEED'
export const ACTION_SET_ORDER_TYPE = 'SET_ORDER_TYPE';
export const ACTION_SET_ONLY_TICKETS = 'SET_ONLY_TICKETS';
export const ACTION_SET_IS_FILTERS_VISIBLE = 'SET_IS_FILTERS_VISIBLE'
export const ACTION_SET_TRAINLIST = ''
//bottom组件的浮层用到的action type类型
export const ACTION_SET_TICKET_TYPES = 'SET_TICKET_TYPES';
export const ACTION_SET_CHECKED_TICKET_TYPES = 'SET_CHECKED_TICKET_TYPES';
export const ACTION_SET_TRAIN_TYPES = 'SET_TRAIN_TYPES';
export const ACTION_SET_CHECKED_TRAIN_TYPES = 'SET_CHECKED_TRAIN_TYPES';
export const ACTION_SET_DEPART_STATIONS = 'SET_DEPART_STATIONS';
export const ACTION_SET_CHECKED_DEPART_STATIONS = 'SET_CHECKED_DEPART_STATIONS';
export const ACTION_SET_ARRIVE_STATIONS = 'SET_ARRIVE_STATIONS';
export const ACTION_SET_CHECKED_ARRIVE_STATIONS = 'SET_CHECKED_ARRIVE_STATIONS';
export const ACTION_SET_DEPART_TIME_START = 'SET_DEPART_TIME_START'
export const ACTION_SET_DEPART_TIME_END = 'SET_DEPART_TIME_END'
export const ACTION_SET_ARRIVE_TIME_END = 'SET_ARRIVE_TIME_END'
export const ACTION_SET_ARRIVE_TIME_START = 'SET_ARRIVE_TIME_END'
export function setFrom (from) {
    return {
        type: ACTION_SET_FROM,
        payload: from
    }
}
export function setTo(to) {
    return {
        type: ACTION_SET_TO,
        payload: to
    }
}
export function setDepartDate (departDate) {
    return {
        type: ACTION_SET_DEPARTDATE,
        payload: departDate
    }
}
export function setHighSpeed (highSpeed) {
    return {
        type: ACTION_SET_HIGH_SPEED,
        payload: highSpeed
    }
}
export function setTrainList (trainList) {
    return {
        type:ACTION_SET_TRAINLIST,
        payload: trainList
    }
}

//还要额外的声明两个，来把departDate置为前一天或后一天

export function nextDate() {
    //通过return函数异步actioncreator获取到当前的departdate
    return (dispatch, getState) => {
        console.log('看后一天')
        const { departDate } = getState();
       //departDate是个零时刻的时间戳
        dispatch(setDepartDate(h0(departDate) + 86400 * 1000));
    };
}
export function prevDate() {
    return (dispatch, getState) => {
        const { departDate } = getState();

        dispatch(setDepartDate(h0(departDate) - 86400 * 1000));
    };
}
export function toggleOrderType() {
    return (dispatch,getState) => {
        const {orderType} = getState()
        if(orderType === ORDER_DEPART)
            dispatch({
                type: ACTION_SET_ORDER_TYPE,
                payload: ORDER_DURATION
            })
        else dispatch({
            type: ACTION_SET_ORDER_TYPE,
            payload: ORDER_DEPART
        })
    }
}
export function toggleHighSpeed() {
    return (dispatch,getState) => {
        const {highSpeed} = getState()
        dispatch(setHighSpeed(!highSpeed));
    }
}
export function toggleOnlyTickets() {
    return (dispatch,getState) => {
        const {onlyTickets} = getState()
        dispatch({
            type:ACTION_SET_ONLY_TICKETS,
            payload: !onlyTickets
        })
    }
}
export function toggleIsFiltersVisible() {
    return (dispatch,getState) => {
        const {isFiltersVisible} = getState()
        dispatch({
            type: ACTION_SET_IS_FILTERS_VISIBLE,
            payload: !isFiltersVisible
        })
    }
}
//上面bottom组件综合浮层用到的8个type类型
export function setTicketTypes(ticketTypes) {
    return {
        type: ACTION_SET_TICKET_TYPES,
        payload: ticketTypes
    }
}
export function setCheckedTicketTypes(checkedTicketTypes) {
    return {
        type: ACTION_SET_CHECKED_TICKET_TYPES,
        payload: checkedTicketTypes
    }
}
export function setTrainTypes(trainTypes) {
    console.log(trainTypes,'看看settraintypes过来的值')
    return {
        type:ACTION_SET_TRAIN_TYPES,
        payload: trainTypes
    }
}
export function setCheckedTrainTypes(checkedTrainTypes) {
    return {
        type: ACTION_SET_CHECKED_TRAIN_TYPES,
        payload: checkedTrainTypes
    }
}
export function setDepartStations(departStations) {
    return {
        type:ACTION_SET_DEPART_STATIONS,
        payload:departStations
    }
}
export function setCheckedDepartStations(checkedDepartStations) {
    return {
        type:ACTION_SET_CHECKED_DEPART_STATIONS,
        payload:checkedDepartStations
    }
}
export function setArriveStations(arriveStations) {
    return {
        type:ACTION_SET_ARRIVE_STATIONS,
        payload: arriveStations
    }
}
export function setCheckedArriveStations(checkedArriveStations) {
    return {
        type:ACTION_SET_CHECKED_ARRIVE_STATIONS,
        payload:checkedArriveStations
    }
}
//出发时间的了
export function setDepartTimeStart(departTimeStart) {
    return {
        type:ACTION_SET_DEPART_TIME_START,
        payload: departTimeStart,
    }
}
export function setDepartTimeEnd(departTimeEnd) {
    return {
        type:ACTION_SET_DEPART_TIME_END,
        payload: departTimeEnd
    }
}
export function setArriveTimeEnd(arriveTimeEnd) {
    return {
        type: ACTION_SET_ARRIVE_TIME_END,
        payload: arriveTimeEnd
    }
}
export function setArriveTimeStart(arriveTimeStart) {
    return {
        type: ACTION_SET_ARRIVE_TIME_START,
        payload: arriveTimeStart
    }
}