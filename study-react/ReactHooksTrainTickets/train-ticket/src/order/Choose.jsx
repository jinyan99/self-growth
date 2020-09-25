import React, { memo } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import './Choose.css';
//Choose这个组件至少需要两个传入属性，一个是所有的乘客列表passengers。另一个是修改乘客属性的方法updatepassenger。
//先从props中解构出来
const Choose = memo(function Choose(props) {
    const { passengers, updatePassenger } = props;
//创建这个函数，传的seatType它的所有的取值abcdef等5个可能的值
    function createSeat(seatType) {
        return (
            <div>
                {/* 里面就开始遍历passengers获取到每个乘客，对于每个乘客渲染个p元素
                然后每个座位都有两部分构成，图是一样的只是切换颜色不同，用点击事件来切换他的颜色 
                这张图由iconfont来实现，他的码值是&#xe02d;,还有部分是里面的字母显示，我们用data-text属性来
                表示，这个属性的原理是css的规则，css文件里有个content属性，属性值是attr(data-text)函数，jsx
                中一设置这个属性值，就会显示处字母嵌里面*/}
                {passengers.map(passenger => {
                    return (
                        <p
                            key={passenger.id}
                            className={classnames('seat', {
                                active: passenger.seat === seatType,
                            })}
                            data-text={seatType}
                            onClick={() =>
                                updatePassenger(passenger.id, {
                                    seat: seatType,
                                })
                            }
                        >
                            &#xe02d;
                        </p>
                    );
                })}
            </div>
        );
//使用内部函数来创建jsx在性能上是有缺陷的，原因待查 可以尝试来改造下。
    }

    return (
        <div className="choose">
            <p className="tip">在线选座</p>
            <div className="container">
                <div className="seats">
                    <div>窗</div>
                    {createSeat('A')}
                    {createSeat('B')}
                    {createSeat('C')}
                    <div>过道</div>
                    {createSeat('D')}
                    {createSeat('F')}
                    <div>窗</div>
                </div>
            </div>
        </div>
    );
});

Choose.propTypes = {
    passengers: PropTypes.array.isRequired,
    updatePassenger: PropTypes.func.isRequired,
};

export default Choose;
