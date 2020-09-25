//这文件里面是个actioncreator概念的文件，
//这版是只把actions抽离出文件，dispatch还是在主文件TODO2js里，这时就actioncreater概念文件，这版的定义的dispatch
//功能只支持return action对象形式。下一版改造后的新dispatch就容纳了actioncreator里能return个函数的功能。redux中就容纳了这两种新情况

export function createSet(payload) {
    return {
        type:'set',
        payload
    }
}
export function createAdd(payload) {
    return {
        type:'add',
        payload
    }
}
export function createToggle(payload) {
    return {
        type:'toggle',
        payload
    }
}
export function createRemove(payload) {
    return {
        type:'remove',
        payload
    }
}