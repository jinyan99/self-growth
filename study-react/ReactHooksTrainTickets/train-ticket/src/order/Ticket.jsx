import React, { memo } from 'react';
import PropTypes from 'prop-types';
import './Ticket.css';

//组件里，需要由外界传的参数决定显示的值，必须由props接受，固定显示的是坐席两字
const Ticket = memo(function Ticket(props) {
    const { price, type } = props;
    return (
        <div className="ticket">
            <p>
                <span className="ticket-type">{type}</span>
                <span className="ticket-price">{price}</span>
            </p>
            <div className="label">坐席</div>
        </div>
    );
});

Ticket.propTypes = {
//下面是新方法，price有两种值可选，可以字符串可以数字。利用oneOfType方法传入个数组，数组中是多可选的类型。
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string.isRequired,
};

export default Ticket;
