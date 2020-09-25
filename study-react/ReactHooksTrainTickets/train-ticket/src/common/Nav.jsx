import React, { useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import dayjs from 'dayjs';
//导入中文的locale文件，用来格式化中文的星期几的。
import 'dayjs/locale/zh-cn';
import './Nav.css';


//观察整个组件，除了props没使用额外的数据来源，所以我们用memo优化组件，
const Nav = memo(function Nav(props) {
    //先想车次列表的日期导航，需要接受什么参数，经验而知，需要5个参数，包括是否禁点前天和后天的状态是bool值，组件里能直接
    //通过一个bool值就能确定当前前一后一的jsx样式是否是禁点的样式，禁点状态值由上级计算透传过来
    const { date, prev, next, isPrevDisabled, isNextDisabled } = props;
    //传的
    const currentString = useMemo(() => {
        const d = dayjs(date);
        //引了上面的locale后，就可以用他来格式化 ‘ddd’就是星期格式的意思
        //console.log(dayjs(date).locale('zh-cn').format('ddd'),'看看dayjs用法')
        //用locale的zh-cn的格式化，就能显示出周几的汉字来了，若不写本地化，默认就会出英文单词的周几来，也不是原生的数字显示一周的第几天
        return d.format('M月D日 ') + d.locale('zh-cn').format('ddd');
    }, [date]);

    return (
        <div className="nav">
            <span
                onClick={prev}
                className={classnames('nav-prev', {
                    'nav-disabled': isPrevDisabled,
                })}
            >
                前一天
            </span>
            <span className="nav-current">{currentString}</span>
            <span
                onClick={next}
                className={classnames('nav-next', {
                    'nav-disabled': isNextDisabled,
                })}
            >
                后一天
            </span>
        </div>
    );
});

export default Nav;

Nav.propTypes = {
    date: PropTypes.number.isRequired,
    prev: PropTypes.func.isRequired,
    next: PropTypes.func.isRequired,
    isPrevDisabled: PropTypes.bool.isRequired,
    isNextDisabled: PropTypes.bool.isRequired,
};
