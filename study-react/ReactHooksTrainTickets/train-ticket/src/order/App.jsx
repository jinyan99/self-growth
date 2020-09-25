import React, { useCallback, useEffect, useMemo } from 'react';
import URI from 'urijs';
import dayjs from 'dayjs';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../common/Header.jsx';
//车次详情组件
//引入车次详情组件，但和之前复用的有点不一样，这个中间是有个图片显示的，复用的Detail组件是没有的，这样得去Detail组件改造下
import Detail from '../common/Detail.jsx';
import Account from './Account.jsx';
import Choose from './Choose.jsx';
import Passengers from './Passengers.jsx';
import Ticket from './Ticket.jsx';
import Menu from './Menu.jsx';

import './App.css';

import { //导入actioncreator
    setDepartStation,
    setArriveStation,
    setTrainNumber,
    setSeatType,
    setDepartDate,
    setSearchParsed, //解析完url参数必须要设置这个状态
    fetchInitial, //异步actioncreator，抽离出去做fetch网络请求的
    createAdult, //引入这两个特殊的passengrs用到的actioncreaotr
    createChild,
    removePassenger,
    updatePassenger,
    hideMenu,
    showGenderMenu,
    showFollowAdultMenu,
    showTicketTypeMenu,
} from './actions';

function App(props) {
    const {
        trainNumber,
        departStation,
        arriveStation,
        seatType,
        departDate,
        arriveDate,
        departTimeStr,
        arriveTimeStr,
        durationStr,
        price,
        passengers,
        menu,
        isMenuVisible,
        searchParsed,
        dispatch,
    } = props;

    const onBack = useCallback(() => {
        window.history.back();
    }, []);

    useEffect(() => {
        const queries = URI.parseQuery(window.location.search);

        const { trainNumber, dStation, aStation, type, date } = queries;
        //url解析完参数之后，必须把他们全局存储redux的store中起来。所以在上面得导入必要的actioncreatir
       //上面引进的actioncreator返回的是action值，派发奏折的话得dispatch
        dispatch(setDepartStation(dStation));
        dispatch(setArriveStation(aStation));
        dispatch(setTrainNumber(trainNumber));
        dispatch(setSeatType(type));
        dispatch(setDepartDate(dayjs(date).valueOf()));//我们需要传入的是unix时间戳，但解析出来的是个字符串，还是得使用dayjs给转化下。
        dispatch(setSearchParsed(true));
    }, []);

    useEffect(() => {
        //发起异步请求的前提是解析完毕，得提前判断下，数组依赖也依赖下这个searchParsed状态，比较优化性
        //这个副作用里判断下，在外层也得判断下，防止未解析时出错即return上面那个if
        if (!searchParsed) {
            return;
        }
        //发起异步请求的副作用
        const url = new URI('/rest/order')
            .setSearch('dStation', departStation)
            .setSearch('aStation', arriveStation)
            .setSearch('type', seatType)
            .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
            .toString();
        //下一步要发起异步请求了，我们现在换一种方式发起请求不在这直接fetch了。
        //而是把fetch操作定义在新的actioncreator里了。打开actoinjs文件新增fetchInitial这个actioncreator。
        dispatch(fetchInitial(url));
    }, [searchParsed, departStation, arriveStation, seatType, departDate]);
    
    //这个就是将两个特殊的乘客信息的actioncreaotr与dispatch绑定在一起，bindactioncreaotrs得到的是个对象，各个action对应的key自动带disoatch功能的。
    //得到对象后，可以直接对象解构赋值给passenger组件。后面在passenger组件中就可以从props中取出带自动disaptch内容的对象内容了。
    const passengersCbs = useMemo(() => {
        return bindActionCreators(
            {
                createAdult,
                createChild,
                removePassenger,
                updatePassenger,
                showGenderMenu,
                showFollowAdultMenu,
                showTicketTypeMenu,
            },
            dispatch
        );
    }, []);
//
    const menuCbs = useMemo(() => {
        return bindActionCreators(
            {
                hideMenu,
            },
            dispatch
        );
    }, []);

    const chooseCbs = useMemo(() => {
        return bindActionCreators(
            {
                updatePassenger,
            },
            dispatch
        );
    }, []);

    if (!searchParsed) {
        return null;
    }

    return (
        <div className="app">
            <div className="header-wrapper">
                <Header title="订单填写" onBack={onBack} />
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
                    <span
                        style={{ display: 'block' }}
                        className="train-icon"
                    ></span>
                </Detail>
            </div>
            <Ticket price={price} type={seatType} />
            <Passengers passengers={passengers} {...passengersCbs} />
            {passengers.length > 0 && (
                <Choose passengers={passengers} {...chooseCbs} />
            )}
            <Account length={passengers.length} price={price} />
            <Menu show={isMenuVisible} {...menu} {...menuCbs} />
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
