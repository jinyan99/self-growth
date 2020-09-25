//把初始state字段拿过来，全部大写赋给常量字段，作为actiontype使用
//然后每个actiontype字段都以ACTION开头。有了action type后我们就可以定义一系列的actioncreator函数了
export const ACTION_SET_FROM = 'SET_FROM';
export const ACTION_SET_TO = 'SET_TO';
export const ACTION_SET_IS_CITY_SELECTOR_VISIBLE =
    'SET_IS_CITY_SELECTOR_VISIBLE';
export const ACTION_SET_CURRENT_SELECTING_LEFT_CITY =
    'SET_CURRENT_SELECTING_LEFT_CITY';
export const ACTION_SET_CITY_DATA = 'SET_CITY_DATA';
export const ACTION_SET_IS_LOADING_CITY_DATA = 'SET_IS_LOADING_CITY_DATA';
export const ACTION_SET_IS_DATE_SELECTOR_VISIBLE =
    'SET_IS_DATE_SELECTOR_VISIBLE';
export const ACTION_SET_HIGH_SPEED = 'SET_HIGH_SPEED';
export const ACTION_SET_DEPART_DATE = 'SET_DEPART_DATE';


//针对store里的每个state都写个对应的actioncreator方法
//下面的方法都是属于actioncreator方法
export function setFrom(from) {
    //actioncreator就是内部封装好的可以写成return action对象形式的，也可以return出函数形式的，这和bindactioncreator和thunk都没关系，return函数和对象都是redux定义好的
    //所以下面两种写法都是可以的。只是用来显示2种写法的逗号运算符
    return ({
        type: ACTION_SET_FROM,
        payload: from,
    }, (dispatch,getState) => {
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

export function setCityData(cityDate) {
    return {
        type: ACTION_SET_CITY_DATA,
        payload: cityDate,
    };
}
//下面的开关字段，就不用set开头了，得用toggle开头
//查看告诉开关
export function toggleHighSpeed() {
    return (dispatch, getState) => {
        const { highSpeed } = getState();
        dispatch({//用dispatch派发新的action
            type: ACTION_SET_HIGH_SPEED,
            payload: !highSpeed,
        });
    };
}
//城市选择器浮层  (将两个actiontype绑定到一起 --也是在Journey组件中用到的)
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
//隐藏城市选择器浮层
export function hideCitySelector() {
    return {
        type: ACTION_SET_IS_CITY_SELECTOR_VISIBLE,
        payload: false,
    };
}
//当城市选择浮层被关闭的时候，我们需要把被选中的城市回填回来，这里是根据currentselectleftcity来判断
//是回填到始发站还是终点站，所以我们写个actioncreator把这个判断逻辑封装一下
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

//日期选择浮层
export function showDateSelector() {
    return {
        type: ACTION_SET_IS_DATE_SELECTOR_VISIBLE,
        payload: true,
    };
}
//隐藏日期选择器
export function hideDateSelector() {
    return {
        type: ACTION_SET_IS_DATE_SELECTOR_VISIBLE,
        payload: false,
    };
}

//始发站与终点站是可以调换的，实现他---在Journey组件中用到的
export function exchangeFromTo() {
    //这个就是切换始发站也需要走action的全局状态改变的，即提交这个奏折，立即改变下始站和到站的兑换即可。
    return (dispatch, getState) => {
        const { from, to } = getState();//异步获取到最新的state值
        dispatch(setFrom(to));
        dispatch(setTo(from));
    };
}
//上面就是所有的actioncreator了



export function setDepartDate(departDate) {
    return {
        type: ACTION_SET_DEPART_DATE,
        payload: departDate,
    };
}
    //用来异步获取fetchData数据
    //发起异步请求的普遍模型是这样的：先去判断当前有没有在运行的另一个同样的请求，如果有的化，
    //我们就返回什么都不做。否则才去发起真正的网络请求。
export function fetchCityData() {
    return (dispatch, getState) => {
        const { isLoadingCityData } = getState();

        if (isLoadingCityData) {
            return;
        }

        const cache = JSON.parse(
            //记住这种方式，容错能力，怕取不出来的解析报错的化，可以加 || {}这种容错能力
            localStorage.getItem('city_data_cache') || '{}'
        );
            //判断过期时间，过期的化直接删掉。若取不到这是undefined，按按照比较运算符的比较规则：
            //会将undefined隐式转化为NaN，则有NaN都会比较出false值则执行下面的存储逻辑
        if (Date.now() < cache.expires) {
            dispatch(setCityData(cache.data));

            return;
        }

        dispatch(setIsLoadingCityData(true));
     //如果为假的化，先把变量设成true。然后调用fetch来发起真正的网络强求
        fetch('/rest/cities?_' + Date.now()) //加入一个时间戳，来防止缓存
            .then(res => res.json())
            .then(cityData => {
                dispatch(setCityData(cityData));
                //数据不会太变化，给他实现缓存，做的一个优化
                localStorage.setItem(
                    'city_data_cache',
                    JSON.stringify({
                        expires: Date.now() + 60 * 1000,
                        data: cityData,
                    })
                );

                dispatch(setIsLoadingCityData(false));
            })
            .catch(() => {
                dispatch(setIsLoadingCityData(false));
            });
    };
}
