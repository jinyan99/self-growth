import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import './Passengers.css';
//这个组件分两部分，上面是所有乘客信息渲染出来，下面是两个固定的按钮。基于这个结构设计jsx
//下面两个按钮，添加成人和添加儿童分别是两个不同的组件及内容，我们用特殊的actioncretor来实现这两个不同的操作
//打开action.js,创建两个新的creator函数。一个成人的actioncreator和一个儿童的actioncretor，然后把这两个actioncreator从App组件中
//导入进去。，然后把他们在App中和dispatch绑定在一起，绑定完之后传递给passengers组件。传完后，在本组件的两个按钮的点击响应事件处理程序中
//就可以直接调用过来的createAdult和createChild强化后的actioncreator了
/* 添加新的乘客的前提是 已经创建的乘客信息都已经是完整填写的只要有一个字段为空就不允许添加下一个乘客，
添加儿童就更加严格了就得必须检查是否已经存在成人乘客了，没有的话就不允许添加儿童乘客。
    所以基于上面的设定，得对actioncreator再好好改造下。
*/

//添加乘客信息填写的模版，应高作为组件抽离出来，坚决遵照数据驱动的思想，由store数据map出来。
//store数据一变化，乘客信息列表模版也自动变化了，务必遵循数据驱动思想。
const Passenger = memo(function Passenger(props) {
    const {
        id,
        name,
        followAdultName, //可能出现的
        ticketType, //一定出现的，就会用它来判断是成人还是儿童
        licenceNo, //只有成人会出现
        gender, //性别，只有儿童会出现
        birthday,
        onRemove,//可以把当前乘客的id传过去，然后这个actioncreator在store中找到这个id值对应的passenger，将他移除
        //所以得在actions中建个新的对应的removePassenger actioncreator
        onUpdate, //引入的更新的actioncreator
        showGenderMenu,
        showFollowAdultMenu,
        showTicketTypeMenu,
    } = props;
//展现车票类型的函数因为关联到store里的状态值，所以一定会有action参与其中
//所以可以把传过来的回掉函数直接在actioncreator中定义即可
//----记住这种函数定义的方式，可以直接定义在actioncreator里。

    const isAdult = ticketType === 'adult';

    return (
        <li className="passenger">
            <i className="delete" onClick={() => onRemove(id)}>
                —
            </i>
            <ol className="items">
                <li className="item">
                    <label className="label name">姓名</label>
                    <input
                        type="text"
                        className="input name"
                        placeholder="乘客姓名"
                        value={name}
                        onChange={e => onUpdate(id, { name: e.target.value })}
                    />
                    <label
                        className="ticket-type"
                        onClick={() => showTicketTypeMenu(id)}
                    >
                        {isAdult ? '成人票' : '儿童票'}
                    </label>
                </li>
                {isAdult && ( //这个标签只有成人才显示，得加状态值开关判断下。
                    <li className="item">
                        <label className="label licenceNo">身份证</label>
                        <input
                            type="text"
                            className="input licenceNo"
                            placeholder="证件号码"
                            value={licenceNo}
                            onChange={e =>
                                onUpdate(id, { licenceNo: e.target.value })
                            }
                        />
                    </li>
                )}
                {!isAdult && (//性别只针对与儿童。。。性别这会唤起个弹出式的菜单，并不是简单的一个输入框，这是与他们的区别
                    <li className="item arrow">
                        <label className="label gender">性别</label>
                        <input
                            type="text"
                            className="input gender"
                            placeholder="请选择"
                            onClick={() => showGenderMenu(id)}
                            value={
                                gender === 'male'
                                    ? '男'
                                    : gender === 'female'
                                    ? '女'
                                    : ''
                            }
                            readOnly
                        />
                    </li>
                )}
                {!isAdult && (
                    <li className="item">
                        <label className="label birthday">出生日期</label>
                        <input
                            type="text"
                            className="input birthday"
                            placeholder="如 19951015"
                            value={birthday}
                            onChange={e =>
                                onUpdate(id, { birthday: e.target.value })
                            }
                        />
                    </li>
                )}
                {!isAdult && (  //负责同行成人的文本框。点击出现同行成人弹出菜单
                    <li className="item arrow">
                        <label className="label followAdult">同行成人</label>
                        <input
                            type="text"
                            className="input followAdult"
                            placeholder="请选择"
                            value={followAdultName}
                            onClick={() => showFollowAdultMenu(id)}
                            readOnly
                        />
                    </li>
                )}
            </ol>
        </li>
    );
});

Passenger.propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    followAdult: PropTypes.number,
    followAdultName: PropTypes.string,
    ticketType: PropTypes.string.isRequired,
    licenceNo: PropTypes.string,
    gender: PropTypes.string,
    birthday: PropTypes.string,
    onRemove: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    showGenderMenu: PropTypes.func.isRequired,
    showFollowAdultMenu: PropTypes.func.isRequired,
    showTicketTypeMenu: PropTypes.func.isRequired,
};

//主组件
const Passengers = memo(function Passengers(props) {
    const {//这就从bindactioncreator中取出强化后的actioncreator了带dispatch功能的createAdult等。
        passengers,
        createAdult,
        createChild,
        removePassenger,
        updatePassenger,
        showGenderMenu,
        showFollowAdultMenu,
        showTicketTypeMenu,
    } = props;

    const nameMap = useMemo(() => {
        const ret = {};

        for (const passenger of passengers) {
            ret[passenger.id] = passenger.name;
        }

        return ret;
    }, [passengers]);

    return (
        <div className="passengers">
            <ul>
                {passengers.map(passenger => {
                    return (
                        <Passenger
                            {...passenger}
                            followAdultName={nameMap[passenger.followAdult]}
                            showTicketTypeMenu={showTicketTypeMenu}
                            showGenderMenu={showGenderMenu}
                            showFollowAdultMenu={showFollowAdultMenu}
                            onRemove={removePassenger}
                            onUpdate={updatePassenger}
                            key={passenger.id}
                        />
                    );
                })}
            </ul>
            <section className="add">           {/* 执行回掉 */}
                <div className="adult" onClick={() => createAdult()}>
                    添加成人
                </div>
                <div className="child" onClick={() => createChild()}>
                    添加儿童
                </div>
            </section>
        </div>
    );
});

Passengers.propTypes = {
    passengers: PropTypes.array.isRequired,
    createAdult: PropTypes.func.isRequired,
    createChild: PropTypes.func.isRequired,
    showGenderMenu: PropTypes.func.isRequired,
    showFollowAdultMenu: PropTypes.func.isRequired,
    showTicketTypeMenu: PropTypes.func.isRequired,
};

export default Passengers;
