import React from 'react';
import switchImg from './imgs/switch.svg';
import './Journey.css';

export default function Journey(props) {
    //第一步中应该从props取出想要的store负责管理的参数
    const { from, to, exchangeFromTo, showCitySelector } = props;

    return (
        <div className="journey">
            <div
                className="journey-station"
                onClick={() => showCitySelector(true)}
            >  {/* 左边div含始发站 */}
                <input
                    type="text"
                    readOnly
                    name="from"
                    value={from}
                    className="journey-input journey-from"
                />
            </div>
{/* 中间div含切换按钮的编写 ，还是用svg文件做图像7*/}
            <div className="journey-switch" onClick={() => exchangeFromTo()}>
                <img src={switchImg} width="70" height="40" alt="switch" />
            </div>

            <div
                className="journey-station"
                onClick={() => showCitySelector(false)}
            >   {/* 右边div含终点站 */}
                <input
                    type="text"
                    readOnly
                    name="to"
                    value={to}
                    className="journey-input journey-to"
                />
            </div>
        </div>
    );
}
