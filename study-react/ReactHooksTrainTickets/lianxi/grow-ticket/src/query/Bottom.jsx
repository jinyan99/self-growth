import React,{memo,useState,useMemo,useReducer} from 'react'
import PropTypes from 'prop-types'
import { ORDER_DEPART } from './constant';
import classnames from 'classnames'
import './Bottom.css'
import Slider from './Slider.jsx';
import { bindActionCreators } from 'redux';


//这个useReducer里的reducer是模块性的，能做到多个useReudcer都用这一个reducer回掉
//能相互独立接受，相互不影响
function checkedReducer(state, action) {
    const {type, payload} = action
    console.log(action,'看看checkedreducer项')
    let newState;
    switch(type) {
        case "toggle":
            newState= {...state};
            if(payload in newState) {
                delete newState[payload]
            } else {
                newState[payload] = true
            }
            console.log(newState,'看看存完后的数组')
            return newState
        case 'reset':
            console.log(action,'看看提交过来的重置请求')
            return {}
        default:
    }
    return state
}

//最小粒度组件Filter组件
const Filter = memo(function Filter(props) {
    const {
        name,
        checked,
        value,
        dispatch
    } = props
    console.log(dispatch,'看最小力度组件的dispatch')
    return (
        <li
            className={classnames({checked})}
            onClick={() => dispatch({payload:value,type:"toggle"})}
        >
            {name}
        </li>
    )
})

const Option = memo(function Option(props) {
    const { //正好这4个值给透传到option项。
        title,
        options,
        checkedMap,
        dispatch
    } = props
    return (
        <div className="option">
            <h3>{title}</h3>
            <ul>
                {options.map(option => {
                    return (
                        <Filter
                            key = {option.value}
                            {...option}
                            checked={option.value in checkedMap}
                            dispatch={dispatch}
                        ></Filter>
                    )
                })}
            </ul>
        </div>
    )
})

