import React, { memo, useMemo } from 'react';
import URI from 'urijs';
import PropTypes from 'prop-types';
import './List.css';
//列表渲染的最小粒度组件，可以接受很多参数用来每行里都显示什么数据.
//每行的结构，分为4列即4个span，每列是块数据显示，外层都由a包着，
//由视觉图上想要接受什么数据，基本上一个这个组件上的4列所有数据都要由props挨个传过来，至少8个数据，
//有个时间+1第二天的展示，这块就由个布尔值状态来决定显示
const ListItem = memo(function ListItem(props) {
    const {
        dTime,
        aTime,
        dStation,
        aStation,
        trainNumber,
        date,
        time,
        priceMsg,//加个字符串表示
        dayAfter,//是否跨越日期的标记
    } = props;

    const url = useMemo(() => {
        //利用URI库，设置url参数的url链接地址，作为点击条目去跳转的地址
        return new URI('ticket.html')
            .setSearch('aStation', aStation)
            .setSearch('dStation', dStation)
            .setSearch('trainNumber', trainNumber)
            .setSearch('date', date)
            .toString(); //转化为字符串
    }, [aStation, dStation, trainNumber, date]);
    //下面的li由于是可点击的，所以我们包裹一层a标签
    return (
        <li className="list-item">
            <a href={url}>
                <span className="item-time">
                    <em>{dTime}</em>
                    <br />
                    <em className="em-light">
                        {aTime} <i className="time-after">{dayAfter}</i>
                    </em>
                </span>
                <span className="item-stations">
                    <em>
                        <i className="train-station train-start">始</i>
                        {dStation}
                    </em>
                    <br />
                    <em className="em-light">
                        <i className="train-station train-end">终</i>
                        {aStation}
                    </em>
                </span>
                <span className="item-train">
                    <em>{trainNumber}</em>
                    <br />
                    <em className="em-light">{time}</em>
                </span>
                <span className="item-ticket">
                    <em>{priceMsg}</em>
                    <br />
                    <em className="em-light-orange">可抢票</em>
                </span>
            </a>
        </li>
    );
});

ListItem.propTypes = {
    dTime: PropTypes.string.isRequired,
    aTime: PropTypes.string.isRequired,
    dStation: PropTypes.string.isRequired,
    aStation: PropTypes.string.isRequired,
    trainNumber: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    priceMsg: PropTypes.string.isRequired,
    dayAfter: PropTypes.string.isRequired,
};

const List = memo(function List(props) {
  //数组格式的list，代表需要的全部数据
    const { list } = props;

    return (
        <ul className="list">
            {list.map(item => (
                <ListItem {...item} key={item.trainNumber} />
            ))}
        </ul>
    );
});

List.propTypes = {
    list: PropTypes.array.isRequired,
};

export default List;
