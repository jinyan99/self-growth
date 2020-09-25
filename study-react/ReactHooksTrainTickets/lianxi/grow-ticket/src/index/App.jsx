import React, { useCallback ,useMemo} from 'react'
import {connect} from 'react-redux'
import { h0 } from '../common/fp';
import Header from '../common/Header'
import DepartDate from './DepartDate'
import HighSpeed from './HighSpeed'
import Journey from './Journey'
import Submit from './Submit'
import DateSelector from '../common/DateSelector.jsx';
import {
    exchangeFromTo,
    showCitySelector,
    hideCitySelector,
    fetchCityData,
    setSelectedCity,
    showDateSelector,
    hideDateSelector,
    setDepartDate,
    toggleHighSpeed,
} from './actions';
import './App.css'
import { bindActionCreators } from 'redux'
import CitySelector from '../common/CitySelector'

//作为主组件，把一些回掉函数参数和状态值都写在主组件，
//依次透传给子组件的props中好处：
//    1-一些公共逻辑能复用地传给各种组件，就不用各组件自己定义了。
//    2-对于子组件来说，提高子组件的复用性脱欧性，子组件状态都🈶️用户来定义，很个性化。
function App(props) {
    const {  //高阶组件connect会把store管理状态数据传入当前组件的props中
        from,
        to,
        isCitySelectorVisible,
        isDateSelectorVisible,
        cityData,
        isLoadingCityData,
        highSpeed,
        dispatch,
        departDate,
    } = props;
    const onBack = useCallback(() => {
        console.log('点击back了')
        window.history.back()
    },[])
    const cbs = useMemo(() => {
        return bindActionCreators({
            exchangeFromTo,
            showCitySelector
        },
        dispatch
        )
    })
    const citySelectorCbs = useMemo(() => {
        return bindActionCreators({
            onBack: hideCitySelector,
            onSelect: setSelectedCity,
            fetchCityData
        },
            dispatch
        )
    }, [])
    const departDateCbs = useMemo(()=> {
        return bindActionCreators({
           onClick: showDateSelector
        },
        dispatch
        )
    },[])
    const highSpeedCbs = useMemo(()=> {
        return bindActionCreators({
            toggle: toggleHighSpeed,
        }, dispatch)
    } ,[])
    const onSelectDate = useCallback((day)=> {
        if (!day) {
            //若不存在
            return;
        }

        if (day < h0()) {
            //如果是过去的日期，则跳出
            return;
        }
        dispatch(setDepartDate(day));
        dispatch(hideDateSelector());
    })
    const dateSelectorCbs = useMemo(() => {
        return bindActionCreators({
            onBack: hideDateSelector
        },dispatch)
    }, [])
    return (
        <div className="app">
            <div className="header-wrapper">
            <Header title="火车票" onBack={onBack} />
            </div>
            <form action="./query.html" className="form">
                <Journey
                    from={from}
                    to={to}
                    {...cbs}
                />
                <DepartDate
                    time={departDate}
                    {...departDateCbs}
                />
                <HighSpeed
                    highSpeed={highSpeed}
                    {...highSpeedCbs}
                />
                <Submit/>
            </form>
            <CitySelector
                show={isCitySelectorVisible}
                cityData={cityData}
                {...citySelectorCbs}
            />
            <DateSelector
                show={isDateSelectorVisible}
               {...dateSelectorCbs}
                onSelect={onSelectDate}
            />
        </div>
    )
}
export default connect(
    function mapStateToProps(state) {
        return state
    } ,
    function mapDispatchToProps(dispatch) {
        return { dispatch };
    }
)(App);
//不写第二个参的，也会默认有dispatch方法的