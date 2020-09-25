import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import URI from 'urijs';
import dayjs from 'dayjs';
import classnames from 'classnames';
import leftPad from 'left-pad';
import './Schedule.css';

//这个时刻表是怎样运作的？他在Schedule组件中时刻表一旦被唤起就会利用传入的props，来发起异步请求，对返回的时刻数据进行适当处理
//就会渲染出来。所以无论是时刻表组件还是里面的数据都是异步加载的

//最小粒度每一行复用组件----这个组件会能展现始发站到达站以及中间经过的车站，若始发站的化会变成红色图表额外显示
//全部都由传过来的状态值确定
const ScheduleRow = memo(function ScheduleRow(props) {
   //组件写之前，还是得先考虑需要从props中接受哪些数据
    const {
        index,//只是单纯的序号，遇到初始发站就换成红色图表
        station,//车站名
        arriveTime, //到达时间
        departTime, //出发时间
        stay, //停留时间
//上面是4条基本文案信息，下面是6条辅助性额外信息
        isStartStation, //是否是始发站
        isEndStation, //是否是终到站
        isDepartStation,//是否是行程的出发车站
        isArriveStation, //是否是形程的终点站
        beforeDepartStation, //是否在出发站之前
        afterArriveStation, //是否在到达站之后
    } = props;
//逻辑判断值都是由字段布尔值来判断是换类名还是换jsx标签的现实还是换文本值。
    return (
        <li>
            <div
                className={classnames('icon', {
                    'icon-red': isDepartStation || isArriveStation,
                })}
            >   {/* 红色小图标的出现 */}
                {isDepartStation
                    ? '出'
                    : isArriveStation
                    ? '到'
                    : leftPad(index, 2, 0)}
                    {/* 补成2位，补0 */}
            </div>
            <div
                className={classnames('row', {//判断什么时候变成灰色
                    grey: beforeDepartStation || afterArriveStation,
                })}
            >
                <span
                    className={classnames('station', {
                        red: isArriveStation || isDepartStation,
                    })}
                >
                    {station}
                </span>
                <span
                    className={classnames('arrtime', {
                        red: isArriveStation,
                    })}
                    /* 列车是始发站的话会显示黑色汉字 ，如果是旅程的终到站的话显示红色时间，其他显示正常的黑色时间*/
                >
                    {isStartStation ? '始发站' : arriveTime}
                </span>
                <span   
                /* 发车时间那列，如果是 出发车站的话他的文案是红色的，如果是整趟列车终到站的话会显示汉字终到站。*/
                    className={classnames('deptime', {
                        red: isDepartStation,
                    })}
                >
                    {isEndStation ? '终到站' : departTime}
                </span>
                <span className="stoptime">
                    {/* 停留时间也有两个特莉 如果是整趟列车的始发站或终到站的话直接显示 - ，否则显示stay分*/}
                    {isStartStation || isEndStation ? '-' : stay + '分'}
                </span>
            </div>
        </li>
    );
});
ScheduleRow.propTypes = {};








//主要组件 Schedule组件
const Schedule = memo(function Schedule(props) {
    const { date, trainNumber, departStation, arriveStation } = props;
    //时刻表的数据内部存储状态值，用于未来异步请求存放的地方，来渲染最小粒度scheduleRow组件
    const [scheduleList, setScheduleList] = useState([]);
    //必须使用副作用发起异步请求
    useEffect(() => {
        const url = new URI('/rest/schedule')
            .setSearch('trainNumber', trainNumber)
            .setSearch('departStation', departStation)
            .setSearch('arriveStation', arriveStation)
            .setSearch('date', dayjs(date).format('YYYY-MM-DD'))
            .toString(); //返回字符串格式的url
        fetch(url)
            .then(response => response.json())
            .then(data => {
//这返回的data数据数组里的每个对象项是本次列车的起点站到终点站之间经过的所有车站，
//都是通过数组返回出来的。数组里的项不是按顺序的，所以我们得自己在for循环里判断
//下面逻辑判断每个站是不是用户选的 始发站是不是起始点站往对象项里 加对应的状态判断开关值，
//这样一来让(最小粒度组件)子组件根据设好的开关判断值决定是否显示样式展现。
                let departRow;//先声明出发车站
                let arriveRow; //再声明到达车站
//循环外层定义两变量的方式，来通过每次循环时都判断这两个变量是否是真假，为真的化，则就已经找到出发到达站了，再遍历到的就是到达之后的站了
//下面这个循环中加的4层判断逻辑，完全是为了归纳出最小力度的组件的状态值。来给最小粒度决定是否按需显示各种显示。
                for (let i = 0; i < data.length; ++i) {
                    if (!departRow) {//如果没找到出发车站的话，要么当前车站就是出发车站要么就在出发车站之前
                        if (data[i].station === departStation) {
                            departRow = Object.assign(data[i], {
                                beforeDepartStation: false,
                                isDepartStation: true, //如果当前车站是出发车战的化给这个属性为true。让子组件通过这个属性判断显示红色图案。
                                afterArriveStation: false,
                                isArriveStation: false,
                            });
                        } else { //如果当前车站不是出发车站的话，他一定在出发车站之前
                            Object.assign(data[i], {
                                beforeDepartStation: true,
                                isDepartStation: false,
                                afterArriveStation: false,
                                isArriveStation: false,
                            });
                        }
                    } else if (!arriveRow) {//如果找到了出发车站但是还没有找到到达车站的话，也有2个可能：当前车站就是到达车站或者当前车站在出发车站和到达车站之间
                        if (data[i].station === arriveStation) {
                            arriveRow = Object.assign(data[i], {
                                beforeDepartStation: false,
                                isDepartStation: false,
                                afterArriveStation: false,
                                isArriveStation: true,
                            });
                        } else {//他一定是中途经过的车站，他的每一个属性都是fasle
                            Object.assign(data[i], {
                                beforeDepartStation: false,
                                isDepartStation: false,
                                afterArriveStation: false,
                                isArriveStation: false,
                            });
                        }
                    } else { //如过找到了出发车站也找到了到达车站，那么一定是在到达车站之后的。
                        Object.assign(data[i], {
                            beforeDepartStation: false,
                            isDepartStation: false,
                            afterArriveStation: true,
                            isArriveStation: false,
                        });
                    }

                    Object.assign(data[i], {//判断是否是始发站是否是终到站，本次列车的起点和终点，对应上也加对应的状态值开关
                        isStartStation: i === 0,
                        isEndStation: i === data.length - 1,
                    });
                }

                setScheduleList(data);
            });
    }, [date, trainNumber, departStation, arriveStation]);

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
                        );
                    })}
                </ul>
            </div>
        </div>
    );
});

Schedule.propTypes = {
    date: PropTypes.number.isRequired,
    trainNumber: PropTypes.string.isRequired,
    departStation: PropTypes.string.isRequired,
    arriveStation: PropTypes.string.isRequired,
};

export default Schedule;
