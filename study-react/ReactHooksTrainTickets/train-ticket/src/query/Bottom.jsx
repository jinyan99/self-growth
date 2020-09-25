import React, { memo, useState, useMemo, useReducer } from 'react';
//引用useState本地state来作为综合筛选浮层的 缓存区
import PropTypes from 'prop-types';
//使用这个动态class，可以方便的切换类名，变化颜色等
import classnames from 'classnames';

import Slider from './Slider.jsx';
import { ORDER_DEPART } from './constant';
import './Bottom.css';

//这个useReducer里的reducer是模块性的，能做到多个useReudcer都用这一个reducer回掉
//能相互独立接受，相互不影响
//这是useReducer的第一个参数函数，即是个reducer函数，和redux里的reducer函数一样
function checkedReducer(state, action) {
    const { type, payload } = action;
   //这个是模块性的，多个使用的useReducer使用的这同一个reducer回掉函数，每个模块对应的结果都是相互独立的
   //reducer，所以存的newState缓存变量值都是不同的相互独立的状态容器。，能做到下面每个useReducer返回的值
   //dispatch之后，都能做到各存各的newState值，dispatch后各改各的newState值
    let newState;
    switch (type) {
        case 'toggle'://这里的逻辑和我们之前定义的toggle函数逻辑是一样的
            newState = { ...state };
            if (payload in newState) {
                delete newState[payload];
            } else {
                newState[payload] = true;
            }
            return newState;
        case 'reset':
            return {};
        default:
    }
    //如果都每命中返回现有的state值
    return state;
}

//jsx循环下的jsx的粒度更小的组件
const Filter = memo(function Filter(props) {
   //这个粒度更小的组件先想能接受什么参数，每个组件能看到的就是他的文案name，选中状态等都得从props中取到
    const { name, checked, value, dispatch } = props;

    return (
        <li
            className={classnames({ checked })}
            onClick={() => dispatch({ payload: value, type: 'toggle' })}
        >
            {name}
        </li>
    );
});

Filter.propTypes = {
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
};

const Option = memo(function Option(props) {
    //这个模块化原则option组件，是标题行和下面的不定项的组合的一部分，一个标题块作为一个模块化抽离出公共的组件
    const { title, options, checkedMap, dispatch } = props;
//还是先想props中都接受什么数据
//title是标题块的标题行，options是标题行下面的不定项数据，checkedMap是不定项选中的数据对象形式
// 然后每个return中里层的每个选项都应该是独立的复选按钮基于重渲染的考量：
// 在绝大多数情况下，循环下面的jsx都应该提取到独立的组件中去。所以我们还得再创建个粒度更小的Filter组件。
return (
        <div className="option">
            <h3>{title}</h3>
            <ul>
                {options.map(option => {
                    return (
                        <Filter
                            key={option.value}
                            {...option}
                            checked={option.value in checkedMap}
                            dispatch={dispatch}
                        />
                    );
                })}
            </ul>
        </div>
    );
});
/* 配合下面group update版的option
const Filter = memo(function Filter(props) {
    const { name, checked, toggle ,value} = props;

    return (
        <li
            className={classnames({ checked })}
            onClick={() => toggle(value)}
        >
            {name}
        </li>
    );
});

const Option = memo(function Option(props) {
    const {update, title, options, checkedMap, dispatch } = props;
    //update函数更新的是checkedMap这个级别的数据，所以update没法再往下级传递了 因为filter组件
    //没办法感知checkedMap的存在，那为了切换哪个选项被选中，我们就在option组件中定义个内部toggle函数
    //参数value代表的是某个选项的值...最后把toggle传递给filter组件
   //然后在filter组件中把toggle取出来，然后定义filter元素的onclikc事件
    const toggle = useCallback((value)=>{
        const  newCheckedMap = {...checkedMap};
        if(value in checkedMap) {
            delete newCheckedMap[value]
        } else {
            newcheckedMap[value] = true
        }
        update(newCheckedMap)
    },[checkedMap,update])

    return (
        <div className="option">
            <h3>{title}</h3>
            <ul>
                {options.map(option => {
                    return (
                        <Filter
                            key={option.value}
                            {...option}
                            checked={option.value in checkedMap}
                            toggle={toggle}
                        />
                    );
                })}
            </ul>
        </div>
    );
}); */



