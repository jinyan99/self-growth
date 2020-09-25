import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { h0 } from '../common/fp';
import Header from './Header.jsx';

import './DateSelector.css';

//一天组件，最小粒度组件
function Day(props) {
    //这个组件里要对day做判断，用样式来驱动各种判断情况
    const { day, onSelect } = props;
    //传过来的day经过补齐操作后他很有可能是空，所以在这判断下
    if (!day) {//如果是空的话渲染一个特殊的td
        return <td className="null"></td>;
    }

    const classes = [];
    //先获取到当天的一个零时刻
    const now = h0();
    //判断传进来的值是不是过去，若是过去，则往类名集合中添加一个
    if (day < now) {
        classes.push('disabled');
    }
    //判断周六或周日的话，王类名集合中push个样式，，牢记这种判断方法
    if ([6, 0].includes(new Date(day).getDay())) {
        classes.push('weekend');
    }
    //特殊的逻辑，判断是不是今天
    const dateString = now === day ? '今天' : new Date(day).getDate();

    return (
        <td className={classnames(classes)} onClick={() => onSelect(day)}>
            {dateString}
        </td>
    );
}

Day.propTypes = {
    day: PropTypes.number,
    onSelect: PropTypes.func.isRequired,
};
//一行的周组件(抽成组件，为了简便复用，若不复用的话，直接写在jsx里即可，因为多次用到才会拆成组件)
//一个周组件就是一个tr，最小粒度组件是 天 day，就是一个td。因为要多次重复渲染，抽成组件。
function Week(props) {
    //写这个组件时，也是先从子组件入手，考虑下这个需要接受什么参数，再父级的架子中，根据它需要传给它指定的参数
    const { days, onSelect } = props;
    //days应该是个数组
    return (
        <tr className="date-table-days">
            {days.map((day, idx) => {
                return <Day key={idx} day={day} onSelect={onSelect} />;
            })}
        </tr>
    );
}

Week.propTypes = {
    days: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
};

//月份组件---考虑到潜在的风险，先不要用memo优化
function Month(props) {
 //在这个组件中必须遍历到当前这个月的所有日期，然后以7天为一组渲染出来，也是以0时刻作为第一天。
 //那我们怎么获取到当前这个月的所有日期呢，有种简单的做法就是递增日期的date直到month进位。
    //这参数是代表这个月的第一天的零时刻，也就是说我要用第一天0时0分0秒来代表这个月。这就意味着我要获取到三个月
    //的每个月的第一天0时0分0秒。写这个组件时知道需要接受这个参数，可以跳去主组件把参数做好传好
    const { startingTimeInMonth, onSelect } = props;
    //onSelect是对Month是没意义的，只负责透传给下面的最小粒度组件
    //这两个变量为了做下面的遍历判断用
    const startDay = new Date(startingTimeInMonth);
    const currentDay = new Date(startingTimeInMonth);
    //这是当月所有日期的数组，数组里可能是30项一天的毫秒数，后面要根据这个所有日期数组遍历天组件
    let days = [];
    //牢记这种获取当月所有日期的遍历方式，利用递增date月份进位
            //这个时候可能while循环比for循环更适合，直接上条件判断，
    while (currentDay.getMonth() === startDay.getMonth()) {
        //只要条件相等就一直遍历下去。直到月份递增
        //每次遍历，都把当前这一天毫秒数记录下来，存到days数组中
        days.push(currentDay.getTime());
        //最后递增currentday的日期     这个➕1不会溢出，会自动月份递增
        currentDay.setDate(currentDay.getDate() + 1);
    }
    //这是前面的补齐操作-->要保证这里所有天数是7的倍数，否则没法对准表头的周几。所以要有前补位和后补位
    //   一般一个月跨5周，应该补齐到35天
    //当前页月的第一天是星期几，就补齐这个数字的减一个，比如星期三的话，就往前补齐2个
    //但有个例外，星期日的话我们必须要补齐6个。有了这个逻辑就好写每月的第一天会在星期中的任一天，左边补空位的逻辑
    days = new Array(startDay.getDay() ? startDay.getDay() - 1 : 6)
    //getDay返0-6，当返0时会被强转bool值为false，所以这个当为周日的特殊情况时，直接补6位
        .fill(null) //补位补空即可，es6的语法
        .concat(days);
    //这是后面的补齐操作：最后一天是星期几，我们就补齐7-这个数字。当然星期日除外，星期日是不需要补齐的
    const lastDay = new Date(days[days.length - 1]);
    days = days.concat(
        new Array(lastDay.getDay() ? 7 - lastDay.getDay() : 0).fill(null)
    );//这时就补齐35天了哈哈

   //最后把所有日期以周为单位进行分组，days补齐后数组的长度一定是7的倍数
   //接下来把一月35天，分放在5个周里，放在weeks一个数组里存起来,提供遍历给week组件用
    const weeks = [];
        for (let row = 0; row < days.length / 7; ++row) {
        const week = days.slice(row * 7, (row + 1) * 7);
        weeks.push(week);
    }
    //th与td作用一样，th一般是tr第一行自动加粗加黑。td是普通单元格
    return (
        <table className="date-table">
            <thead>
                <tr>
                    <td colSpan="7">
                        <h5>
                            {startDay.getFullYear()}年{startDay.getMonth() + 1}
                            月
                        </h5>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr className="data-table-weeks">
                    <th>周一</th>
                    <th>周二</th>
                    <th>周三</th>
                    <th>周四</th>
                    <th>周五</th>
                    <th className="weekend">周六</th>
                    <th className="weekend">周日</th>
                </tr>
                {weeks.map((week, idx) => {
                    return <Week key={idx} days={week} onSelect={onSelect} />;
                })}
            </tbody>
        </table>
    );
}

Month.propTypes = {
    startingTimeInMonth: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
};

export default function DateSelector(props) {
    //先从该组件视觉功能上想，接受什么数据，写完后在挂到主组件上，再依据字组件的要求，决定给他传什么数据
    //show参数来控制是否像最外层的div，加入一个hidden class，决定显不显示日期的开关状态
    const { show, onSelect, onBack } = props;

    const now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    now.setDate(1);
    //这是计算当前月的第一天的0时刻，作为参数透传下去，3个月的零时刻算出来都存进这个数组中
    //三个月第一天零时刻数组
    const monthSequence = [now.getTime()];
    //然后要计算下第二个月的0时刻，因为一个月的天数是不定的，所以不能简单的加31天
    //这里只用setMonth(now.getMonth +1) 即可
    //第二个月第1天零时刻
    now.setMonth(now.getMonth() + 1);
    monthSequence.push(now.getTime());
    
    //第三个月第一天零时刻，待存入数组
    now.setMonth(now.getMonth() + 1);
    monthSequence.push(now.getTime());
    //接下来按3个月零时刻遍历Mont组件，把三个月全部渲染出来，遍历出3个月组件显示。牢记既然是遍历的话就必须传入key
    return (
        <div className={classnames('date-selector', { hidden: !show })}>
            <Header title="日期选择" onBack={onBack} />
            <div className="date-selector-tables">
                {monthSequence.map(month => {
                    return (
                        <Month
                            key={month}
                            onSelect={onSelect}
                            startingTimeInMonth={month}
                        />
                    );
                })}
            </div>
        </div>
    );
}

DateSelector.propTypes = {
    show: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
};
