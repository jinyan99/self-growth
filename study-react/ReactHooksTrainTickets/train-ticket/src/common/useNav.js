import { useCallback } from 'react';
import { h0 } from './fp';

//自定义的Hook钩子也是要需要使用use开头
export default function useNav(departDate, dispatch, prevDate, nextDate) {
    //在这定义的是当用户选的天数小于今天的，就不能点了，因为前一天的车次列表已经失效了过期了，就没必要显示了
    const isPrevDisabled = h0(departDate) <= h0();
    //牢记一天是86400秒，  就是加一天的毫秒数，作为departdate
    //在这定义的是大于20天就不可继续往后一天点了
    const isNextDisabled = h0(departDate) - h0() > 20 * 86400 * 1000;

    const prev = useCallback(() => {
        if (isPrevDisabled) {
            return;
        }
        //如果是正常的，则负责在这直接派发prevDate()
        dispatch(prevDate());
    }, [isPrevDisabled]);

    const next = useCallback(() => {
        if (isNextDisabled) {
            return;
        }
        dispatch(nextDate());
    }, [isNextDisabled]);

    return {
        isPrevDisabled,
        isNextDisabled,
        prev,
        next,
    };
}