Option.propTypes = {
    title: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    checkedMap: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
};

//开始编写BottomModal组件，这组件里的Option组件是一个标准块，无论是样式还是逻辑都没有什么区别
//              所以基于模块化的原则，我们肯定要用个独立的组件来实现它，所以在上面再实现个
//              声明个新的Option组件。每个Option组件就是一块，块里(含标题和多个filter组件不定项)
//              如坐席类型块
const BottomModal = memo(function BottomModal(props) {
    const {
        ticketTypes,
        trainTypes,
        departStations,
        arriveStations,
        checkedTicketTypes,
        checkedTrainTypes,
        checkedDepartStations,
        checkedArriveStations,
        departTimeStart,
        departTimeEnd,
        arriveTimeStart,
        arriveTimeEnd,
        setCheckedTicketTypes,
        setCheckedTrainTypes,
        setCheckedDepartStations,
        setCheckedArriveStations,
        setDepartTimeStart,
        setDepartTimeEnd,
        setArriveTimeStart,
        setArriveTimeEnd,
        toggleIsFiltersVisible,
    } = props;
    //大概流程：  从透传过来的数据不直接显示到这个jsx标签中，先透传过来的缓存到组件内部状态useState(或useReducer)
    //          ，jsx标签再根据本地缓存的值显示数据，然后提交的时候也是直接从jsx中的数据来源保存提交。
    //          相当于透传过来的数据需要组件内部状态器做拦截--方便希望做进一步的提交前的拦截处理。

    //这里的提交数据是需要缓冲区的，将所有选中的数据前几块里的选项选中后会直接放到这个浮层组件里的内部状态值也就是个缓冲区的概念
    //最后再由这个缓冲区统一提交到全局状态容器更新。
     //用usestate来作为确定按钮的缓冲区
        //我们要用usestate来生成针对optionGroup里的四个值的本地化文本，所以在上面面创建4个state值
        //缓冲里的数据写好，在optionGroup里的数据应该换成缓冲区里的数据，去渲染缓冲区里的数据而不是store中原数据
       //下一步还要做个选项里的事件处理程序指向于对缓冲区数据的修改
       //要修改optionGroup里的缓冲区数据，肯定要使用到setState函数做到本地化的数据更新
    const [
        localCheckedTicketTypes,
        localCheckedTicketTypesDispatch,
    ] = useReducer(checkedReducer, checkedTicketTypes, checkedTicketTypes => {
    //这块就用reducer的方式替掉了原来旧版的useState。reducer的第一个参数是个纯函数，第二个参数是这个state的
    //初始值checkedTicketTypes是同步初始化。如果传入第三个参数就能得到异步初始化的state，它也是传的函数，函数的参数就是
    //useReducer的第二个参数。 useReducer函数返回的state还是原来的state(数组的第一项)，但是setState不存在了其得到的是
    //个dispatch函数(dispatch函数传参肯定要传action对象的如下面reset里的dispatch函数的使用)。这就是useReducer的改写方式，
    //下面三个也都这种方式改写。改写完后对应的update也都换成dispatch了，之前旧版的toggle函数也就没意义了删掉即可。在Option组件中
    //我们可以直接把dipathc函数透传到 filter组件中。在filter组件获取到的也是dispatch不是toggle了
    //对应的setState函数被替换掉了，看下setState被放到什么地方了？？
        return {
            ...checkedTicketTypes,
        };
    });
    //这做的4个useRuducer，存的都是各块数据，相当于模块化的reducer。这4个
    //useReducer都是用的一个reducer函数，但是内部自动处理成对应dispatch的时候，能处理到对应的数据
    const [localCheckedTrainTypes, localCheckedTrainTypesDispatch] = useReducer(
        checkedReducer,
        checkedTrainTypes,
        checkedTrainTypes => {
            return {
                ...checkedTrainTypes,
            };
        }
    );

    const [
        localCheckedDepartStations,
        localCheckedDepartStationsDispatch,
    ] = useReducer(
        checkedReducer,
        checkedDepartStations,
        checkedDepartStations => {
            return {
                ...checkedDepartStations,
            };
        }
    );

    const [
        localCheckedArriveStations,
        localCheckedArriveStationsDispatch,
    ] = useReducer(
        checkedReducer,
        checkedArriveStations,
        checkedArriveStations => {
            return {
                ...checkedArriveStations,
            };
        }
    );
    //下面4个值是时间滑块的缓冲区，本地useState设置
    //这块流程是store中透传过来的如出发时间state和它的actioncreator。
    //这里不直接把它的actioncreator透传slider里，否则就会造成和上面一样的情况，每滑一下就更新一遍store，这样不好
    //分成2部分 ：
    //      1- 把它真正的actioncreator只由sure的回掉中使用，作最后批量更新
    //      2-自己用useState或usereducer建本地缓冲区，缓冲区它值对应的set更新函数透传到slider组件中去
    //        即下面的把setLocalDepartTimeStart透传给slider组件
    //子组件都更新到这个缓存区里，最后统一批量提交
    const [localDepartTimeStart, setLocalDepartTimeStart] = useState(
        departTimeStart
    );
    const [localDepartTimeEnd, setLocalDepartTimeEnd] = useState(departTimeEnd);
    const [localArriveTimeStart, setLocalArriveTimeStart] = useState(
        arriveTimeStart
    );
    const [localArriveTimeEnd, setLocalArriveTimeEnd] = useState(arriveTimeEnd);

   //这和antd table组件里的datasource数组基础数据的思想挺类似的
    //牢记这种定义基本数据渲染多个类似列表的方式，每个对象项渲染option列表，每个option需要什么参数，需要接受文案数据tickettypes
    //需要store里的选中状态容器，让子组件能根据里面的项响应显示是否是选中状态
    //还需要接受点击项后的回掉函数，就是个disptahc函数，点完直接更新到本地状态容器里了。
    //所以做数组基础数据遍历的话，就每项传这4个参数就可以了
    const optionGroup = [
        {
            title: '坐席类型',
            options: ticketTypes,
            //options代表的是有哪些选项要显示
            checkedMap: localCheckedTicketTypes,//指那些选项被选中了。都换成本地版本
            //那些
            dispatch: localCheckedTicketTypesDispatch,
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
            dispatch: localCheckedDepartStationsDispatch,
        },
        {
            title: '到达车站',
            options: arriveStations,
            checkedMap: localCheckedArriveStations,
            dispatch: localCheckedArriveStationsDispatch,
        },
    ];

   /*这里与上版的不同是选型事件的响应处理不同  ，我们要把选想的点击事件转化成对缓冲区数据的修改
   要修改这些local数据肯定要使用这些setSTtae函数，这版主要区别就是给下面加update属性。
   我们就可以在option组件中获取到这个update。。。上版是最新版加的useReducer和dispatch
    const [
        localCheckedTicketTypes,
        setLocalCheckedTicketTypes,
    ] = useState(() => {return {
    //由于组件的初始值在组件第一次渲染的时候才会被用到，所以每次都重新计算逻辑的化就浪费性能
    //所以传入一个函数优化，只在组件第一次被渲染的时候才会被调用执行函数体里的复杂逻辑
            ...checkedTicketTypes,
        };
    });

    const [localCheckedTrainTypes, 
        setLocalCheckedTrainTypes
    ] = useState(
       () => {
            return {
                ...checkedTrainTypes,
            };
        }
    );
    const [
        localCheckedDepartStations,
        setLocalCheckedDepartStations,
    ] = useState(
       () => {
            return {
                ...checkedDepartStations,
            };
        }
    );

    const [
        localCheckedArriveStations,
        setLocalCheckedArriveStations,
    ] = useState(
       () => {
            return {
                ...checkedArriveStations,
            };
        }
    );
  
  
   const optionGroup = [
        {
            title: '坐席类型',
            options: ticketTypes,
            checkedMap: localCheckedTicketTypes,//都换成本地版本
            update: setLocalCheckedTicketTypes,
        },
        {
            title: '车次类型',
            options: trainTypes,
            checkedMap: localCheckedTrainTypes,
            update: setLocalCheckedTrainTypes,
        },
        {
            title: '出发车站',
            options: departStations,
            checkedMap: localCheckedDepartStations,
            update: setLocalcheckedDepartStations,
        },
        {
            title: '到达车站',
            options: arriveStations,
            checkedMap: localCheckedArriveStations,
            update: setLocalCheckedArriveStations,
        },
    ]; */



//点击确定按钮之后，就要把4个不定项选择的数据对象和2个时间区间(4个时间点)共8条数据提交给store
    function sure() {
        //目前8条数据都缓存在缓冲区中即那些local开头命名的state数据，想要提交给store必须得派发action
        //我们已经引入了actioncreator与dispatcj的绑定
        setCheckedTicketTypes(localCheckedTicketTypes);//如把这个数据提交给store
        setCheckedTrainTypes(localCheckedTrainTypes);
        setCheckedDepartStations(localCheckedDepartStations);
        setCheckedArriveStations(localCheckedArriveStations);

        setDepartTimeStart(localDepartTimeStart);
        setDepartTimeEnd(localDepartTimeEnd);

        setArriveTimeStart(localArriveTimeStart);
        setArriveTimeEnd(localArriveTimeEnd);

        toggleIsFiltersVisible();
        //调用的这9个函数，都已经不是actioncreator了，因为在app组件中我们用bindactioncreattor绑定actioncreator与dispatch函数绑定在了一起
        //我们现在调用的每个函数都是在dispatch对应的action
    }
//下面虽然重置功能都实现了，但得有条件限制，不是任何适合都能重置，如果此时就是默认值，这时就不能进行二次重置操作
//所以创建下列isResetDisabled函数变量，，看下面的选项取key组成的数组长度是不是0，为0就没有选中项是默认值，只有当下面8个条件都满足的情况下，重置按钮才是不可点的同时在样式上也是有所区别的
    const isResetDisabled = useMemo(() => {
        return (
            Object.keys(localCheckedTicketTypes).length === 0 &&
            Object.keys(localCheckedTrainTypes).length === 0 &&
            Object.keys(localCheckedDepartStations).length === 0 &&
            Object.keys(localCheckedArriveStations).length === 0 &&
            localDepartTimeStart === 0 &&
            localDepartTimeEnd === 24 &&
            localArriveTimeStart === 0 &&
            localArriveTimeEnd === 24
        );
    }, [
        localCheckedTicketTypes,
        localCheckedTrainTypes,
        localCheckedDepartStations,
        localCheckedArriveStations,
        localDepartTimeStart,
        localDepartTimeEnd,
        localArriveTimeStart,
        localArriveTimeEnd,
    ]);
//重置数据
    function reset() {
        if (isResetDisabled) {
            return;
        }

        localCheckedTicketTypesDispatch({ type: 'reset' });
        localCheckedTrainTypesDispatch({ type: 'reset' });
        localCheckedDepartStationsDispatch({ type: 'reset' });
        localCheckedArriveStationsDispatch({ type: 'reset' });
        setLocalDepartTimeStart(0);
        setLocalDepartTimeEnd(24);
        setLocalArriveTimeStart(0);
        setLocalArriveTimeEnd(24);
    }

    return (
        <div className="bottom-modal">{/* 这是全屏的元素 */}
            <div className="bottom-dialog">{/* 这是半透明下半部分的主要区域 */}
                <div className="bottom-dialog-content">{/* 这是其中滚动的部分，又包裹一层的 */}
                    <div className="title">{/* 这是最上面一行头部块，确定和重置两个按钮，共需要3个变量 */}
                        <span
                            className={classnames('reset', {
                                disabled: isResetDisabled,
                            })}
                            onClick={reset}
                        >
                            重置
                        </span>
                        <span className="ok" onClick={sure}>
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
    );
});

