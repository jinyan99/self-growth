import React,{useMemo,memo} from 'react'
import PropTypes from 'prop-types'
import './Nav.css'
import classnames from 'classnames'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'


const Nav = memo(function Nav(props) {
    const {
        date,
        prev,
        next,
        isPrevDisabled,
        isNextDisabled
    } = props
    //console.log(dayjs(date).locale('zh-cn').format('ddd'),'看看dayjs用法')
    //用locale的zh-cn的格式化，就能显示出周几的汉字来了，不写本地话zh的话默认就是英文显示周几，也不是数字
    const currentString = useMemo(() => {
        const d = dayjs(date)
        return d.format('M月D日') + d.locale('zh-cn').format('ddd')
    }, [date])
    return (
        <div className="nav">
            <span
                onClick={prev}
                className={classnames('nav-prev', {
                    'nav-disabled': isPrevDisabled
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
    )
})
export default Nav
Nav.propTypes = {
    date: PropTypes.number.isRequired,
    prev: PropTypes.func.isRequired,
    next: PropTypes.func.isRequired,
    isPrevDisabled: PropTypes.bool.isRequired,
    isNextDisabled: PropTypes.bool.isRequired,
};