const BottomModal =memo(function BottomModal(props) {
    //大概流程：  从透传过来的数据不直接显示到这个jsx标签中，先透传过来的缓存到组件内部状态useState(或useReducer)
    //          ，jsx标签再根据本地缓存的值显示数据，然后提交的时候也是直接从jsx中的数据来源保存提交。
    //          相当于透传过来的数据需要组件内部状态器做拦截--方便希望做进一步的提交前的拦截处理。

    //这个是需要缓冲区的，将所有选中的数据前几块选中后会直接放到这个浮层组件里的内部状态值缓冲区
    //最后再由这个缓冲区统一提交到状态容器更新。
    const {
        ticketTypes,
        trainTypes,
        departStations,
        arriveStations,
        checkedTicketTypes,
        checkedTrainTypes,
        checkedDepartStations,
        checkedArriveStations,
        setCheckedTicketTypes,
        setCheckedDepartStations,
        setCheckedTrainTypes,
        setCheckedArriveStations,
        toggleIsFiltersVisible,
        departTimeStart,
        departTimeEnd,
        setDepartTimeEnd,
        setDepartTimeStart,
        arriveTimeStart,
        arriveTimeEnd,
        setArriveTimeStart,
        setArriveTimeEnd

    } = props;
    console.log(setCheckedTrainTypes,'看看bottommodal里的函数')
    const [
        localCheckedTicketsTypes,
        localCheckedTicketTypesDispatch
    ] = useReducer(checkedReducer, checkedTicketTypes, checkedTicketTypes => {
        return {...checkedTicketTypes}
    })
    const [
        localCheckedDepartStations,
        localCheckedDepartStationsDispatch
    ] = useReducer(checkedReducer, checkedDepartStations, checkedDepartStations => {
        return {...checkedDepartStations}
    })
    const [
        localCheckedArriveStations,
        localCheckedArriveStationsDispatch
    ] = useReducer(checkedReducer, checkedArriveStations, checkedArriveStations => {
        return {...checkedArriveStations}
    })
    const [
        localCheckedTrainTypes,
        localCheckedTrainTypesDispatch
    ] = useReducer(checkedReducer, checkedTrainTypes, checkedTrainTypes => {
        return {...checkedTrainTypes}
    })
   //下面4个值是时间滑块的缓冲区，为时间滑块建立本地缓冲区，把缓冲区的它值对应的set更新透传到子组件中去。
    const [localDepartTimeStart, setLocalDepartTimeStart] = useState(
        departTimeStart
    )
    console.log(localDepartTimeStart,'看看出发时间')
    const [localDepartTimeEnd, setLocalDepartTimeEnd] = useState(departTimeEnd)
    const [localArriveTimeEnd,
           setLocalArriveTimeEnd
        ] = useState(
        arriveTimeEnd
    )
    const [localArriveTimeStart,
            setLocalArriveTimeStart
    ] = useState(
        arriveTimeStart
    )
    console.log(localArriveTimeEnd,'Bottom组件重新渲染了')
    const isResetDisabled = useMemo(() => {
        return (
             Object.keys(localCheckedTicketsTypes).length === 0 &&
            Object.keys(localCheckedTrainTypes).length === 0 &&
            Object.keys(localCheckedDepartStations).length === 0 &&
            Object.keys(localCheckedArriveStations).length === 0 &&
            localDepartTimeStart === 0 &&
            localDepartTimeEnd === 24 &&
            localArriveTimeStart === 0 &&
            localArriveTimeEnd === 24
        )
    } ,[
        localCheckedTicketsTypes,
        localCheckedTrainTypes,
        localCheckedDepartStations,
        localCheckedArriveStations,
        localDepartTimeStart,
        localDepartTimeEnd,
        localArriveTimeStart,
        localArriveTimeEnd,
    ] )
    console.log(isResetDisabled,'看看重置开关')
    //牢记这种定义数组方式，每个对象项渲染option列表，每个option需要什么参数，需要接受文案数据tickettypes
    //需要store里的选中状态容器，让子组件能根据里面的项响应显示是否是选中状态
    //还需要接受点击项后的回掉函数，就是个disptahc函数，点完直接更新到本地状态容器里了。
    //所以做数组基础数据遍历的话，就每项传这4个参数就可以了
    //这样就用最小粒度组件，追求复用性，这能让不同的dispatch传进去，最小粒度组件能自适应使用来的不同的dispatch功能
    const optionGroup = [
        {
            title:"坐席类型",
            options: ticketTypes,
            checkedMap:localCheckedTicketsTypes,
            dispatch: localCheckedTicketTypesDispatch
        },
        {
            title: '车次类型',
            options: trainTypes,
            checkedMap: localCheckedTrainTypes,
            dispatch: localCheckedTrainTypesDispatch,
        },
        {
            title: '出发车站',
            options: departStations,
            checkedMap: localCheckedDepartStations,
            dispatch: localCheckedDepartStationsDispatch
        },
        {
            title: '到达车站',
            options: arriveStations,
            checkedMap: localCheckedArriveStations,
            dispatch: localCheckedArriveStationsDispatch
        }
    ]
    function reset() {
        console.log('点击重置了')
        if(isResetDisabled) {
            return
        }
        localCheckedTicketTypesDispatch({type: 'reset'})
        localCheckedTrainTypesDispatch({type: 'reset'})
        localCheckedDepartStationsDispatch({type: 'reset'})
        localCheckedArriveStationsDispatch({type: 'reset'})
        setLocalDepartTimeStart(0)
        setLocalDepartTimeEnd(24)
        setLocalArriveTimeStart(0)
        setLocalArriveTimeEnd(24)

    }
    function sure() {
        console.log('点击确定了');
        setCheckedTicketTypes(localCheckedTicketsTypes);
        setCheckedDepartStations(localCheckedDepartStations)
        setCheckedTrainTypes(localCheckedTrainTypes)
        setCheckedArriveStations(localCheckedArriveStations)
        setDepartTimeStart(localDepartTimeStart)
        setDepartTimeEnd(localDepartTimeEnd)
        setArriveTimeStart(localArriveTimeStart)
        setArriveTimeEnd(localArriveTimeEnd)
        toggleIsFiltersVisible()
    }
    return (
        <div className="bottom-modal">
            <div className="bottom-dialog">
                <div className="bottom-dialog-content">
                    <div className="title">
                        <span
                            className={classnames('reset', {
                                disabled: isResetDisabled,
                            })}
                            onClick={reset}
                        >
                            重置
                        </span>
                        <span
                            className="ok"
                            onClick={sure}
                        >
                            确定
                        </span>
                    </div>
                    <div className="options">
                        {optionGroup.map(group => (
                            <Option {...group} key={group.title} />
                        ))}
                        <Slider
                            title="出发时间"
                            currentStartHours={localDepartTimeStart}
                            currentEndHours={localDepartTimeEnd}
                            onStartChanged={setLocalDepartTimeStart}
                            onEndChanged={setLocalDepartTimeEnd}
                        />
                        <Slider
                            title="到达时间"
                            currentStartHours={localArriveTimeStart}
                            currentEndHours={localArriveTimeEnd}
                            onStartChanged={setLocalArriveTimeStart}
                            onEndChanged={setLocalArriveTimeEnd}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
})




//先写主组件
export default function Bottom(props) {
    //先想接什么数据
    const {
        toggleOrderType,
        orderType,
        highSpeed,
        toggleHighSpeed,
        onlyTickets,
        toggleOnlyTickets,
        isFiltersVisible,
        toggleIsFiltersVisible,
        //下面是bottom组件综合浮层用到的透传过来的基本8+4个对应的actioncreator
        ticketTypes,
        trainTypes,
        departStations,
        arriveStations,
        checkedArriveStations,
        checkedDepartStations,
        checkedTicketTypes,
        checkedTrainTypes,
        setCheckedTicketTypes,
        setCheckedTrainTypes,
        setCheckedDepartStations,
        setCheckedArriveStations,
        setDepartTimeStart,
        setDepartTimeEnd,
        departTimeStart,
        departTimeEnd,
        //到达时间
        arriveTimeStart,
        arriveTimeEnd,
        setArriveTimeStart,
        setArriveTimeEnd

    } = props
    //这个是联动的，前面几块有选中，这个就图标会有变化
    const noChecked = useMemo(() => {
        return (
            '0'
        )
    },[])

    return (
        <div className="bottom">
            <div className="bottom-filters">
                <span className="item" onClick={toggleOrderType}>
                    <i className="icon">&#xf065;</i>
                    {orderType === ORDER_DEPART ? '出发 早-晚' : '耗时 短-长'}
                </span>
                <span className={classnames('item',{
                    'item-on': highSpeed
                })} onClick={toggleHighSpeed}>
                    <i className="icon">
                        {highSpeed ? '\uf43f' : '\uf43e'}
                    </i>
                    只看高铁动车
                </span>
                <span
                    className={classnames('item', {
                        'item-on':onlyTickets
                    })}
                    onClick={toggleOnlyTickets}
                >
                    <i className="icon" >{onlyTickets ? '\uf43d' : '\uf43c'}</i>
                    只看有票
                </span>
                <span
                    className={classnames('item', {
                        'item-on' : isFiltersVisible || !noChecked
                    })}
                    onClick={toggleIsFiltersVisible}
                >
                    <i className="icon">{noChecked? '\uf0f7': '\uf446'}</i>
                    综合筛选
                </span>
            </div>
            {isFiltersVisible && (
                <BottomModal
                    ticketTypes={ticketTypes}
                    trainTypes={trainTypes}
                    departStations={departStations}
                    arriveStations={arriveStations}
                    checkedTicketTypes={checkedTicketTypes}
                    checkedArriveStations={checkedArriveStations}
                    checkedTrainTypes={checkedTrainTypes}
                    checkedDepartStations={checkedDepartStations}
                    setCheckedTicketTypes={setCheckedTicketTypes}
                    setCheckedArriveStations={setCheckedArriveStations}
                    setCheckedDepartStations={setCheckedDepartStations}
                    setCheckedTrainTypes={setCheckedTrainTypes}
                    setDepartTimeEnd={setDepartTimeEnd}
                    setDepartTimeStart={setDepartTimeStart}
                    departTimeEnd={departTimeEnd}
                    departTimeStart={departTimeStart}
                    arriveTimeStart={arriveTimeStart}
                    arriveTimeEnd={arriveTimeEnd}
                    setArriveTimeStart={setArriveTimeStart}
                    setArriveTimeEnd={setArriveTimeEnd}
                    toggleIsFiltersVisible={toggleIsFiltersVisible}           />
            )}
        </div>
    )
}