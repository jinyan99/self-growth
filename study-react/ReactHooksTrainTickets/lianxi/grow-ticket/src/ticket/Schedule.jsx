import React, {memo, useState,useEffect} from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'
import dayjs from 'dayjs'
import classnames from 'classnames'
import leftPad from 'left-pad'
import './Schedule.css'

//最小粒度组件
//最小粒度每一行复用组件----这个组件会能展现始发站到达站以及中间经过的车站，若始发站的化会变成红色图表额外显示
//全部都有传过来的状态值确定
const ScheduleRow = memo(function ScheduleRow(props) {
    const {
        index,
        isDepartStation,
        isArriveStation,
        station,
        stay,
        isStartStation,
        arriveTime,
        isEndStation,
        departTime,
        beforeDepartStation,
        afterArriveStation
    } = props;
    return (
        <li>
            <div
                className={classnames('icon', {
                    'icon-red': isDepartStation || isArriveStation,
                })}
            >{/* 红色小图标 */}
                {isDepartStation
                    ? '出 '
                    : isArriveStation
                    ? '到'
                    : leftPad(index, 2, 0)}
            </div>
            <div
                className={classnames('row', {
                    grey: beforeDepartStation || afterArriveStation
                })}
            >
                <span
                    className={classnames('station', {
                        red: isArriveStation || isDepartStation
                    })}
                >
                    {station}
                </span>
                <span
                    className={classnames('arrtime', {
                        red: isArriveStation
                    })}
                >
                    {isStartStation ? '始发站' : arriveTime}
                </span>
                <span
                    className={classnames('deptime', {
                        red: isDepartStation
                    })}
                >
                    {isEndStation ? '终到站' : departTime}
                </span>
                <span className="stoptime">
                    {isStartStation || isEndStation ? '-' : stay + '分'}
                </span>
            </div>
        </li>
    )
})
const Schedule = memo(function Schedule(props) {
    const {
        date,
        trainNumber,
        departStation,
        arriveStation
    } = props
    const [scheduleList, setScheduleList] = useState([])
    //必须使用副作用发起异步请求
    useEffect(() => {
        const url = new URI('/rest/schedule')
                .setSearch('trainNumber', trainNumber)
                .setSearch('departStation', departStation)
                .setSearch('arriveStation', arriveStation)
                .setSearch('data', dayjs(date).format('YYYY-MM-DD'))
                .toString()
        fetch(url)
            .then(response => response.json())
            .then(data => {
//这返回的data数据数组里的每个对象项是本次列车的起点站到终点站之间经过的所有车站，
//都是通过数组返回出来的。数组里的项不是按顺序的，所以我们得自己在for循环里判断
//下面逻辑判断每个站是不是用户选的 始发站是不是起始点站往对象项里 加对应的状态判断开关值，
//这样一来让(最小粒度组件)子组件根据设好的开关判断值决定是否显示样式展现。                
                //循环外层定义了两个变量，来通过每次循环时都判断这两个变量是否是真假，为真的化，则就已经找到出发到达站了，再遍历到的就是到达之后的站了
                let departRow,//出发车站
                    arriveRow; //到达车站
                console.log(data,'看请求过来的data值')
                for( let i = 0; i < data.length; ++i) {
                    if(!departRow) {
                       if(data[i].station === departStation) {
                            departRow = Object.assign(data[i], {
                                beforeDepartStation: false,
                                isDepartStation: true,
                                afterArriveStation: false,
                                isArriveStation: false
                            })
                       } else { 
                            console.log('当前不是出发车战')
                            Object.assign(data[i] , {
                                beforeDepartStation: true,
                                isDepartStation: false,
                                afterArriveStation: false,
                                isArriveStation: false
                            })
                       }
                    } else if (!arriveRow) {//两种可能，是到达车站或不是到达车站是中间经过的车站，赋予各自不同的属性
                        if(data[i].station === arriveStation) {
                            arriveRow = Object.assign(data[i], {
                                beforeDepartStation: false,
                                isDepartStation: false,
                                afterArriveStation: false,
                                isArriveStation:true
                            })
                        }
                        else {//不是到达车站
                            Object.assign(data[i], {
                                beforeDepartStation: false,
                                isDepartStation: false,
                                afterArriveStation:false,
                                isArriveStation: false
                            })
                        }
                    } else {//找到了出发到达车站后，这一定是到达车站后的车站
                        Object.assign(data[i], {
                            beforeDepartStation: false,
                            isDepartStation: false,
                            afterArriveStation: true, //到达站之后的站，设为true，供子组件逻辑显示
                            isArriveStation:false
                        })
                    }
                    Object.assign(data[i], {
                        isStartStation: i === 0,
                        isEndStation: i === data.length - 1
                    })
                }
                setScheduleList(data)
            })
    },[date, trainNumber, departStation, arriveStation])
    return (
        <div className="schedule">
            <div className="dialog">
                <h1>列车时刻表</h1>
                <div className="head">
                    <span className="station">车站</span>
                    <span className="deptime">到达</span>
                    <span className="arrtime">发车</span>
                    <span className="stoptime">停留时间</span>
                </div>
                <ul>
                    {scheduleList.map((schedule, index) => {
                        return (
                            <ScheduleRow
                                key={schedule.station}
                                index={index + 1}
                                {...schedule}
                            />
                        )
                    })}
                </ul>
            </div>
        </div>
    )
})
export default Schedule