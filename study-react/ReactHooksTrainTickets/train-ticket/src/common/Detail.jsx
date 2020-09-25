import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';//dayjs的本地化星期几的格式
import './Detail.css';
//这个组件在ticket页面和order页面都能用到，所以把它写成了common公共组件下，由因为需要适用不同场景，所以将公共组件写成
//组件组合的props.children方式，插槽的逻辑，可以由不同场景的外面自定义传自定义的jsx标签。如可以往里传时刻表组件，也可以传图片等
function format(d) {
    //参数是个时间戳，处理成dayjs格式化
    const date = dayjs(d);

    return date.format('MM-DD') + ' ' + date.locale('zh-cn').format('ddd');
}

const Detail = memo(function Detail(props) {
    const {
        departDate,
        arriveDate,
        departTimeStr,
        arriveTimeStr,
        trainNumber,
        departStation,
        arriveStation,
        durationStr,
    } = props;

    const departDateStr = useMemo(() => format(departDate), [departDate]);
    const arriveDateStr = useMemo(() => format(arriveDate), [arriveDate]);
//为了让detail组件能使用两种场景，最直接方式就是让detail组件不去定义中间那部分视图而是由调用者去定义决定(如改造成props.children的方式)这就大大提高了复用性。
// 下面的40行改成了props.childrend的形式
    return (
        <div className="detail">{/* 容器层 */}
            <div className="content"> {/* 内容层 */}
                <div className="left">
                    <p className="city">{departStation}</p>
                    <p className="time">{departTimeStr}</p>
                    <p className="date">{departDateStr}</p>
                </div>
                <div className="middle">
                    <p className="train-name">{trainNumber}</p>
                    <p className="train-mid">{props.children}</p>
                    <p className="train-time">耗时{durationStr}</p>
                </div>
                <div className="right">
                    <p className="city">{arriveStation}</p>
                    <p className="time">{arriveTimeStr}</p>
                    <p className="date">{arriveDateStr}</p>
                </div>
            </div>
        </div>
    );
});

Detail.propTypes = {
    departDate: PropTypes.number.isRequired,
    arriveDate: PropTypes.number.isRequired,
    departTimeStr: PropTypes.string,
    arriveTimeStr: PropTypes.string,
    trainNumber: PropTypes.string.isRequired,
    departStation: PropTypes.string.isRequired,
    arriveStation: PropTypes.string.isRequired,
    durationStr: PropTypes.string,
};

export default Detail;
