import React,{useCallback, useEffect,useMemo} from 'react'
import Header from '../common/Header.jsx'
import {connect} from 'react-redux';
import Nav from '../common/Nav'
import {bindActionCreators} from 'redux';
import dayjs from 'dayjs'
import List from './List'
import URI from 'urijs'
import './App.css'
//引入自定义hook，日期导航的封装
import useNav from '../common/useNav'
import Bottom from './Bottom'
import {
    setFrom,
    prevDate,
    nextDate,
    setTrainList,
    toggleOrderType,
    toggleHighSpeed,
    toggleOnlyTickets,
    toggleIsFiltersVisible,
    //botto组件的综合浮层的actioncreator
    setCheckedTicketTypes,
    setCheckedTrainTypes,
    setCheckedDepartStations,
    setCheckedArriveStations,
    setTicketTypes,
    setTrainTypes,
    setDepartStations,
    setArriveStations,
    setDepartTimeStart,
    setDepartTimeEnd,
    setArriveTimeStart,
    setArriveTimeEnd
} from './actions'
function App(props) {
    const {
        from,
        to,
        departDate,
        highSpeed,
        searchParsed,
        dispatch,
        trainList,
        orderType,
        onlyTickets,
        isFiltersVisible,
        //bottom组件综合浮层里用到的数据
        ticketTypes,
        trainTypes,
        departStations,
        arriveStations,
        checkedTicketTypes,
        checekdDepartStations,
        checkedArriveStations,
        checkedTrainTypes,
        departTimeStart,
        departTimeEnd,
        arriveTimeEnd,
        arriveTimeStart,

    } = props;
    const onBack = useCallback(() => {
        window.history.back()
    },[])
    const {isNextDisabled,isPrevDisabled,prev,next} = useNav(
        departDate,
        dispatch,
        prevDate,
        nextDate
    )
    const bottomCbs = useMemo(() => {
        return bindActionCreators({
            toggleOrderType,
            toggleHighSpeed,
            toggleOnlyTickets,
            toggleIsFiltersVisible,
            setCheckedTrainTypes,
            setCheckedTicketTypes,
            setCheckedDepartStations,
            setCheckedArriveStations,
            setDepartTimeEnd,
            setDepartTimeStart,
            setArriveTimeStart,
            setArriveTimeEnd
        },dispatch)
    }, [dispatch])
    useEffect(() => {
        // if(!searchParsed) {
        //     return
        // }
        const url = new URI('/rest/query')
            .setSearch('from',from)
            .setSearch('to',to)
            .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
            .setSearch('highSpeed', highSpeed)
            .setSearch('orderType', orderType)
            .setSearch('onlyTickets', onlyTickets)
            // .setSearch(
            //     'checkedTicketTypes',
            //     Object.keys(checkedTicketTypes).join()
            // )
            // .setSearch(
            //     'checkedTrainTypes',
            //     Object.keys(checkedTrainTypes).join()
            // )
            // .setSearch(
            //     'checkedDepartStations',
            //     Object.keys(checkedDepartStations).join()
            // )
            // .setSearch(
            //     'checkedArriveStations',
            //     Object.keys(checkedArriveStations).join()
            // )
            // .setSearch('departTimeStart', departTimeStart)
            // .setSearch('departTimeEnd', departTimeEnd)
            // .setSearch('arriveTimeStart', arriveTimeStart)
            // .setSearch('arriveTimeEnd', arriveTimeEnd)
            .toString();
        fetch(url)
            .then(response => response.json())
            .then(result => {
               console.log(result,"看看请求过来的数据")
               const {
                   dataMap: {
                       directTrainInfo: {
                           trains,
                           filter: {
                               ticketType,
                               trainType,
                               depStation,
                               arrStation
                           }
                       }
                   }
               } = result;
                dispatch(setTrainList(trains))
                dispatch(setTicketTypes(ticketType))
                dispatch(setTrainTypes(trainType))
                dispatch(setDepartStations(depStation))
                dispatch(setArriveStations(arrStation))
            })
    }, [
        from,
        to,
        departDate,
        highSpeed,
        dispatch,
        orderType,
        onlyTickets
    ])
    return (<div>
        <div className="header-wrapper">
            <Header
                title={`${from}-${to}`}
                onBack={onBack}
            />
        </div>
        <Nav
            date={departDate}
            isPrevDisabled={isPrevDisabled}
            isNextDisabled={isNextDisabled}
            prev={prev}
            next={next}
        />
        <List list={trainList}></List>
        <Bottom
            orderType={orderType}
            highSpeed={highSpeed}
            onlyTickets={onlyTickets}
            isFiltersVisible={isFiltersVisible}
            ticketTypes={ticketTypes}
            trainTypes={trainTypes}
            departStations={departStations}
            arriveStations={arriveStations}
            checkedTicketTypes={checkedTicketTypes}
            checkedArriveStations={checkedArriveStations}
            checekdDepartStations={checekdDepartStations}
            checkedTrainTypes={checkedTrainTypes}
            departTimeStart={departTimeStart}
            departTimeEnd={departTimeEnd}
            arriveTimeStart={arriveTimeStart}
            arriveTimeEnd={arriveTimeEnd}
            {...bottomCbs}

        />
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