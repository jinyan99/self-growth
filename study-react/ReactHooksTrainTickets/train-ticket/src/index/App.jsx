import React, { useCallback, useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './App.css';
//引入各个组件公共组件个私有组件
import Header from '../common/Header.jsx';
import DepartDate from './DepartDate.jsx';
import HighSpeed from './HighSpeed.jsx';
import Journey from './Journey.jsx';
import Submit from './Submit.jsx';

import CitySelector from '../common/CitySelector.jsx';
import DateSelector from '../common/DateSelector.jsx';

import { h0 } from '../common/fp';

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
    //onback的事件回掉函数，应该用usecallback起来，防止每次渲染app都触发header组件的无用更新
    const onBack = useCallback(() => {
        window.history.back();
    }, []);
//用bindActionCreators可以批量使用actioncreator函数dispatch绑定在一起，传给组件就方便多了
//很遗憾bindActionCreator每次都返回新的函数集合，和我们的usecallback目标是冲突的，我们还是可以变通下
//怎么变通？引入useMemo，和import {bindActionCretors} from 'redux'
//引完后声明个全新的变量，代表所有的callback集合。然后将cbs传给Journey组件中。
    const cbs = useMemo(() => {
        return bindActionCreators(
            {
                exchangeFromTo,
                showCitySelector,
            },
            dispatch
        );
    }, []);

    const citySelectorCbs = useMemo(() => {
        return bindActionCreators(
            {
                onBack: hideCitySelector,
                fetchCityData, //添加fetchCityData异步获取数据
                onSelect: setSelectedCity,
            },
            dispatch
        );
    }, []);

    const departDateCbs = useMemo(() => {
        return bindActionCreators(
            {
                onClick: showDateSelector,
            },
            dispatch
        );
    }, []);

    const dateSelectorCbs = useMemo(() => {
        return bindActionCreators(
            {
                onBack: hideDateSelector,
            },
            dispatch
        );
    }, []);

    const highSpeedCbs = useMemo(() => {
        return bindActionCreators(
            {
                toggle: toggleHighSpeed,
            },
            dispatch
        );
    }, []);
    //日期浮层需要透传的点击选中回掉函数，参数day是被选中日期的零时刻
    const onSelectDate = useCallback(day => {
        if (!day) {
            //若不存在
            return;
        }

        if (day < h0()) {
            //如果是过去的日期，则跳出
            return;
        }
        //最后在派发action
        dispatch(setDepartDate(day));
        dispatch(hideDateSelector());
    }, []);

    return (
        <div>
            <div className="header-wrapper">
                <Header title="火车票" onBack={onBack} /> {/* 传入这两个参数 */}
            </div>
            {/* 数据都要由form表单来提交 ---记住这种写法，不管里面嵌套的什么组件，只要里面的jsx里面
            有表单控件input之类的，在这外层就可以用form来包裹住,form表单默认是get提交方式
            这个提交地址是ajax一样，可以是任意类型的地址文件，可以是服务器的路由接口，也可以是服务器上的文件返回个xml文件，
            也可以是本地的json文件的呢等等返回文件内容，若接口返回对应数据。
            --下面利用这种方式来切换多页面应用(按public目录多页面打包的，所以./queryhtml是存在的，只是不多打包的化，
                webpack就不会同时打包多套代码到public里各自对应的html文件root上)，
            首页切换到搜索结果页，过去的请求参数可以从那页的url中获取数据，spa的化切换页面可以利用路由切换
            */}
            <form action="./query.html" className="form">
                <Journey from={from} to={to} {...cbs} />
                <DepartDate time={departDate} {...departDateCbs} />
                <HighSpeed highSpeed={highSpeed} {...highSpeedCbs} />
                <Submit />
            </form>
            <CitySelector
                show={isCitySelectorVisible}
                cityData={cityData}
                isLoading={isLoadingCityData}
                {...citySelectorCbs}
            />
            {/* bindactioncreator的使用时机：store状态值显示的是直接props中传过去即可，
                    当actioncreator的话，直接需要放到bindationcreator包装下，透传袭下去 */}
            <DateSelector
                show={isDateSelectorVisible}
                {...dateSelectorCbs}
                onSelect={onSelectDate}
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
