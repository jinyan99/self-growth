import React from 'react';
import switchImg from './imgs/switch.svg';

import './Journey.css'

function Journey(props) {
    const {
        from,
        to,
        exchangeFromTo,//这个就是提交的切换from和to的奏折
        showCitySelector
    } = props;
    console.log(from,'看看from值')
    return <div className="journey">
        <div
            className="journey-station"
            onClick={()=> showCitySelector(true)}
        >
                <input
                    type="text"
                    readOnly
                    name="from"
                    value={from}
                    className="journey-input journey-from"
                />
        </div>
        {/* 中间按钮 */}
        <div className="journey-switch" onClick={()=> exchangeFromTo()}>
        <img src={switchImg} width="70" height="40" alt="switch" />
        </div>
        <div
            className="journey-station"
            onClick={()=> showCitySelector(false)}
        >
            <input
                type="text"
                readOnly
                name="to"
                value={to}
                className="journey-input journey-to"
            ></input>
        </div>
    </div>
}
export default Journey;