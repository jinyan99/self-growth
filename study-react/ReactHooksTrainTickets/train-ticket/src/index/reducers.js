//首先肯定是要导入所有的actiontype
import {
    ACTION_SET_FROM,
    ACTION_SET_TO,
    ACTION_SET_IS_CITY_SELECTOR_VISIBLE,
    ACTION_SET_CURRENT_SELECTING_LEFT_CITY,
    ACTION_SET_CITY_DATA,
    ACTION_SET_IS_LOADING_CITY_DATA,
    ACTION_SET_IS_DATE_SELECTOR_VISIBLE,
    ACTION_SET_HIGH_SPEED,
    ACTION_SET_DEPART_DATE,
} from './actions';

//然后我们要根据每个actiontype对应的字段声明出对应的reducer函数，每个reducer都是一个函数。
//可以根据state值来取对应各个reducer的函数名，比较清晰
//这也相当于reducer的模块化，这个文件抛出一个对象，对象里含多个reducer模块方法，store中引入这个对象combine这个对象就是把所有模块化的reducer汇总

//每个派发次action尽管不是这个，都会执行这里面所有reducer，
//只不过不匹配返回的是return state逻辑

export default {
    from(state = '北京', action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_FROM:
                return payload;
            default:
        }
        //如果都没有匹配上就返回原state默认值
        return state;
    },
    to(state = '上海', action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_TO:
                return payload;
            default:
        }

        return state;
    },
    isCitySelectorVisible(state = false, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_IS_CITY_SELECTOR_VISIBLE:
                return payload;
            default:
        }

        return state;
    },
    currentSelectingLeftCity(state = false, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_CURRENT_SELECTING_LEFT_CITY:
                return payload;
            default:
        }

        return state;
    },
    cityData(state = null, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_CITY_DATA:
                return payload;
            default:
        }

        return state;
    },
    isLoadingCityData(state = false, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_IS_LOADING_CITY_DATA:
                return payload;
            default:
        }

        return state;
    },
    isDateSelectorVisible(state = false, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_IS_DATE_SELECTOR_VISIBLE:
                return payload;
            default:
        }

        return state;
    },
    highSpeed(state = false, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_HIGH_SPEED:
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
};