BottomModal.propTypes = {
    ticketTypes: PropTypes.array.isRequired,
    trainTypes: PropTypes.array.isRequired,
    departStations: PropTypes.array.isRequired,
    arriveStations: PropTypes.array.isRequired,
    checkedTicketTypes: PropTypes.object.isRequired,
    checkedTrainTypes: PropTypes.object.isRequired,
    checkedDepartStations: PropTypes.object.isRequired,
    checkedArriveStations: PropTypes.object.isRequired,
    departTimeStart: PropTypes.number.isRequired,
    departTimeEnd: PropTypes.number.isRequired,
    arriveTimeStart: PropTypes.number.isRequired,
    arriveTimeEnd: PropTypes.number.isRequired,
    setCheckedTicketTypes: PropTypes.func.isRequired,
    setCheckedTrainTypes: PropTypes.func.isRequired,
    setCheckedDepartStations: PropTypes.func.isRequired,
    setCheckedArriveStations: PropTypes.func.isRequired,
    setDepartTimeStart: PropTypes.func.isRequired,
    setDepartTimeEnd: PropTypes.func.isRequired,
    setArriveTimeStart: PropTypes.func.isRequired,
    setArriveTimeEnd: PropTypes.func.isRequired,
    toggleIsFiltersVisible: PropTypes.func.isRequired,
};

