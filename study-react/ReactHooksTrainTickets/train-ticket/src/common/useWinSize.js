import { useState, useEffect } from 'react';

export default function useWinSize() {
    const [width, setWidth] = useState(document.documentElement.clientWidth);
    const [height, setHeight] = useState(document.documentElement.clientHeight);
 // 这个组件就是把屏幕宽高设成内部状态state数据，能动态更新。能让他随着resize自动更新宽度和高度
 // 因为clientwidthclientheight这个本身值不是动态更新的。第一次用时只会取它的静态快照，当后面改变屏幕宽度时
 // 也不会自动更新所有关联这个值的。
 const onResize = () => {
        setWidth(document.documentElement.clientWidth);
        setHeight(document.documentElement.clientHeight);
    };

    useEffect(() => {
        window.addEventListener('resize', onResize, false);

        return () => {
            window.removeEventListener('resize', onResize, false);
        };
    }, []);

    return { width, height };
}
