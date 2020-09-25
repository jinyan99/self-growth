import {
    ACTION_SET_FROM,
    ACTION_SET_TO,
    ACTION_SET_DEPART_DATE,
    ACTION_SET_HIGH_SPEED,
    ACTION_SET_TRAIN_LIST,
    ACTION_SET_ORDER_TYPE,
    ACTION_SET_ONLY_TICKETS,
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
    ACTION_SET_ARRIVE_TIME_START,
    ACTION_SET_ARRIVE_TIME_END,
    ACTION_SET_IS_FILTERS_VISIBLE,
    ACTION_SET_SEARCH_PARSED,
} from './actions';
import { ORDER_DEPART } from './constant';
//由于redux的限制，每个reducer函数的第一个参数不能为空，都必须有默认值。
 //每个派发次action尽管不是这个，都会执行这里面所有reducer，只不过不匹配返回的是return state逻辑
export default {
    from(state = null, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_FROM:
                return payload;
            default:
        }

        return state;
    },
    to(state = null, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_TO:
                return payload;
            default:
        }

        return state;
    },
    departDate(state = Date.now(), action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_DEPART_DATE:
                return payload;
            default:
        }

        return state;
    },
//然后在这筛选按钮向只看高铁动车进行同步，达到双向同步，增加了个ACTION_SET_CHECKED_TRAIN_TYPES case项即可。
    highSpeed(state = false, action) {
        const { type, payload } = action;
        let checkedTrainTypes;
        //每个派发次action尽管不是这个，都会执行这里面所有reducer，只不过不匹配返回的是return state逻辑
        switch (type) {
            case ACTION_SET_HIGH_SPEED:
                return payload;
            case ACTION_SET_CHECKED_TRAIN_TYPES:
            //触发这个得是筛选浮层，同时勾选高铁和动车，点击确定后才会联动触发底层action，不点确定的话还只能触发缓冲区里的useReducer值
                checkedTrainTypes = payload;//这种情况下payload代表的是新的checkedTrainTypes
                return Boolean(checkedTrainTypes[1] && checkedTrainTypes[5]);
            default:
        }

        return state;
    },
    trainList(state = [], action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_TRAIN_LIST:
                return payload;
            default:
        }

        return state;
    },
    orderType(state = ORDER_DEPART, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_ORDER_TYPE:
                return payload;
            default:
        }

        return state;
    },
    onlyTickets(state = false, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_ONLY_TICKETS:
                return payload;
            default:
        }

        return state;
    },
    ticketTypes(state = [], action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_TICKET_TYPES:
                return payload;
            default:
        }

        return state;
    },
    checkedTicketTypes(state = {}, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_CHECKED_TICKET_TYPES:
                return payload;
            default:
        }

        return state;
    },
    trainTypes(state = [], action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_TRAIN_TYPES:
                return payload;
            default:
        }

        return state;
    },
//因为每个action都会流经reducer，所以我们在checkedTrainTypes函数里可以捕获到
//bool值的更新行为 ，如加个ACTION_SET_HIGH_SPEED项就这样可以捕获到对high-speed的更新
    checkedTrainTypes(state = {}, action) {
        const { type, payload } = action;

        let highSpeed;
        let newCheckedTrainTypes;

        switch (type) {
            case ACTION_SET_CHECKED_TRAIN_TYPES:
                return payload;
            case ACTION_SET_HIGH_SPEED:
            //当你点了只看高铁动车动车项后，就会联动触发到这个reducer里的type项
            //(因为reducer模块化抛任意action都会遍历所有的模块reducer都套action执行一遍)
                highSpeed = payload;
                newCheckedTrainTypes = { ...state };

                if (highSpeed) {
                    newCheckedTrainTypes[1] = true;
                    newCheckedTrainTypes[5] = true;
                } else {
                    delete newCheckedTrainTypes[1];
                    delete newCheckedTrainTypes[5];
                }

                return newCheckedTrainTypes;
            default:
        }

        return state;
    },
    departStations(state = [], action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_DEPART_STATIONS:
                return payload;
            default:
        }

        return state;
    },
    checkedDepartStations(state = {}, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_CHECKED_DEPART_STATIONS:
                return payload;
            default:
        }

        return state;
    },
    arriveStations(state = [], action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_ARRIVE_STATIONS:
                return payload;
            default:
        }

        return state;
    },
    checkedArriveStations(state = {}, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_CHECKED_ARRIVE_STATIONS:
                return payload;
            default:
        }

        return state;
    },
    departTimeStart(state = 0, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_DEPART_TIME_START:
                return payload;
            default:
        }

        return state;
    },
    departTimeEnd(state = 24, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_DEPART_TIME_END:
                return payload;
            default:
        }

        return state;
    },
    arriveTimeStart(state = 0, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_ARRIVE_TIME_START:
                return payload;
            default:
        }

        return state;
    },
    arriveTimeEnd(state = 24, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_ARRIVE_TIME_END:
                return payload;
            default:
        }

        return state;
    },
    isFiltersVisible(state = false, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_IS_FILTERS_VISIBLE:
                return payload;
            default:
        }

        return state;
    },
    searchParsed(state = false, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_SEARCH_PARSED:
                return payload;
            default:
        }

        return state;
    },
};
