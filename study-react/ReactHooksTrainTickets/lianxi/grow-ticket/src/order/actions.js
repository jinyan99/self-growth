    export const ACTION_SET_TRAIN_NUMBER = "SET_TRAIN_NUMBER"
    export const ACTION_SET_DEPART_STATION = "SET_DEPART_STATION"
    export const ACTION_SET_ARRIVE_STATION = "SET_ARRIVE_STATION"
    export const ACTION_SET_ARRIVE_DATE = "SET_ARRIVE_DATE"
    export const ACTION_SET_DEPART_DATE = "SET_DEPART_DATE"
    export const ACTION_SET_DEPART_TIME_STR = "SET_DEPART_TIME_STR"
    export const ACTION_SET_ARRIVE_TIME_STR = "SET_ARRIVE_TIME_STR"
    export const ACTION_SET_DURATION_STR = "SET_DURATION_STR"
    export const ACTION_SET_SEARCH_PARSED = 'SET_SEARCH_PARSED'
    export const ACTION_SET_PRICE = 'SET_PRICE'
    export const ACTION_SET_SEAT_TYPE = 'SET_SEAT_TYPE'
    export const ACTION_SET_PASSENGERS= 'SET_PASSENGERS'
    export const ACTION_SET_MENU = 'SET_MENU'
    export const ACTION_SET_IS_MENU_VISIBLE = 'SET_IS_MENU_VISIBLE'
    export function setTrainNumber (trainNumber) {
        return {
            type: ACTION_SET_TRAIN_NUMBER,
            payload: trainNumber
        }
    }
    export function setDepartStation (departStation) {
        console.log(departStation,'看看departstation')
        return {
            type: ACTION_SET_DEPART_STATION ,
            payload: departStation
        }
    }
    export function setArriveStation (arriveStation) {
        return {
            type: ACTION_SET_ARRIVE_STATION,
            payload: arriveStation
        }
    }
    export function setArriveDate (arriveDate) {
        return {
            type: ACTION_SET_ARRIVE_DATE,
            payload: arriveDate
        }
    }
    export function setDepartDate (departDate) {
        return {
            type: ACTION_SET_DEPART_DATE,
            payload: departDate
        }
    }
    export function setDepartTimeStr (departTimeStr) {
        return {
            type: ACTION_SET_DEPART_TIME_STR,
            payload: departTimeStr
        }
    }
    export function setArriveTimeStr (arriveTimeStr) {
        return {
            type: ACTION_SET_ARRIVE_TIME_STR,
            payload: arriveTimeStr
        }
    }
    export function setDurationStr (durationStr) {
        return {
            type: ACTION_SET_DURATION_STR,
            payload: durationStr
        }
    }
    export function setSearchParsed(searchParsed) {
        return {
            type: ACTION_SET_SEARCH_PARSED,
            payload: searchParsed
        }
    }
    export function fetchInitial(url) {
        return (dispatch, getState) => {
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    const {
                        departTimeStr,
                        arriveTimeStr,
                        arriveDate,
                        durationStr,
                        price
                    } = data
                    dispatch(setDepartTimeStr(departTimeStr))
                    dispatch(setArriveTimeStr(arriveTimeStr))
                    dispatch(setArriveDate(arriveDate))
                    dispatch(setDurationStr(durationStr))
                    dispatch(setPrice(price))
                })
        }
    }
    export function setSeatType(seatType) {
        return {
            type: ACTION_SET_SEAT_TYPE,
            payload: seatType
        }
    }
    export function setPrice(price) {
        return {
            type: ACTION_SET_PRICE,
            payload: price
        }
    }
    export function setPassengers(passengers) {
        console.log(passengers,'要加的信息')
        return {
            type: ACTION_SET_PASSENGERS,
            payload: passengers
        }
    }

    //passenger组件的添加成人的actioncreator函数
    let passengerIdSeed = 0
    export function createAdult() {
        return (dispatch, getState) => {
            const {passengers } = getState()
            //添加乘客时先进行预检查，是否有空缺字段，如果有就return掉，没有就继续执行
            for( let passenger of passengers) {
                const keys = Object.keys(passenger)
                for (let key of keys) {
                    if( !passenger[key]) return
                }
            }
            //检查没有空字段后，再进行添加乘客信息，调setPassengers添加数据
            dispatch(
                setPassengers([
                    ...passengers,
                    {
                        id: ++passengerIdSeed,
                        name: '',
                        ticketType: 'adult',
                        licenceNo: '150',
                        seat: 'Z'
                    }
                ])
            )
        }
    }
    export function createChild() {
        console.log('点击添加儿童了')
        return (dispatch, getState) => {
            const { passengers} = getState()
            let adultFound = null;
            //遍历检查是否有空缺字段
            for ( let passenger of passengers) {
                const keys = Object.keys(passenger)
                for (let key in keys) {
                    //这块是数组的下标，得keys[key],也可以直接写forof循环，直接写key就可以了
                    if(!passenger[keys[key]]) return
                }
                //检查当前有没有成人
                if( passenger.ticketType === 'adult')
                    adultFound = passenger.id
            }
            if(!adultFound) {
                alert('请至少正确添加一个同形成人')
                return
            }
            console.log('点添加儿童了')
            dispatch(
                setPassengers([
                    ...passengers,
                    {
                        id: ++passengerIdSeed,
                        name: '',
                        gender: 'none',
                        birthday: '9999',
                        followAdult: adultFound,
                        ticketType: 'child',
                        seat: 'Z'
                    }
                ])
            )
        }
    }
    export function removePassenger(id) {
        console.log('删除乘客了')
        return (dispatch, getState) => {
            const {passengers}  = getState()
            //把这个乘客自己id给删掉，同时也把这个乘客关联的孩子乘客也得给删掉。所以要过滤出followAdult属性。
            const newPassengers  = passengers.filter(passenger => {
                return passenger.id !== id && passenger.followAdult !== id;
            })
            dispatch (setPassengers(newPassengers))
        }
    }
    export function updatePassenger(id,data, keysToBeRemove = []) {
        console.log('更新乘客，往passenger数组乘客对象项里填对应的空白数据，即该乘客id的姓名等详细信息')
        return (dispatch, getState) => {
            const { passengers} = getState();
            for ( let i = 0; i < passengers.length; i++) {
                if(passengers[i].id === id) {
                    const newPassengers = [...passengers]
                    newPassengers[i] = Object.assign({} , passengers[i], data)
                    for (let key of keysToBeRemove) {
                        delete newPassengers[i][key]
                    }
                    dispatch (setPassengers(newPassengers))
                    break
                }
            }
        }
    }
    export function showTicketTypeMenu(id) {
        console.log('展现车票类型菜单')
        return (dispatch, getState) => {
            const { passengers} = getState()
            console.log(passengers,'看看最新的store的乘客信息')
            //用的find方法找到这个对应id的乘客项，返回的就是对应项
            const passenger = passengers.find(passenger => passenger.id === id)
            if(!passenger) return
            dispatch(
                showMenu({})
            )
        }
    }
    //弹出菜单的actioncreator通用能力
    export function showMenu(menu) {
        return dispatch => {
            dispatch(setMenu(menu))
            dispatch(setIsMenuVisible(true))
        }
    }
    export function setMenu(menu) {
        return {
            type: ACTION_SET_MENU,
            payload: menu
        }
    }
    export function setIsMenuVisible(isMenuVisible) {
        return {
            type: ACTION_SET_IS_MENU_VISIBLE,
            payload: isMenuVisible
        }
    }