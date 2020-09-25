//1-先定义action的type字段格式：全部把之前全局状态字段大写左接set字段即可。
export const ACTION_SET_FROM = "SET_FROM"
 export const ACTION_SET_TO = "SET_TO"
export const ACTION_SET_IS_CITY_SELECTOR_VISIBLE = "SET_ISCITYSELECTORVISIBLE"
 export const ACTION_SET_CURRENT_SELECTING_LEFT_CITY = "SET_CURRENTSELECTINGLEFTCITY"
export const ACTION_SET_CITY_DATA = "SET_CITYDATA"
export const ACTION_SET_IS_LOADING_CITY_DATA = "SET_ISLOADINGCITYDATA"
export const ACTION_SET_IS_DATE_SELECTOR_VISIBLE = "SET_ISDATESELECTORVISIBLE"
export const ACTION_SET_DEPART_DATE = "SET_DEPARTDATE"
export const ACTION_SET_HIGH_SPEED = "SET_HIGHSPEED"


export function setFrom(from) {
    return ({
        type: ACTION_SET_FROM,
        payload: from,
    }, (dispatch,getState) => {
        console.log('hah ,逗号运算符仅用来标示2种写法都可以')
        dispatch({
            type: ACTION_SET_FROM,
            payload: from,
        })
    })
}
export function setTo(to) {
    return {
        type: ACTION_SET_TO,
        payload: to,
    };
}

export function setIsLoadingCityData(isLoadingCityData) {
    return {
        type: ACTION_SET_IS_LOADING_CITY_DATA,
        payload: isLoadingCityData,
    };
}

export function setCityData(cityData) {
    return {
        type: ACTION_SET_CITY_DATA,
        payload: cityData,
    };
}
export function hideCitySelector() {
    return (dispatch,getState) => {
        dispatch({
        type: ACTION_SET_IS_CITY_SELECTOR_VISIBLE,
        payload: false,
    });
    }
}
export function showCitySelector(currentSelectingLeftCity) {
    return dispatch => {//异步action，就dispatch动态传入
    //可见异步action并不是说用当前state值或者异步操作的时候才用，在这种情况下也可以用
            dispatch({
            type: ACTION_SET_IS_CITY_SELECTOR_VISIBLE,
            payload: true,
        });

        dispatch({
            type: ACTION_SET_CURRENT_SELECTING_LEFT_CITY,
            payload: currentSelectingLeftCity,
        });
    };
}
//日期选择浮层
export function showDateSelector() {
    return {
        type: ACTION_SET_IS_DATE_SELECTOR_VISIBLE,
        payload: true,
    };
}
//隐藏日期选择器
export function hideDateSelector() {
    return (dispatch,getState) =>{
        console.log('哈哈')
        dispatch({type: ACTION_SET_IS_DATE_SELECTOR_VISIBLE,
        payload: false,})
    };
}
export function toggleHighSpeed() {
    return (dispatch, getState) => {
        const { highSpeed } = getState();
        dispatch({//用dispatch派发新的action
            type: ACTION_SET_HIGH_SPEED,
            payload: !highSpeed,
        });
    };
}
export function setSelectedCity(city) {//参数就是被选择的城市名
    return (dispatch, getState) => {//这里也是采取的异步action方案才能获取到数据
        const { currentSelectingLeftCity } = getState();

        if (currentSelectingLeftCity) {
            dispatch(setFrom(city));
        } else {
            dispatch(setTo(city));
        }

        dispatch(hideCitySelector());//无论，最后都要把城市浮层都关闭掉
    };
}
//始发站与终点站是可以调换的，实现他
export function exchangeFromTo() {
    return (dispatch, getState) => {
        const { from, to } = getState();//异步获取到最新的state值
        dispatch(setFrom(to));
        dispatch(setTo(from));
    };
}
export function fetchCityData() {
    return (dispatch,getState) => {
        const {isLoadingCityData } = getState();
        if(isLoadingCityData) return
        const cache = JSON.parse(
            localStorage.getItem('city_data_cache') || '{}'
        )
        if(Date.now() < cache.expires) {
            dispatch(setCityData(cache.data))
            return;
        }
        dispatch(setIsLoadingCityData(true));
        fetch('/rest/cities?_' + Date.now())
            .then(res => res.json() )
            .then(cityData => {
                console.log('开始获取数据了')
                dispatch(setCityData(cityData))
                localStorage.setItem(
                    "city_data_cache",
                    JSON.stringify({
                        expires: Date.now() + 60 *1000,
                        data: cityData
                    })
                );
                dispatch(setIsLoadingCityData(false))
                })
            .catch(() => {
                dispatch(setIsLoadingCityData(false))
            })
    }
}
export function setDepartDate(departDate) {
    return {
        type: ACTION_SET_DEPART_DATE,
        payload: departDate,
    };
}