//这个公共函数会把进来的事件戳按需要转化成小时一下的全变成0，供给外界出发日期场景使用
export function h0(timestamp = Date.now()) {
    const target = new Date(timestamp)
    target.setHours(0)
    target.setMinutes(0);
    target.setSeconds(0);
    target.setMilliseconds(0);
    return target.getTime()
}