import React, { useMemo} from 'react'
import PropTypes from 'prop-types'
//引入公共函数
import {h0} from '../common/fp'
import dayjs from 'dayjs'
import './DepartDate.css'
function DepartDate(props) {
    const {time,onClick} = props;
    const hoOfDepart = h0(time)
    const departDate = new Date(hoOfDepart)
    const departDateString = useMemo(()=> {
        return dayjs(hoOfDepart).format('YYYY-MM-DD');
    }, [hoOfDepart])
    const isToday = hoOfDepart === h0()
    //星期的字符穿格式化
    const weekString =
        '周' +
        ['日', '一', '二', '三', '四', '五', '六'][departDate.getDay()] +
        (isToday ? '(今天)' : '')
    return (<div className="depart-date" onClick={onClick}>
       <input type="hidden" name="date" value={departDateString}/>
{departDateString} <span className="depart-week">{weekString}</span>
    </div>)
}
DepartDate.propTypes = {
    time: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
};
export default DepartDate;
