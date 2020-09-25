import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import { h0 } from '../common/fp'
import Header from './Header.jsx'
import './DateSelector.css'

//一天组件，最小粒度组件
function Day(props) {
    const {date,onSelect} = props;
    if(!date) {
        return <td className="null" ></td>
    }
    const classes = []
    const now = h0()
    if(date < now) {
        classes.push("disabled")
    }
    if([6, 0].includes(new Date(date).getDay())) {
        classes.push('weekend')
    }
    const dateString = now === date ? '今天' : new Date(date).getDate()
    return (
        <td className={classnames(classes)} onClick={()=> onSelect(date)}>
            {dateString}
        </td>
    )
}
function Week(props) {
    const {dates, onSelect} = props;
    return(
        <tr className="date-table-days">
            {dates.map((date,idx) => {
                return <Day key={idx} date={date} onSelect={onSelect}/>
            })}
        </tr>
    )
}

//月份组件
function Month(props) {
    //先想接受什么数据
    const {startingTimeInMonth, onSelect} = props;

    const startDay = new Date(startingTimeInMonth)
    const currentDay = new Date(startingTimeInMonth)
    //当月所有天组件
    let dates = [];
    while(currentDay.getMonth() === startDay.getMonth()) {
        dates.push(currentDay.getTime())
        currentDay.setDate(currentDay.getDate() + 1)
    }
    //要补位，是7的倍数，一般一个月跨5周，应该补齐到35天
    //前补位
    dates = new Array(startDay.getDay() ? startDay.getDay() - 1 : 6)
            .fill(null)
            .concat(dates);
    //后补位
    const lastDay = new Date(dates[dates.length - 1])
    dates = dates.concat(new Array(lastDay.getDay() ? 7-lastDay.getDay() : 0)
        .fill(null))
    //接下来把一月35天，分放在5个周里，放在weeks一个数组里存起来
    const weeks = [];
    for(let row=0; row < dates.length/7; ++row) {
        const week = dates.slice(row * 7, (row + 1) * 7);
        weeks.push(week)
    }
    return (
        <table className="date-table">
            <thead>
                <tr>
                    <td colSpan="7">
                        <h5>
                            {startDay.getFullYear()}年{startDay.getMonth() + 1}
                            月
                        </h5>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr className="data-table-weeks">
                    <th>周一</th>
                    <th>周二</th>
                    <th>周三</th>
                    <th>周四</th>
                    <th>周五</th>
                    <th className="weekend">周六</th>
                    <th className="weekend">周日</th>
                </tr>
                {weeks.map((week, index) => {
                    return <Week key={index} dates={week} onSelect={onSelect}></Week>
                })}
            </tbody>
        </table>
    )
}


//主组件
export default function DateSelector(props) {
    const { show, onSelect, onBack} = props;
    //当月第一天
    const now = new Date();
    now.setHours(0)
    now.setMinutes(0)
    now.setSeconds(0)
    now.setMilliseconds(0)
    now.setDate(1) //现在当月第一天毫秒数
    //三个月第一天零时刻数组
    const monthSequence = [now.getTime()]
    //第二个月第一天零时刻毫秒数
    now.setMonth(now.getMonth() + 1);
    monthSequence.push(now.getTime())
    //第3个月第一天零时刻时间戳
    now.setMonth(now.getMonth() + 1)
    monthSequence.push(now.getTime())
    //按3个月零时靠遍历Month月份组件
    return (
        <div className={classnames('date-selector', {hidden: !show})}>
            <Header title="日期选择" onBack={onBack} />
            <div className="date-selector-tables">
                {
                    monthSequence.map(month => {
                        return (
                            <Month
                                key = {month}
                                startingTimeInMonth={month}
                                onSelect={onSelect}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}
DateSelector.propTypes = {
    show: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
};