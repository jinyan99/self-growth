import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
//引入公共函数
import { h0 } from '../common/fp';
import dayjs from 'dayjs';
import './DepartDate.css';

export default function DepartDate(props) {
   //写这个组件，先想我们需要从props中取什么数据，时间及响应事件
    const { time, onClick } = props;
    //要把time所代表的时间戳转化成4位年份2位月份2位日期-----可以借助dayjs插件实现
    const h0OfDepart = h0(time);
    const departDate = new Date(h0OfDepart);
    //由于dayjs插件逻辑很复杂，所以必须得用useMemo优化
    const departDateString = useMemo(() => {
        return dayjs(h0OfDepart).format('YYYY-MM-DD');
    }, [h0OfDepart]);

    const isToday = h0OfDepart === h0();

    //星期的字符串格式化
    const weekString =
        '周' +
        ['日', '一', '二', '三', '四', '五', '六'][departDate.getDay()] +
        (isToday ? '(今天)' : '');

    return (
        <div className="depart-date" onClick={onClick}>
            {/* 注意表单控件隐藏域的作用，能方便的收集数据，又不显示在页面中，否则用div收集数据就脱离了app组件中form套整体的作用了，就单独收集数据附到请求参数就太麻烦了 */}
            <input type="hidden" name="date" value={departDateString} />
            {departDateString} <span className="depart-week">{weekString}</span>
        </div>
    );
}

DepartDate.propTypes = {
    time: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
};
