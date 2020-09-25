//这个函数作用会把timestamp传进来的时间戳变化
export function h0(timestamp = Date.now()) {
    const target = new Date(timestamp);

    target.setHours(0); //这样就可以把时间戳里的，小时部分变成0
    target.setMinutes(0); //分钟部分变成0 
    target.setSeconds(0); //秒部分变成0
    target.setMilliseconds(0);//毫秒部分也变成0

    return target.getTime();
}
