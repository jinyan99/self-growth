import React,{ useCallback, useEffect} from 'react'
import Header from '../common/Header.jsx'
import Detail from '../common/Detail.jsx'
import Choose from './Choose'
import Passengers from './Passenger'
import Ticket from './Ticket'
import Menu from './Menu'
import Account from './Account'
import {connect} from 'react-redux'
import URI from 'urijs'
import dayjs from 'dayjs'
import './App.css'
import {
    setDepartStation,
    setArriveStation,
    setTrainNumber,
    setDepartDate,
    setSearchParsed,
    fetchInitial,
    setSeatType,
    createAdult,
    createChild,
    showTicketTypeMenu,
    removePassenger,
    updatePassenger
} from './actions'
import { bindActionCreators } from 'redux'
function App(props) {
    const {
        trainNumber,
        departStation,
        arriveStation,
        departDate,
        arriveDate,
        durationStr,
        departTimeStr,
        arriveTimeStr,
        dispatch,
        searchParsed,
        price,
        seatType,
        passengers
    } = props;
    const onBack = useCallback(() => {
        window.history.back()
    }, [])
    //解析url的副作用
    useEffect(() => {
        const queries = URI.parseQuery(window.location.search)
        const { trainNumber, dStation, aStation, type, date = '175600'} = queries
        dispatch(setDepartStation('北京南'))
        dispatch(setArriveStation('上海虹桥'))
        dispatch(setTrainNumber('D307'))
        dispatch(setSeatType('二等座'))
        dispatch(setDepartDate(dayjs(date).valueOf()))
        dispatch(setSearchParsed(true))
    },[dispatch])
    //请求新url的副作用
    useEffect(() => {
        //确保url已经解析完
        console.log(searchParsed,'看看解析状态')
        if(!searchParsed) { return }
        //发起异步请求的副作用
        const url = new URI('/rest/order')
            .setSearch('dStation', departStation)
            .setSearch('aStation', arriveStation)
            .setSearch('type', seatType)
            .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
            .toString();
        //正式发起异步请求
        //换成fetch的高级写法，写在actioncreator里。详见actions文件fetchInitial这个actioncreator
        dispatch(fetchInitial(url))
    }, [searchParsed,dispatch,departStation,arriveStation,departDate,seatType])
    const passengersCbs = useCallback(
        bindActionCreators(
            {
                createAdult,
                createChild,
                removePassenger,
                updatePassenger,
                showTicketTypeMenu
            },
            dispatch
        )
    , [])
    return (<div className="app">
        <div className="header-wrapper">
            <Header title="订单填写" onBack={onBack}/>
        </div>
        <div className="detail-wrapper">
            <Detail
                departDate={departDate}
                arriveDate={arriveDate}
                departTimeStr={departTimeStr}
                arriveTimeStr= {arriveTimeStr}
                trainNumeber={trainNumber}
                departStation={departStation}
                arriveStation={arriveStation}
                durationStr={durationStr}
            >
                <span
                    style={{display: 'block'}}
                    className="train-icon"
                ></span>
            </Detail>
        </div>
        <Ticket price={price} type={seatType} />
        <Passengers passengers={passengers} {...passengersCbs}/>
        {'333'.length > 0 && (
            <Choose />
        )}
        <Account />
        <Menu />
    </div>)
}
export default connect(
    function mapStateToProps(state) {
        return state
    },
    function mapDispatchToProps(dispatch) {
        return {dispatch}
    }
) (App)