export default function Bottom(props) {
  //先想从bottom中能取出什么东西
    const {
        toggleOrderType,
        toggleHighSpeed,
        toggleOnlyTickets,
        toggleIsFiltersVisible,
        highSpeed,
        orderType,
        onlyTickets,
        isFiltersVisible,
//下面到327行是透传过来的props数据，这些数据传递过来仅仅用作展示之用，但是我们还得去修改他们，还得在Appjsx中引用相关的actioncreator
        ticketTypes,
        trainTypes,
        departStations,
        arriveStations,
        checkedTicketTypes,
        checkedTrainTypes,
        checkedDepartStations,
        checkedArriveStations,
        departTimeStart,
        departTimeEnd,
        arriveTimeStart,
        arriveTimeEnd,
        setCheckedTicketTypes,
        setCheckedTrainTypes,
        setCheckedDepartStations,
        setCheckedArriveStations,
        setDepartTimeStart,
        setDepartTimeEnd,
        setArriveTimeStart,
        setArriveTimeEnd,
    } = props;
//写这个判断逻辑，就是要判断当前有没有选中项，决定底部栏图标颜色是否变色，如果用户有选的话会有变色图标显示
//这个代码段返回的是个代码段，return的是个bool值，这个作为类名的开关显示和isFIlter是一块配合的
    const noChecked = useMemo(() => {
        return (
            Object.keys(checkedTicketTypes).length === 0 &&
            Object.keys(checkedTrainTypes).length === 0 &&
            Object.keys(checkedDepartStations).length === 0 &&
            Object.keys(checkedArriveStations).length === 0 &&
            departTimeStart === 0 &&
            departTimeEnd === 24 &&
            arriveTimeStart === 0 &&
            arriveTimeEnd === 24
        );
    }, [
        checkedTicketTypes,
        checkedTrainTypes,
        checkedDepartStations,
        checkedArriveStations,
        departTimeStart,
        departTimeEnd,
        arriveTimeStart,
        arriveTimeEnd,
    ]);
//筛选栏单独写成个div，后面还有和他平级的选择浮层出现
//还要注意下面365与372行字体图标iconfont的使用方法，在html中使用&#x。在js中用\u两种方式
//高铁动车这一块可以是一个高铁状态来决定显示类名的动态切换，和切换的toggleHighType actioncreator函数。

//常规小块显示只需要两个变量一个控制的图标切换一个是actioncreator派发的就行了，综合筛选需要出个浮层，就需三个变量来配合了
return (
        <div className="bottom">
            <div className="bottom-filters">
                <span className="item" onClick={toggleOrderType}>
                    <i className="icon">&#xf065;</i>
                    {orderType === ORDER_DEPART ? '出发 早→晚' : '耗时 短→长'}
                </span>
                <span
                    className={classnames('item', { 'item-on': highSpeed })}
                    onClick={toggleHighSpeed}
                >
                    <i className="icon">{highSpeed ? '\uf43f' : '\uf43e'}</i>
                    只看高铁动车
                </span>
                <span
                    className={classnames('item', { 'item-on': onlyTickets })}
                    onClick={toggleOnlyTickets}
                >
                    <i className="icon">{onlyTickets ? '\uf43d' : '\uf43c'}</i>
                    只看有票
                </span>
                <span
                    className={classnames('item', {
                        'item-on': isFiltersVisible || !noChecked,
                    })}
                    onClick={toggleIsFiltersVisible}
                >
                    <i className="icon">{noChecked ? '\uf0f7' : '\uf446'}</i>
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
                    checkedTrainTypes={checkedTrainTypes}
                    checkedDepartStations={checkedDepartStations}
                    checkedArriveStations={checkedArriveStations}
                    departTimeStart={departTimeStart}
                    departTimeEnd={departTimeEnd}
                    arriveTimeStart={arriveTimeStart}
                    arriveTimeEnd={arriveTimeEnd}
                    setCheckedTicketTypes={setCheckedTicketTypes}
                    setCheckedTrainTypes={setCheckedTrainTypes}
                    setCheckedDepartStations={setCheckedDepartStations}
                    setCheckedArriveStations={setCheckedArriveStations}
                    setDepartTimeStart={setDepartTimeStart}
                    setDepartTimeEnd={setDepartTimeEnd}
                    setArriveTimeStart={setArriveTimeStart}
                    setArriveTimeEnd={setArriveTimeEnd}
                    //下面这个函数传给他，因为综合筛选服务层有个确认按钮，确认按钮点击后会关闭这个浮层，所以需要这个函数
                    toggleIsFiltersVisible={toggleIsFiltersVisible}
                />
            )}
        </div>
    );
}

