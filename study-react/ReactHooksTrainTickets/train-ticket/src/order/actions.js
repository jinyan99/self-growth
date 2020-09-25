export const ACTION_SET_TRAIN_NUMBER = 'SET_TRAIN_NUMBER';
export const ACTION_SET_DEPART_STATION = 'SET_DEPART_STATION';
export const ACTION_SET_ARRIVE_STATION = 'SET_ARRIVE_STATION';
export const ACTION_SET_SEAT_TYPE = 'SET_SEAT_TYPE';
export const ACTION_SET_DEPART_DATE = 'SET_DEPART_DATE';
export const ACTION_SET_ARRIVE_DATE = 'SET_ARRIVE_DATE';
export const ACTION_SET_DEPART_TIME_STR = 'SET_DEPART_TIME_STR';
export const ACTION_SET_ARRIVE_TIME_STR = 'SET_ARRIVE_TIME_STR';
export const ACTION_SET_DURATION_STR = 'SET_DURATION_STR';
export const ACTION_SET_PRICE = 'SET_PRICE';
export const ACTION_SET_PASSENGERS = 'SET_PASSENGERS';
export const ACTION_SET_MENU = 'SET_MENU';
export const ACTION_SET_IS_MENU_VISIBLE = 'SET_IS_MENU_VISIBLE';
export const ACTION_SET_SEARCH_PARSED = 'SET_SEARCH_PARSED';

export function setTrainNumber(trainNumber) {
    return {
        type: ACTION_SET_TRAIN_NUMBER,
        payload: trainNumber,
    };
}
export function setDepartStation(departStation) {
    return {
        type: ACTION_SET_DEPART_STATION,
        payload: departStation,
    };
}
export function setArriveStation(arriveStation) {
    return {
        type: ACTION_SET_ARRIVE_STATION,
        payload: arriveStation,
    };
}
export function setSeatType(seatType) {
    return {
        type: ACTION_SET_SEAT_TYPE,
        payload: seatType,
    };
}
export function setDepartDate(departDate) {
    return {
        type: ACTION_SET_DEPART_DATE,
        payload: departDate,
    };
}
export function setArriveDate(arriveDate) {
    return {
        type: ACTION_SET_ARRIVE_DATE,
        payload: arriveDate,
    };
}
export function setDepartTimeStr(departTimeStr) {
    return {
        type: ACTION_SET_DEPART_TIME_STR,
        payload: departTimeStr,
    };
}
export function setArriveTimeStr(arriveTimeStr) {
    return {
        type: ACTION_SET_ARRIVE_TIME_STR,
        payload: arriveTimeStr,
    };
}
export function setDurationStr(durationStr) {
    return {
        type: ACTION_SET_DURATION_STR,
        payload: durationStr,
    };
}
export function setPrice(price) {
    return {
        type: ACTION_SET_PRICE,
        payload: price,
    };
}
export function setPassengers(passengers) {
    return {
        type: ACTION_SET_PASSENGERS,
        payload: passengers,
    };
}
export function setMenu(menu) {
    return {
        type: ACTION_SET_MENU,
        payload: menu,
    };
}
export function setIsMenuVisible(isMenuVisible) {
    return {
        type: ACTION_SET_IS_MENU_VISIBLE,
        payload: isMenuVisible,
    };
}
export function setSearchParsed(searchParsed) {
    return {
        type: ACTION_SET_SEARCH_PARSED,
        payload: searchParsed,
    };
}

//这是个异步的actioncreator，能接受到dispatch和当前最新的state
//能写异步的，都因为引入thunk才可以这样写
export function fetchInitial(url) {
    return (dispatch, getState) => {
        //直接在actioncreator里做网络请求
        fetch(url)
            .then(res => res.json())
            .then(data => {
                const {
                    departTimeStr,
                    arriveTimeStr,
                    arriveDate,
                    durationStr,
                    price,
                } = data;

                dispatch(setDepartTimeStr(departTimeStr));
                dispatch(setArriveTimeStr(arriveTimeStr));
                dispatch(setArriveDate(arriveDate));
                dispatch(setDurationStr(durationStr));
                dispatch(setPrice(price));
            });
    };
}






let passengerIdSeed = 0;

