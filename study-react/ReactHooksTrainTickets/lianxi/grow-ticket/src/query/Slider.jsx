import React, {memo, useState, useMemo, useRef, useEffect} from 'react'
import PropTypes from 'prop-types'
import leftPad from 'left-pad'
import useWinSize from '../common/useWinSize'
import './Slider.css'

const Slider = memo(function Slider(props) {
    const {
        title,
        currentStartHours,//初始时间为0小时
        currentEndHours, //初始时间为24小时
        //下面两个就是透传过来的缓冲区的set更新函数
        onStartChanged,
        onEndChanged
    } = props
    console.log(currentStartHours,'子组件--看透传过来的初始时间')
    //当前子组件中，再做下本地缓冲区，这是二级缓冲区。将当前小时按24小时制转化成百分比

    //解决父级组件透传数据改变后，但是useState里的回掉函数里的逻辑是不会更新到的，需要
    //即start不会更新到，还是会走老逻辑，因为useState里回掉函数的写法就是只里面一遍逻辑
    //让回掉里的逻辑也能重新刷新执行到。所以借助下面的useref可以跨组件缓存值的特性判断决定触发下start和end的更新进而触发组件二次渲染
    const prevCurrentStartHours = useRef(currentStartHours)
    const prevCurrentEndHours = useRef(currentEndHours)

    const [start, setStart] = useState(() => (currentStartHours / 24 ) * 100)
    console.log(start,'看透传过来的初始时间')
    const [end, setEnd] = useState(() => (currentEndHours / 24 ) * 100)
    //这个引用自定义hook，作为本组件的一个依赖，当这个自定义hook抛出来的值有变化的话，就需要重新
    //对当前jsx标签中滑块内容区的元素宽度重新计算了
    
    //这些变量必须在声明值后的顺序，let const没有变量提升，只有var有，所以使用必须在定义的后面
    if(prevCurrentStartHours.current !== currentStartHours) {
        setStart((currentStartHours /24) * 100)
        prevCurrentStartHours.current = currentStartHours
    }
    if (prevCurrentEndHours.current !== currentEndHours) {
        setEnd((currentEndHours / 24) * 100);
        prevCurrentEndHours.current = currentEndHours;
    }

    const winSize = useWinSize();
    //这块要记录滑块的坐标数据，每滑一下就要记录下坐标，不希望每改变这个值，就去出发组件的重新熏染
    //所以不用useState存，可以选用useRef来缓存数据，跨越组件声明周期独立存储数据
    const startHandle = useRef()
    const endHandle = useRef()

    //缓存第一次按下左滑块touchstart事件的横坐标。为了touchmove事件 计算滑块要滑动的距离，做减法，只做缓存数据，不绑定节点。
    //如129行，distanc变量的计算
    const lastStartX = useRef()
    //缓存第一次按下右滑块touchstart事件时的横坐标
    const lastEndx = useRef()

    //不用绑定节点，只用来缓存数据，特点可以跨周期缓存，不会引起二次渲染
    const range = useRef()
    const rangeWidth = useRef();

    //这个是对start做的上下限条件限制封装，用usememo优化的
    const startPercent = useMemo(() => {
        if(start > 100)
            return 100
        if(start < 0)
            return 0
        return start
    } , [start])
    const endPercent = useMemo(() => {
        if(end >100) return 100
        if(end < 0) return 0
        return end
    } ,[end])
    //将按24小时百分制的 start数 => 转化成 24小时制的小时数
    const startHours = useMemo(() => {
        return Math.round((startPercent * 24) / 100)
    }, [startPercent])
    const endHours = useMemo(() => {
        return Math.round((endPercent * 24) / 100)
    }, [endPercent])
    // 将startHours小时数 做下 补0操作供页面显示
    const startText = useMemo(() => {
        //将小时数自动补2位，03 04 12点之类的。后缀都是以0分钟开始的
        return leftPad(startHours, 2, '0') + ':00'
    } ,[startHours])
    const endtext = useMemo(() => {
        return leftPad(endHours, 2, '0') + ':00'
    }, [endHours])
    //因为窗口自动改变后，slier元素上的宽度也是自适应变化的，但是这个副作用里面获取宽度如果不写依赖的话
//他不会更新副作用，只会第一次获取到变话之前的元素值，变化后这个useEffect没触发所以就不会更新，所以需要借助
//useEffect依赖的功能。依赖一变，就能触发这个方法重新获取sldier样式宽度。所以就引入了自定义Hook的winSize实时变化的屏幕宽度
    useEffect(() => {
        rangeWidth.current = parseFloat(
            window.getComputedStyle(range.current).width
        )
    },[winSize.width])
    useEffect(() => {
        startHandle.current.addEventListener(
            'touchstart',
            onStartTouchBegin,
            false
        )
        startHandle.current.addEventListener(
            'touchmove',
            onStartTouchMove,
            false
        )
        endHandle.current.addEventListener(
            'touchstart',
            onEndTouchBegin,
            false
        )
        endHandle.current.addEventListener(
            'touchmove',
            onEndTouchMove,
            false
        )
        return () => {
            startHandle.current.removeEventListener(
                'touchstart',
                onStartTouchBegin,
                false
            );
            startHandle.current.removeEventListener(
                'touchmove',
                onStartTouchMove,
                false
            );
            endHandle.current.removeEventListener(
                'touchstart',
                onEndTouchBegin,
                false
            );
            endHandle.current.removeEventListener(
                'touchmove',
                onEndTouchMove,
                false
            )
        }
    })
    function onStartTouchBegin(e) {
        const touch = e.targetTouches[0]//取第0个触摸点、
        //pagex横坐标，是相对于文档的横坐标
        console.log(touch.pageX,touch.clientX,'看左块的触摸事件的左鼠标')
        //存下横坐标到useref里，不存usesttae里，不想触发连续不必要的更新
        lastStartX.current = touch.pageX //横坐标
    }
    function onEndTouchBegin(e) {
        const touch = e.targetTouches[0]
        console.log('看右滑块的触摸事件')
        lastEndx.current = touch.pageX
    }
    function onStartTouchMove(e) {
        console.log('看左块的滑动事件')
        const touch = e.targetTouches[0]
        const distance = touch.pageX - lastStartX.current;
        lastStartX.current = touch.pageX;
        //setState1参可以传对象可以传回掉函数，结果都是与前state进行浅合并
        setStart((start,props) => {
            //当前distance距离除以当前环境总宽度算个百分比，除法后，乘以100，就是百分比那个数了，，
            return start + (distance/rangeWidth.current) * 100
        })
    }
    function onEndTouchMove(e) {
        const touch = e.targetTouches[0]
        console.log('看右块的滑动事件')
        const distance = touch.pageX - lastEndx.current;
        lastEndx.current = touch.pageX;
        setEnd((end) => {
            return (
                end + (distance / rangeWidth.current) * 100
            )
        })
    }
    useEffect(() => {
        onStartChanged(startHours)
    }, [startHours,onStartChanged])
    useEffect(() => {
        onEndChanged(endHours)
    }, [endHours,onEndChanged])
    return <div className="option">
            <h3>{title}</h3>
            <div className="range-slider">
                <div className="slider" ref={range}>
                    <div
                        className="slider-range"
                        style={{
                            left: startPercent + '%',
                            width: endPercent - startPercent + '%'
                        }}
                    >
                    </div>
                    <i
                        ref={startHandle}
                        className="slider-handle"
                        style={{
                            left: startPercent + '%'
                        }}
                    >
                        <span
                            onTouchStart={() => {console.log('点击了')}}
                        >{startText}</span>
                    </i>
                    <i
                        ref={endHandle}
                        className="slider-handle"
                        style={{
                            left: endPercent + '%'
                        }}
                    >
                        <span>{endtext}</span>
                    </i>
                </div>
            </div>
    </div>
})
Slider.propTypes = {
    title: PropTypes.string.isRequired,
    currentStartHours: PropTypes.number.isRequired,
    currentEndHours: PropTypes.number.isRequired,
    onStartChanged: PropTypes.func.isRequired,
    onEndChanged: PropTypes.func.isRequired,
}
export default Slider