Bottom.propTypes = {
    toggleOrderType: PropTypes.func.isRequired,
    toggleHighSpeed: PropTypes.func.isRequired,
    toggleOnlyTickets: PropTypes.func.isRequired,
    toggleIsFiltersVisible: PropTypes.func.isRequired,
    highSpeed: PropTypes.bool.isRequired,
    orderType: PropTypes.number.isRequired,
    onlyTickets: PropTypes.bool.isRequired,
    isFiltersVisible: PropTypes.bool.isRequired,

    ticketTypes: PropTypes.array.isRequired,
    trainTypes: PropTypes.array.isRequired,
    departStations: PropTypes.array.isRequired,
    arriveStations: PropTypes.array.isRequired,
    checkedTicketTypes: PropTypes.object.isRequired,
    checkedTrainTypes: PropTypes.object.isRequired,
    checkedDepartStations: PropTypes.object.isRequired,
    checkedArriveStations: PropTypes.object.isRequired,
    departTimeStart: PropTypes.number.isRequired,
    departTimeEnd: PropTypes.number.isRequired,
    arriveTimeStart: PropTypes.number.isRequired,
    arriveTimeEnd: PropTypes.number.isRequired,
    setCheckedTicketTypes: PropTypes.func.isRequired,
    setCheckedTrainTypes: PropTypes.func.isRequired,
    setCheckedDepartStations: PropTypes.func.isRequired,
    setCheckedArriveStations: PropTypes.func.isRequired,
    setDepartTimeStart: PropTypes.func.isRequired,
    setDepartTimeEnd: PropTypes.func.isRequired,
    setArriveTimeStart: PropTypes.func.isRequired,
    setArriveTimeEnd: PropTypes.func.isRequired,
};
