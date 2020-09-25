import {
    ACTION_SET_FROM,
    ACTION_SET_TO,
    ACTION_SET_HIGH_SPEED,
    ACTION_SET_DEPARTDATE,
    ACTION_SET_TRAINLIST,
    ACTION_SET_ORDER_TYPE,
    ACTION_SET_ONLY_TICKETS,
    ACTION_SET_IS_FILTERS_VISIBLE,
    ACTION_SET_TICKET_TYPES,
    ACTION_SET_CHECKED_TICKET_TYPES,
    ACTION_SET_TRAIN_TYPES,
    ACTION_SET_CHECKED_TRAIN_TYPES,
    ACTION_SET_DEPART_STATIONS,
    ACTION_SET_CHECKED_DEPART_STATIONS,
    ACTION_SET_ARRIVE_STATIONS,
    ACTION_SET_CHECKED_ARRIVE_STATIONS,
    ACTION_SET_DEPART_TIME_START,
    ACTION_SET_DEPART_TIME_END,
    ACTION_SET_ARRIVE_TIME_END,
    ACTION_SET_ARRIVE_TIME_START,

} from './actions';
 //每个派发次action尽管不是这个，都会执行这里面所有reducer，只不过不匹配返回的是return state逻辑
export default {
    from(state=null,action){
        const {type,payload} = action
        switch(type) {
            case ACTION_SET_FROM:
                return payload
            default:;

        }
        return state
    },
    to(state=null,action) {
        const {type,payload} = action
        switch (type) {
            case ACTION_SET_TO:
                return payload;
            default:
        }
        return state
    },
    departDate(state = Date.now(), action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_DEPARTDATE:
                return payload;
            default:
        }

        return state;
    },
    //这个也是数据联动，新加的这个checkedtraintypes case项，就是相互同步数据联动
    highSpeed(state = false, action) {
        const { type, payload } = action;
        let checkedTrainTypes;
        console.log('ka看看高铁动车',action)
        switch (type) {
            case ACTION_SET_HIGH_SPEED:
                return payload;
            case ACTION_SET_CHECKED_TRAIN_TYPES:
                //触发这个得是筛选浮层，同时勾选高铁和动车，点击确定后才会联动触发底层action，不点确定的话还只能触发缓冲区里的useReducer值
                console.log('看看traintype项联动的highspeed值',action)
                checkedTrainTypes = payload;//这种情况下payload代表的是新的checkedTrainTypes
                return Boolean(checkedTrainTypes[1] && checkedTrainTypes[5]);
            default:
        }
        return state;
    },
    trainList(state=[],action) {
        const {type,payload} = action;
        switch (type) {
            case ACTION_SET_TRAINLIST:
                return payload;
            default:
        }
        return state
    },
    orderType(state=[],action) {
        const {type,payload} = action;
        switch(type) {
            case ACTION_SET_ORDER_TYPE:
                return payload;
            default:
        }
        return state
    },
    onlyTickets(state=false,action) {
        const {type,payload} = action
        switch(type) {
            case ACTION_SET_ONLY_TICKETS:
                return payload;
            default:
        }
        return state
    },
    isFiltersVisible(state=false,action) {
        const {type,payload} = action
        switch(type) {
            case ACTION_SET_IS_FILTERS_VISIBLE:
                return payload;
            default:
        }
        return state
    },
    ticketTypes(state=[],action) {
        const {type,payload} = action
        switch(type) {
            case ACTION_SET_TICKET_TYPES:
                return payload;
            default:
        }
        return state
    },
    checkedTicketTypes(state={},action) {
        console.log(action,'看看reducer过来的选中坐席类型数据')
        const {type,payload} = action
        switch(type) {
            case ACTION_SET_CHECKED_TICKET_TYPES:
                return payload;
            default:
        }
        return state
    },
    trainTypes(state=[],action) {
        const {type,payload} = action
        switch (type) {
            case ACTION_SET_TRAIN_TYPES:
                return payload
            default:
        }
        return state
    },
    //数据联动
//因为每个action都会流经reducer，所以我们在checkedTrainTypes函数里可以捕获到
//bool值的更新行为 ，如加个ACTION_SET_HIGH_SPEED项就这样可以捕获到对high-speed的更新
    checkedTrainTypes(state={}, action) {
        //数据联动更新
        const {type,payload} = action
        let highSpeed,
            newCheckedTrainTypes;
        switch(type) {
            case ACTION_SET_CHECKED_TRAIN_TYPES:
                return payload;
            //新加的这项就是数据联动效果
            case ACTION_SET_HIGH_SPEED:
                highSpeed = payload;
                newCheckedTrainTypes = {...state}
                console.log(newCheckedTrainTypes,'看选中的traintypes项')
                if(highSpeed) {
                    newCheckedTrainTypes[1] = true
                    newCheckedTrainTypes[5] = true
                } else {
                    delete newCheckedTrainTypes[1]
                    delete newCheckedTrainTypes[5]
                }
                return newCheckedTrainTypes ;
            default:
        }
        return state
    },
    departStations(state=[],action) {
        const {type,payload} = action;
        switch (type) {
            case ACTION_SET_DEPART_STATIONS:
                return payload;
            default:
        }
        return state
    },
    arriveStations(state=[],action) {
        const {type,payload} = action;
        switch (type) {
            case ACTION_SET_ARRIVE_STATIONS:
                return payload;
            default:
        }
        return state
    },
    departTimeStart(state= 0, action) {
        const {type,payload} = action
        switch (type) {
            case ACTION_SET_DEPART_TIME_START:
                return payload;
            default:
        }
        return state
    },
    departTimeEnd(state=0,action) {
        const {type,payload} = action
        switch (type) {
            case ACTION_SET_DEPART_TIME_END:
                return payload;
            default:
        }
        return state
    },
    arriveTimeEnd(state=24, action) {
        const {type,payload} = action
        switch (type) {
            case ACTION_SET_ARRIVE_TIME_END:
                return payload
            default:
        }
        return state
    },
    arriveTimeStart(state = 0, action) {
        const {type, payload} = action
        switch (type) {
            case ACTION_SET_ARRIVE_TIME_START:
                return payload
            default:
        }
        return state
    }
}