//特殊的创建成人的actioncreator用于乘客信息组件，这个是异步的actioncreator，返回一个函数
export function createAdult() {
    return (dispatch, getState) => {
        //通过getState获取拿到当前所有的乘客数组数据
        const { passengers } = getState();
//这个添加乘客的action操作时，要进行2步操作：
//                     1-先for循环检查全局状态数据空字段(检查空字段是直接检查内部store数据是否为空，而不是检查表面的框里是否没填)
        //             2- 再进行dispatch派发，更新乘客数据全局状态值
        //遍历检查是否有空缺的字段，如果有就return掉。没有就正常往下执行
        for (let passenger of passengers) {
            const keys = Object.keys(passenger);
            for (let key of keys) {
                if (!passenger[key]) {
                    return;
                }
            }
        }
        //再进行全局状态数据的派发
        dispatch(
            setPassengers([//给passengers重新赋值，setPassddengrs是个action，需要提交给dispatch才会生效。
                ...passengers,//新的passengers得包含之前所有乘客数据，下面添加新的对象数据
                {
                    id: ++passengerIdSeed,
                    name: '',
                    ticketType: 'adult',
                    licenceNo: '',
                    seat: 'Z',
                },
            ])
        );
    };
}
//特殊的创建儿童的actioncreator用于乘客信息组件
export function createChild() {
    return (dispatch, getState) => {
        const { passengers } = getState();
        //通过设一个变量，来解决检查是否有成人的问题，通过在循环中只要有成人就给这个变
        //量赋值(覆不覆盖无所谓 让变量有值即可)，所以到最后只需检查这个变量是不是null即可。
        //不能直接在循环中检查非成人值return掉，会操作不成功的，只能通过一个变量解决
        let adultFound = null;
        //检查值的格式，直接用个for循环就能解决，每次循环时依次对 值做各种检查，一个不行就直接return。
        //遍历检查是否有空缺的字段，如果有就return掉。没有就正常往下执行
        for (let passenger of passengers) {
            const keys = Object.keys(passenger);
            for (let key of keys) {
                //注意这块是forof循环，key是其数组的项值，不是下标
                if (!passenger[key]) {
                    return;
                }
            }
            //检查有没有成人，通过一个变量操作来检查有没有成人
            if (passenger.ticketType === 'adult') {
                adultFound = passenger.id;
            }
        }
        //在循环外，最后做个成人变量检查即可
        if (!adultFound) {
            alert('请至少正确添加一个同行成人');
            return;
        }

        dispatch(
            setPassengers([
                ...passengers,
                {
                    id: ++passengerIdSeed,
                    name: '',
                    gender: 'none',
                    birthday: '',
                    followAdult: adultFound,//同行成人
                    ticketType: 'child',
                    seat: 'Z',
                },
            ])
        );
    };
}





//根据id 删除乘客的actioncreator。。这个还是得使用异步的actioncreator
//只有异步的actioncretor才能获取到当前的状态
export function removePassenger(id) {
    return (dispatch, getState) => {
        const { passengers } = getState();
        //利用过滤，将传进来的id对应的乘客，获取到新的乘客集合
         //把这个乘客自己id给删掉，同时也把这个乘客关联的孩子乘客也得给删掉。所以要过滤出followAdult属性。
        const newPassengers = passengers.filter(passenger => {
            return passenger.id !== id && passenger.followAdult !== id;
        });
        //然后直接用这个新的newPassengers替换掉之前的，dispatch一下就好了
        dispatch(setPassengers(newPassengers));
    };
    //把这个actioncreator先传递给App组件再传递给Passengers组件接着传给passenger组件。
}
//更新乘客的actioncreator，这也是异步的。。。然后把这个actioncreator先在app中导入进来然后一路透传给passenger组件
//这是受控组件的onChange回掉函数内容.接受第三个参数是可以自定义删除对应字段的，不想要的字段可以删字段的接口 。
export function updatePassenger(id, data, keysToBeRemoved = []) {
    console.log('更新乘客，往passenger数组乘客对象项里填对应的空白数据，即该乘客id的姓名等详细信息')
    return (dispatch, getState) => { //在第三个参数的数组中出现的key，我们认为是需要被删除的。
        const { passengers } = getState();
        for (let i = 0; i < passengers.length; ++i) {
            //循环中如果通过id找到这个passenger，就给这个passenger的信息给更新
            if (passengers[i].id === id) {
                const newPassengers = [...passengers];
                newPassengers[i] = Object.assign({}, passengers[i], data);

                for (let key of keysToBeRemoved) {
                    //有了这个拓展，就可以方便的删除多余的字段，在showTicketTypeMenu   actioncreator里
                    delete newPassengers[i][key];
                }

                dispatch(setPassengers(newPassengers));

                break;
            }
        }
    };
}
//弹出菜单的实现，通用能力
export function showMenu(menu) {
    //需要两个dispatch，所以还是得使用异步的actioncreator
    return dispatch => {//所以弹出菜单就需要dispatch下menu状态和isMenuvisible状态
        dispatch(setMenu(menu));
        dispatch(setIsMenuVisible(true));
    };
}
//性别弹出菜单的actioncreator，需要传入是id。同样这也是异步的actioncreator，接受dispacth
export function showGenderMenu(id) {
    return (dispatch, getState) => {
        const { passengers } = getState();
        //数组的find方法，找到id对应的乘客
        const passenger = passengers.find(passenger => passenger.id === id);

        if (!passenger) {
            return;
        }
        //如果这个乘客存在我们就弹出菜单，dispatch action，action通过showmenu来实现
        dispatch(
            showMenu({
                onPress(gender) {//这项是点击选中之后，该怎么做。是一个回掉
                    dispatch(updatePassenger(id, { gender }));
                    dispatch(hideMenu());
                },
                options: [
                    {
                        title: '男',
                        value: 'male',
                        active: 'male' === passenger.gender,
                    },
                    {
                        title: '女',
                        value: 'female',
                        active: 'female' === passenger.gender,
                    },
                ],
            })
        );
    };
}

