import React,{ useEffect, useCallback, useMemo, lazy, Suspense} from 'react'
import {bindActionCreators} from 'redux'
import {h0} from '../common/fp'
import URI from 'urijs'
import dayjs from 'dayjs'
import useNav from '../common/useNav'
import { connect} from 'react-redux'
import Header from '../common/Header.jsx'
import Nav from '../common/Nav.jsx'
import Detail from '../common/Detail.jsx'
import Candidate from './Candidate.jsx'
import {TrainContext} from './context'
import './App.css'

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
} from './actions'
//异步加载Schedule组件，lazy是与Suspense配合使用的
const Schedule = lazy(() => import('./Schedule.jsx'))
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
        dispatch,
        searchParsed,
        isScheduleVisible,
        tickets
    } = props
    const onBack = useCallback(() => {
        window.history.back()
    } ,[])
    //这个副作用是专门用来解释url参数的,解析完后让状态为真
    useEffect(() => {
        const queries = URI.parseQuery(window.location.search);
        console.log(queries,'k看看解析的参数')
        const {aStation, dStation, date, trainNumebr} = queries
        //拿到url解析出来的4个参数后，把他们写入到store中
        dispatch(setDepartStation('北京南'))//出发车站
        dispatch(setArriveStation('上海虹桥'));//到达车站
        dispatch(setTrainNumber('D989'));//车次
        dispatch(setDepartDate(h0(dayjs(date).valueOf())));//利用dayjs将字符串转化成时间戳出发日期
        dispatch(setSearchParsed(true));
    }, [dispatch])
    useEffect(() => {
        if(!searchParsed) {
            console.log('url没解析好')
            return
        }
        const url = new URI('/rest/ticket')
            .setSearch('data', dayjs(departDate).format('YYYY-MM-DD'))
            .setSearch('trainNumber', trainNumber)
            .toString();
        fetch(url)
            .then(response => response.json())
            .then(result => {
                console.log(result,'看看请求过来的结果数据')
                const {detail, candidates} = result
                const {
                    departTimeStr,
                    arriveTimeStr,
                    arriveDate,
                    durationStr,
                } = detail
                dispatch (setDepartTimeStr(departTimeStr));
                 dispatch(setArriveTimeStr(arriveTimeStr))
                 dispatch(setArriveDate(arriveDate))
                 dispatch(setDurationStr(durationStr))
                 dispatch(setTickets(candidates));
                 //把过来的candidates，赋给tickets
            })
    }, [searchParsed, departDate, trainNumber,dispatch])
    useEffect(() => {
        document.title = trainNumber;
    }, [trainNumber]);
    const { isPrevDisabled, isNextDisabled, prev, next} = useNav(
        departDate,
        dispatch,
        prevDate,
        nextDate
    )
    const detailCbs = useMemo(() => {
        return bindActionCreators(
            {
                toggleIsScheduleVisible,
            },
            dispatch
        )
    }, [dispatch])
    return (<div className="app">
        <div className="header-wrapper">
            <Header title={trainNumber} onBack={onBack} />
        </div>
        <div className="nav-wrapper">
            <Nav
                date={departDate}
                isPrevDisabled={isPrevDisabled} //前一天按钮是否不可用
                isNextDisabled={isNextDisabled} //后一天按钮是否不可用
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
                departDate
            }}
        >
            <Candidate
                tickets={tickets}

            />
        </TrainContext.Provider>
         {isScheduleVisible && (
             <div className="mask"
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
    </div>)
}

export default connect(
    function mapStateToProps(state) {
        return state
    },
    function mapDispatchToProps(dispatch) {
        return {dispatch}
    }
)(App);