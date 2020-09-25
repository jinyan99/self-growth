import React, { useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
//将浮层状态值actioncreator与dispatch绑定在一起
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import URI from 'urijs';
import dayjs from 'dayjs';
import { h0 } from '../common/fp';
import useNav from '../common/useNav';
import Header from '../common/Header.jsx';
import Nav from '../common/Nav.jsx';
import Detail from '../common/Detail.jsx';
import Candidate from './Candidate.jsx';
import { TrainContext } from './context';
//如果是异步加载Schedule的话就不能以import方式引入了，必须得注视掉。应该用lazy
//import Schedule from './Schedule.jsx';
import './App.css';

import {
    setDepartStation,
    setArriveStation,
    setTrainNumber,
    setDepartDate,
    setSearchParsed,
    prevDate,
    nextDate,
    setDepartTimeStr,
    setArriveTimeStr,
    setArriveDate,
    setDurationStr,
    setTickets,
    toggleIsScheduleVisible,
} from './actions';

    //异步加载Schedule组件，lazy是与Suspense配合使用的
const Schedule = lazy(() => import('./Schedule.jsx'));

function App(props) {
    const {
        departDate,
        arriveDate,
        departTimeStr,
        arriveTimeStr,
        departStation,
        arriveStation,
        trainNumber,
        durationStr,
        tickets,
        isScheduleVisible,
        searchParsed,

        dispatch,
    } = props;
//点击返回按钮的回掉函数
    const onBack = useCallback(() => {
        window.history.back();
    }, []);

    //这个副作用用来解析url参数的
    useEffect(() => {
        const queries = URI.parseQuery(window.location.search);
        const { aStation, dStation, date, trainNumber } = queries;
        //拿到url解析出来的4个参数后，把他们写入到store中
        dispatch(setDepartStation(dStation));//出发车站
        dispatch(setArriveStation(aStation));//到达车站
        dispatch(setTrainNumber(trainNumber));//车次
        dispatch(setDepartDate(h0(dayjs(date).valueOf())));//利用dayjs将字符串转化成时间戳出发日期

        dispatch(setSearchParsed(true));
        //有了这些数据之后，我们就可以渲染header日期导航组件了
    }, []);
    //这个副作用是用来设置文档的窗口标题的。和浏览器Bom打交道显然不是react组件份内之事，所以才叫副作用。
    useEffect(() => {
        document.title = trainNumber;
    }, [trainNumber]);
    //接下来用获取到的数据发起异步请求，异步请求也属于副作用。
    useEffect(() => {
        if (!searchParsed) {
        //加判断，若url没解析好时就不需要发起异步请求
            return;
        }

        const url = new URI('/rest/ticket')
            .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
            .setSearch('trainNumber', trainNumber)
            .toString();

        fetch(url)
            .then(response => response.json())
            .then(result => {
                const { detail, candidates } = result;

                const {
                    departTimeStr,
                    arriveTimeStr,
                    arriveDate,//这里的arriveDate就是个时间戳，所以不需要转化
                    durationStr,
                } = detail;

                dispatch(setDepartTimeStr(departTimeStr));
                dispatch(setArriveTimeStr(arriveTimeStr));
                dispatch(setArriveDate(arriveDate));
                dispatch(setDurationStr(durationStr));
                dispatch(setTickets(candidates));
            });
    }, [searchParsed, departDate, trainNumber]);

    const { isPrevDisabled, isNextDisabled, prev, next } = useNav(
        departDate,
        dispatch,
        prevDate,
        nextDate
    );
        //与dispatch绑定在一起。然后把detailCbs以解构的方式传递给Detail组件，这样就可以在detail组件中获取到toggleIsScheduleVisible
        //detail里点击时刻表的时候就可以直接调用这个toggleIs函数
    const detailCbs = useMemo(() => {
        return bindActionCreators(
            {
                toggleIsScheduleVisible,
            },
            dispatch
        );
    }, []);

    if (!searchParsed) {
        //写这个是，因为解析url参数前，trainNumber是空的，逻辑就会报错。
        //所以加判断，如果他不等于真，就不渲染这个组件
        return null;
    }

    return (
        <div className="app">
            <div className="header-wrapper">
                <Header title={trainNumber} onBack={onBack} />
            </div>
            <div className="nav-wrapper">{/* 为了定位方便，通常给组件外套层divwrapper */}
                <Nav
                    date={departDate}
                    isPrevDisabled={isPrevDisabled}/* 前一天按钮是否不可用 */
                    isNextDisabled={isNextDisabled}/* 后一天按钮是否不可用 */
                    prev={prev}
                    next={next}
                />
            </div>
            <div className="detail-wrapper">
                <Detail
                    departDate={departDate}
                    arriveDate={arriveDate}
                    departTimeStr={departTimeStr}
                    arriveTimeStr={arriveTimeStr}
                    trainNumber={trainNumber}
                    departStation={departStation}
                    arriveStation={arriveStation}
                    durationStr={durationStr}
                >
                    <span className="left"></span>
                    <span
                        className="schedule"
                        onClick={() => detailCbs.toggleIsScheduleVisible()}
                    >
                        时刻表
                    </span>
                    <span className="right"></span>
                </Detail>
            </div>
            <TrainContext.Provider
                value={{
                    trainNumber,
                    departStation,
                    arriveStation,
                    departDate,
                }}
            >
                <Candidate tickets={tickets} />
            </TrainContext.Provider>
            {isScheduleVisible && (
                <div   /* 这个div是弹出时刻表的半透明底背景层 */
                    className="mask"
                    //绑定click是点击浮层的任意个位置都会关闭这个浮层
                    onClick={() => dispatch(toggleIsScheduleVisible())}
                >
                    <Suspense fallback={<div>loading</div>}>
                        <Schedule
                            date={departDate}
                            trainNumber={trainNumber}
                            departStation={departStation}
                            arriveStation={arriveStation}
                        />
                    </Suspense>
                </div>
            )}
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
