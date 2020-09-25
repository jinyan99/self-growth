import {useState, useEffect} from 'react'

export default function useWinSize() {
    const [width, setWidth] = useState(document.documentElement.clientWidth)
    const [height, setHeight] = useState(document.documentElement.clientHeight)
    //这个组件就是把任意屏幕宽高设成内部状态state数据，能动态更新，能让他随着resize的变化能动态更新组件用到的宽度高度
    const onResize = () => {
        setWidth(document.documentElement.clientWidth);
        setHeight(document.documentElement.clientHeight)
    }
    useEffect(() => {
        window.addEventListener('resize', onResize, false)
        return () => {
            window.removeEventListener('resize', onResize, false)
        }
    }, [])
    return {width, height}
}