// 声明这个成人出行的弹出菜单的aactioncreator。也是异步的actioncreator
export function showFollowAdultMenu(id) {
    return (dispatch, getState) => {
        const { passengers } = getState();
        //也是先校验乘客ID
        const passenger = passengers.find(passenger => passenger.id === id);

        if (!passenger) {
            return;
        }
        //
        dispatch(
            showMenu({
                onPress(followAdult) {
                    dispatch(updatePassenger(id, { followAdult }));
                    dispatch(hideMenu());
                },
                options: passengers
                //这个有点特殊，需要动态获取当前所有成人的信息
                    .filter(passenger => passenger.ticketType === 'adult')
                    .map(adult => {//过滤完之后，再映射成选项对象的结构
                        return {
                            title: adult.name,
                            value: adult.id,
                            active: adult.id === passenger.followAdult,
                        };
                    }),
            })
        );
    };
}
//切换票类型的弹出菜单的actioncreator函数名
export function showTicketTypeMenu(id) {
    //这个写完后，先由app中引入使用。然后在app中传递给passengers，一直透传给passenger。
    //然后在passenger中车票类型的jsx中添加点击事件。事件处理程序为传进去的showTicketTypeMenu函数
    return (dispatch, getState) => {
        const { passengers } = getState();
        //用的find方法找到这个对应id的乘客项，返回的就是对应项
        const passenger = passengers.find(passenger => passenger.id === id);
        cosole.log(passenger,'看匹配出来的项')
        if (!passenger) {
            return;
        }

        dispatch(
            showMenu({
                onPress(ticketType) {//这是最难的部分，是下面选项点击之后触发的回掉，能将选的类型传进来，
                    if ('adult' === ticketType) {
                        dispatch(
                            updatePassenger(
                                id,
                                {
                                    ticketType,
                                    licenceNo: '',
                                },
                                ['gender', 'followAdult', 'birthday']
                            )
                        );
                    } else {
                        const adult = passengers.find(//判断当前有没有其他的成人乘客
                            passenger =>
                                passenger.id === id &&
                                passenger.ticketType === 'adult'
                        );//找到这样的乘客

                        if (adult) {//如果它存在成人乘客的话，就需要增加三个属性，移除一个属性
                            dispatch(
                                updatePassenger(
                                    id,
                                    {
                                        ticketType,
                                        gender: '',
                                        followAdult: adult.id,
                                        birthday: '',
                                    },
                                    ['licenceNo'] //数组里的值是由actioncreator移除的属性
                                )
                            );
                        } else {
                            alert('没有其他成人乘客');
                        }
                    }
                    //最后无论如何要关闭掉弹窗菜单
                    dispatch(hideMenu());
                },
                options: [
                    {
                        title: '成人票',
                        value: 'adult',
                        active: 'adult' === passenger.ticketType,
                    },
                    {
                        title: '儿童票',
                        value: 'child',
                        active: 'child' === passenger.ticketType,
                    },
                ],
            })
        );
    };
}

//hidemenu逻辑直接就是传开关状态为true就可以了
export function hideMenu() {
    return setIsMenuVisible(false);
}
