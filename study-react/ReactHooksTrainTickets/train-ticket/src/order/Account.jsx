import React, { memo, useState } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import './Account.css';

const Account = memo(function Account(props) {
    const { price = 0, length } = props;
    //组件先想接受到的是能接受什么数据，票价和 乘客的数量
    //定义个状态来表示是否表示订单详情的
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="account">
            <div
                className={classnames('price', { expanded })}
                onClick={() => setExpanded(!expanded)}
            >
                <div className="money">{length * price}</div>
                <div className="amount">支付金额</div>
            </div>
            <div className="button">提交按钮</div>
            <div
                className={classnames('layer', { hidden: !expanded })}
                onClick={() => setExpanded(false)}
            ></div>
            <div className={classnames('detail', { hidden: !expanded })}>
                <div className="title">金额详情</div>
                <ul>
                    <li>
                        <span>火车票</span>
                        <span>￥{price}</span>
                        <span>&#xD7;{length}</span>
                    </li>
                </ul>
            </div>
        </div>
    );
});

Account.propTypes = {
    price: PropTypes.number,//price需要从后端的接口中获取，所以他不是必需的
    length: PropTypes.number.isRequired,
};

export default Account;
