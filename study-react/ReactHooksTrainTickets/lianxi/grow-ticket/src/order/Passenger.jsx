import React,{ useMemo, memo} from 'react'
import PropTypes from 'prop-types'
import './Passengers.css'



//最小力度组件---乘客信息填写模版组件Passenger组件-----严格遵循数据驱动思想
const Passenger = memo(function Passenger(props) {
    const {
        id,
        name,
      //  followAdultName,
        ticketType,
        //licenceNo,
       // gender,
       // birthday,
        onRemove,
        onUpdate,
        //showGenderMenu,
        //showFollowAdultMenu,
        showTicketTypeMenu
    } = props
    //展现车票类型的函数因为关联到store里的状态值，所以一定会有action参与其中
    //所以可以把传过来的回掉函数直接在actioncreator中定义即可----记住这种函数定义的方式，可以直接定义在actioncreator里。
    const isAdult = ticketType === 'adult'
    return (
        <li className="passenger">
            <i className="delete" onClick={() => onRemove(id)}>
                -
            </i>
            <ol className="items">
                <li className="item">
                    <label className="label name">姓名</label>
                    <input
                        type="text"
                        className="input name"
                        placeholder="乘客姓名"
                        value={name}
                        onChange={e => onUpdate(id, { name: e.target.value})}
                    />
                    <label
                        className="ticket-type"
                        onClick={() => showTicketTypeMenu(id)}
                    >
                        {isAdult ? '成人票' : '儿童票'}
                    </label>
                </li>
            </ol>
        </li>
    )
})
function Passengers(props) {
    const {
         passengers,
         createAdult,
         createChild,
         showTicketTypeMenu,
         updatePassenger,
         removePassenger
    } = props
    console.log(passengers,'看看乘客信息组件的乘客信息')
    return (
        <div className="passengers">
            <ul>
                {passengers.map( passenger => {
                    return <Passenger
                                {...passenger}
                                showTicketTypeMenu={showTicketTypeMenu}
                                onUpdate={updatePassenger}
                                onRemove={removePassenger}
                                key={passenger.id}
                           />
                })}
            </ul>
            <section className="add">
                <div className="adult" onClick={() => createAdult()}
                >添加成人</div>
                <div className="child" onClick={ () => createChild()}
                >添加儿童</div>
            </section>
        </div>
            )
}
export default Passengers