import React, { useCallback, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import URI from 'urijs';
import dayjs from 'dayjs';
//从redux中引入bindActionCreators
import { bindActionCreators } from 'redux';

import { h0 } from '../common/fp';
import Header from '../common/Header.jsx';
import Nav from '../common/Nav.jsx';
import List from './List.jsx';
import Bottom from './Bottom.jsx';
//引入日期导航的关于自定义Hook，辅助nav的方法
import useNav from '../common/useNav';

import {
    setFrom,
    setTo,
    setDepartDate,
    setHighSpeed,
    setSearchParsed,
    setTrainList,
    setTicketTypes,
    setTrainTypes,
    setDepartStations,
    setArriveStations,
    prevDate,
    nextDate,
    toggleOrderType,
    toggleHighSpeed,
    toggleOnlyTickets,
    toggleIsFiltersVisible,
  //用于综合筛选浮层的修改数据的 actioncreator
    setCheckedTicketTypes,
    setCheckedTrainTypes,
    setCheckedDepartStations,
    setCheckedArriveStations,
    setDepartTimeStart,
    setDepartTimeEnd,
    setArriveTimeStart,
    setArriveTimeEnd,
} from './actions';

import './App.css';

function App(props) {
    const {
        trainList,
        from,
        to,
        departDate,
        highSpeed, //只看高铁动车，这是个bool值
        searchParsed,
        dispatch,
        orderType, //类型排序，作为下面第一个按钮用的参数
        onlyTickets,//只看有票
        isFiltersVisible, //关心底部的第4个按钮是否显示综合筛选浮层--就把这4个变量直接传给Bottom组件
      //bottom组件综合浮层里用到的数据
        ticketTypes,//票种类型 【】
        trainTypes, //车的类型 【】
        departStations, //出发车站 【】
        arriveStations, //到达车站 【】
        checkedTicketTypes,//这行到63行选中的票种 都是对象类型
        checkedTrainTypes,
        checkedDepartStations,
        checkedArriveStations,
        departTimeStart, //出发时间的起点
        departTimeEnd, //出发时间的终点
        arriveTimeStart, //到达时间的起点
        arriveTimeEnd, //到达时间的终点
    } = props;   //从store映射的props中的值

    useEffect(() => {
        //用uri库解析url中参数，parseQuery解析query串。
        const queries = URI.parseQuery(window.location.search);

        const { from, to, date, highSpeed } = queries;
        //解析好url参数，存到本地全局状态数据store里的state值。
        dispatch(setFrom(from));
        dispatch(setTo(to));
        dispatch(setDepartDate(h0(dayjs(date).valueOf())));
        dispatch(setHighSpeed(highSpeed === 'true'));
//我们要确保url参数解析之后，再去发起下面的网络请求，怎么保证呢，这时就用到之前store里初始化的searchParsed状态值了。
//      所以url参数解析完后，要dispatch个action，让searchparsed变量变成true
        dispatch(setSearchParsed(true));
    }, []);

    useEffect(() => {
//我们要确保url参数解析之后，再去发起下面的网络请求，怎么保证呢，这时就用到之前store里初始化的searchParsed状态值了。
        if (!searchParsed) {
            return;
        }

        const url = new URI('/rest/query')
            .setSearch('from', from)
            .setSearch('to', to)
            .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
            .setSearch('highSpeed', highSpeed)
            .setSearch('orderType', orderType)
            .setSearch('onlyTickets', onlyTickets)
            .setSearch(
                'checkedTicketTypes',
                //记住这种对象转字符串的方式 利用好join()转字符串。
                Object.keys(checkedTicketTypes).join()
            )
            .setSearch(
                'checkedTrainTypes',
                Object.keys(checkedTrainTypes).join()
            )
            .setSearch(
                'checkedDepartStations',
                Object.keys(checkedDepartStations).join()
            )
            .setSearch(
                'checkedArriveStations',
                Object.keys(checkedArriveStations).join()
            )
            .setSearch('departTimeStart', departTimeStart)
            .setSearch('departTimeEnd', departTimeEnd)
            .setSearch('arriveTimeStart', arriveTimeStart)
            .setSearch('arriveTimeEnd', arriveTimeEnd)
            .toString();
        
        fetch(url)
            .then(response => response.json()) //JSON格式 返给下个链式接受
            .then(result => {
                const {
                    dataMap: {
                        directTrainInfo: {
                            trains,
                            filter: {
                                ticketType,
                                trainType,
                                depStation,
                                arrStation,
                            },
                        },
                    },
                } = result;
                //这下就把url数据和服务端获取到的数据，都存储好了，全局状态store里面/
                dispatch(setTrainList(trains));
                dispatch(setTicketTypes(ticketType));
                dispatch(setTrainTypes(trainType));
                dispatch(setDepartStations(depStation));
                dispatch(setArriveStations(arrStation));
            });
    //在数据请求这方面，还必须要考虑的是异常情况，比如url参数的不足，异步请求接口失败等等
    //这块请求这块，必须要写上依赖，否则里面有dispatch的时候，会造成死循环，会不断触发这个更新，一dispatch就会不断触发组件渲染，
    //必须得加上依赖，依赖值不变的话就不能渲染死渲染类的
}, [
        from,
        to,
        departDate,
        highSpeed,
        searchParsed,
        orderType,
        onlyTickets,
        checkedTicketTypes,
        checkedTrainTypes,
        checkedDepartStations,
        checkedArriveStations,
        departTimeStart,
        departTimeEnd,
        arriveTimeStart,
        arriveTimeEnd,
    ]);

    const onBack = useCallback(() => {
        window.history.back();
    }, []);
    //这块使用了useNav 自定义Hook钩子，
    //Hooks的一大优势就是可以轻松的分享状态逻辑，如下面创建的使用的自定义的useNav钩子
    //在common里建的useNavjs文件。
    const { isPrevDisabled, isNextDisabled, prev, next } = useNav(
        departDate,
        dispatch,
        prevDate,
        nextDate
    );

    const bottomCbs = useMemo(() => {
        //这样就把4个actioncreator与dispatch绑定到了一起
        return bindActionCreators(
            {
                toggleOrderType,
                toggleHighSpeed,
                toggleOnlyTickets,
                toggleIsFiltersVisible,
                setCheckedTicketTypes,
                setCheckedTrainTypes,
                setCheckedDepartStations,
                setCheckedArriveStations,
                setDepartTimeStart,
                setDepartTimeEnd,
                setArriveTimeStart,
                setArriveTimeEnd,
            },
            dispatch
        );
    }, []);
    //用来处理异常，如果异常直接返回null
    if (!searchParsed) {
        return null;
    }
    //从url参数中解析的数据如   tittle数据应该是始发城市终点城市，那我们从哪去获取from和to呢？
    //对于这个页面来说，数据一定会出现在url参数中，也会出现在redux的state中。那我们就从store中去获取from和to。。
    return (
        <div>
            <div className="header-wrapper">
                <Header title={`${from} ⇀ ${to}`} onBack={onBack} />
            </div>
            <Nav
                date={departDate}
                isPrevDisabled={isPrevDisabled}
                isNextDisabled={isNextDisabled}
                prev={prev}
                next={next}
            />
            <List list={trainList} />
            {/* bindactioncreator的使用时机：store状态值显示的是直接props中传过去即可，
                    当actioncreator的话，直接需要放到bindationcreator包装下，透传袭下去 */}
            <Bottom
                highSpeed={highSpeed}
                orderType={orderType}
                onlyTickets={onlyTickets}
                isFiltersVisible={isFiltersVisible}
              //下面数据是透传给bottom组件的综合筛选浮层的
                ticketTypes={ticketTypes}
                trainTypes={trainTypes}
                departStations={departStations}
                arriveStations={arriveStations}
                checkedTicketTypes={checkedTicketTypes}
                checkedTrainTypes={checkedTrainTypes}
                checkedDepartStations={checkedDepartStations}
                checkedArriveStations={checkedArriveStations}
                departTimeStart={departTimeStart}
                departTimeEnd={departTimeEnd}
                arriveTimeStart={arriveTimeStart}
                arriveTimeEnd={arriveTimeEnd}
                {...bottomCbs}
            />
        </div>
    );
}

export default connect(
    function mapStateToProps(state) {
        return state;
    },
    function mapDispatchToProps(dispatch) {
        return { dispatch };
    }
)(App);
