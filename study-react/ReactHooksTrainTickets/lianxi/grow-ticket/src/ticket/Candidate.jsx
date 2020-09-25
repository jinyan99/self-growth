import React,{useState, useContext, memo, useMemo} from 'react'
import URI from 'urijs'
import dayjs from 'dayjs'
import {TrainContext} from './context'
import PropTypes from 'prop-types'
import './Candidate.css'
import { useCallback } from 'react'

//下面li组件hover出来的最小粒度组件Channel
const Channel = memo(function Channel(props)  {
    const {
        name,
        desc,
        type
    } = props
    const {
        trainNumber,
        departStation,
        arriveStation,
        departDate
    } = useContext(TrainContext)
    const src = useMemo(() => {
        return new URI('order.html')
            .setSearch('trainNumber', trainNumber)
            .setSearch('dStation', departStation)
            .setSearch('aStation', arriveStation)
            .setSearch('type', type)
            .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
            .toString()
    }, [type, trainNumber, departStation, arriveStation, departDate])
    console.log(src,'看看加工后的url路径')
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
    )
})
Channel.propTypes = {
    name: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};

//ul里的数据循环遍历出的 li组件
const Seat = memo(function Seat(props) {
    const {
        type,
        priceMsg,
        channels,
        expanded,
        onToggle,
        idx
    } = props
    console.log(idx,'看看idx值')
    return (
        <li>
            <div className="bar" onClick={() => onToggle(idx)}>
                <span className="seat">{type}</span>
                <span className="price">
                    <i>¥</i>
                    {priceMsg}
                </span>
                <span className="btn">{expanded ? '预定' : '收起'}</span>
                <span className="num"></span>
            </div>
            <div className="channels"
                style={{ height: expanded ? channels.length * 55 + 'px' : 0}}
            >
                {channels.map( channels => {
                    return (
                        <Channel {...channels} key={channels.name} type={type}/>
                    )
                })}
            </div>
        </li>
    )
})
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
function Candidate(props) {
    const { tickets} = props;
    console.log(tickets,'看tickets')
    //提供开关属性，标记哪个序号的Seat是应该打开的状态
    const [expandedIndex, setExpandedIndex] = useState(-1)
    const onToggle = useCallback(
        idx => {
            console.log('开始切换了')
            setExpandedIndex(idx === expandedIndex ? -1 : idx)
        },
        [expandedIndex]
    )
    return (
        <div className="candidate">
            <ul>
                {
                    tickets.map((ticket, idx) => {
                        return (
                            <Seat
                                idx={idx}
                                onToggle={onToggle}
                                expanded={expandedIndex === idx}
                                {...ticket}
                                key={ticket.type}
                            />
                        )
                    })
                }
            </ul>
        </div>
    )
}
Candidate.propTypes = {
    tickets: PropTypes.array.isRequired,
};
export default Candidate