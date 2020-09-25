import React, { memo, useState, useCallback, useContext, useMemo } from 'react';
import URI from 'urijs';
import dayjs from 'dayjs';
import { TrainContext } from './context';
import PropTypes from 'prop-types';
import './Candidate.css';

const Channel = memo(function Channel(props) {
    const { name, desc, type } = props;
    //下面请求URl的参数暂时都处于store中，暂时获取不到由于channel这个组件嵌套层级比较深
    //如果一步步传递的话，会非常麻烦，使用useContext完美解决，可以把这些属性从App组件中一直传递到Channel中
    //要实现这功能，得在ticket目录下建个context.js文件，然后在Appjsx文件中使用生产者在这使用消费者
    //在函数组件中由于useContext的存在就不用使用consummer了。
    const {
        trainNumber,
        departStation,
        arriveStation,
        departDate,
    } = useContext(TrainContext);

    const src = useMemo(() => {
        return new URI('order.html')
            .setSearch('trainNumber', trainNumber)
            .setSearch('dStation', departStation)
            .setSearch('aStation', arriveStation)
            .setSearch('type', type)
            .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
            .toString();
    }, [type, trainNumber, departStation, arriveStation, departDate]);

    return (
        <div className="channel">
            <div className="middle">
                <div className="name">{name}</div>
                <div className="desc">{desc}</div>
            </div>
            <a href={src} className="buy-wrapper">
                <div className="buy">买票</div>
            </a>
        </div>
    );
});

Channel.propTypes = {
    name: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};

const Seat = memo(function Seat(props) {
    const {
        type,
        priceMsg,
        ticketsLeft,
        channels,//渠道，是个数组，用于内存循环
        expanded, //新增加这个变量，是个bool值，当为true的时候会把出票渠道显示出来否则就隐藏渠道
        onToggle,
        idx,
    } = props;
//传过来的expanded是结果：开关值，直接就能控制显示的
//传过来的toggle，是切换的，改变toggle值的。
    return (
        <li>
            <div className="bar" onClick={() => onToggle(idx)}>
                <span className="seat">{type}</span>
                <span className="price">
                    <i>￥</i>
                    {priceMsg}
                </span>
                <span className="btn">{expanded ? '预订' : '收起'}</span>
                <span className="num">{ticketsLeft}</span>
            </div>
            <div
                className="channels"
                style={{ height: expanded ? channels.length * 55 + 'px' : 0 }}
            >
                {channels.map(channel => {
                    return (
                        <Channel key={channel.name} {...channel} type={type} />
                    );
                })}
            </div>
        </li>
    );
});

Seat.propTypes = {
    type: PropTypes.string.isRequired,
    priceMsg: PropTypes.string.isRequired,
    ticketsLeft: PropTypes.string.isRequired,
    channels: PropTypes.array.isRequired,
    expanded: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    idx: PropTypes.number.isRequired,
};



//这个组件用react嵌套技术写了个百叶窗的功能，类似hover的效果
//总体上需要一个useState状态值
//两个关键点：一个改变开关值的操作(如onToggle函数setExpandedIndex(idx === expandedIndex ? -1 : idx))
//         +
//          一个每项的开关值决定的效果
//          (如下面传给Seat组件的expandedIndex === idx的判定)
const Candidate = memo(function Candidate(props) {
    //这个组件是2层循环的实现
    const { tickets } = props;
    //为了给Seat组件提供了expanded开关属性，我们在Candisate组件使用useState来声明本地的状态，对标记哪个序号的Seat是应该打开的状态
    const [expandedIndex, setExpandedIndex] = useState(-1);
    //然后114行传入这个属性
    //这个函数是用来点击切换效果
    const onToggle = useCallback(
        idx => {
            setExpandedIndex(idx === expandedIndex ? -1 : idx);
        },
        [expandedIndex]
    );

    return (
        <div className="candidate">
            <ul>
                {tickets.map((ticket, idx) => {
                    return (
                        <Seat
                            idx={idx}
                            onToggle={onToggle}
                            expanded={expandedIndex === idx}
                            {...ticket}
                            key={ticket.type}
                        />
                    );
                })}
            </ul>
        </div>
    );
});

Candidate.propTypes = {
    tickets: PropTypes.array.isRequired,
};

export default Candidate;
