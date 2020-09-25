import React, { memo, useState, useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import leftPad from 'left-pad';
import useWinSize from '../common/useWinSize';
import './Slider.css';

//每个slider组件里面，都有可拖动的滑块，一旦拖动就会把当前的值同步到bottomjsx中缓冲区中
//我们有两个选择：1是让bottom下发最新的值来修正滑块的位置  2是在slider内部再做个缓冲区
//拖动滑块更新的是这个二级缓冲区中的数据，二级缓冲区的数据再来修正滑块的位置同时再用副作用
//把数据通过callback更新到bottom中去---第二种交互性能更好选择第二种方式
//       二级缓冲区的概念就是：上级透传过来的父级缓冲区的set更新函数，作为当前子组件的批量最后
//        最后执行的set更新函数，当前子组件在把透传过来的值，作层useState或useReducer本地缓存
    //      作为全局整体的二级缓冲区。子组件的都批量更新完后，再回传给一级缓冲区，Bottom组件里的一级缓冲区
//        等所有批量更新完后，再统一触发真正的actioncreator，改变store里的值
    const Slider = memo(function Slider(props) {
    const {
        title,
        currentStartHours,
        currentEndHours,
        //下面2个就是父组件透传过来的缓冲区的set更新函数，这个更新函数会直接更新到父级缓冲区里，后面再统一actioncreator更新
        onStartChanged,
        onEndChanged,
    } = props;

    //因为取客户端的元素的宽度值等clientwidthclientheight这个本身值不是动态更新的。第一次用时只会取它的静态快照，当后面改变屏幕宽度时
    // 也不会自动更新所有关联这个值的。所有需要有额外的自定义hook逻辑加事件监听做到自动更新的
    //useWinSize自定义Hook的作用是，之前是计算滑块可滑动区域宽度的时候，只计算了一次，这样一旦浏览器的窗口尺寸发生变化的时候，相应的百分比计算
    //也一定会出错，可以用自定义Hook来监听窗口的变化---common中创建个useWinSize钩子文件。
    //这个引用自定义hook，作为本组件的一个依赖，当这个自定义hook抛出来的值有变化的话，就需要重新
    //对当前jsx标签中滑块内容区的元素宽度重新计算了
    const winSize = useWinSize();

    //滑块的2个ref绑定，用useref，在拖动时候还要记录坐标距离
    //坐标距离的值的记录不要用state存储，因为它本身的改变不应该去触发组件的重渲染。
    //所以不用state来记录，这时可以用Ref来保存，能跨越组件的渲染生命周期。Ref不仅能存储dom和节点能存储任何数据
    const startHandle = useRef();
    const endHandle = useRef();
    //则用useRef来定义下lastStartX变量等，原则上我们只监听touchmove事件就行了
    //但是touchmove之前的横坐标值必须从touchstart获得到，所以我们就得每个滑块监听2个事件touchstartt和touchmove

    //缓存第一次按下左滑块touchstart事件的横坐标。为了计算滑块要滑动的距离，做减法，只做缓存数据，不绑定节点。
    // 如129行，distance变量的计算。
    const lastStartX = useRef()
     //缓存第一次按下右滑块touchstart事件时的横坐标
     const lastEndX = useRef()

    const range = useRef();
    const rangeWidth = useRef();

    //解决父级组件透传数据currentStartHours改变后，但是useState里的回掉函数里的逻辑是不会更新到的即start不会更新到，还是会走老逻辑，因为useState里回掉函数的写法就是只里面一遍逻辑
    //写了下面的语句，重置按钮之后就能把时间区间给重置了，否则按之前的话useState回掉函数的话，会重置不了的，因为回掉的逻辑只执行一次，所以加了下面的useref可以跨组件缓存的特性判断
    //决定触发下start和end的更新进而触发组件二次渲染
    const prevCurrentStartHours = useRef(currentStartHours);
    const prevCurrentEndHours = useRef(currentEndHours);

    //下面2个useState是创建2个缓冲区。他们只会在组件第一次渲染过程中会使用到
    //过后即使他们值发生了变化，也不会有任何的响应----这有点像componentreceiveprops，当然这个生命周期函数已经被废弃掉了，现在用的是
    //getDerivedStatefromprops--在函数组件中我们怎么实现呢？可以借助Ref创建两个prevCurrentStartHours和prevCurrentEndHours
                            //将当前小时按24小时制转化成百分比
    const [start, setStart] = useState(() => (currentStartHours / 24) * 100);
    const [end, setEnd] = useState(() => (currentEndHours / 24) * 100);//转化成百分比
    //可以借助这两个ref存下来的值，进行判断StartHours和Endhours，上次和当前的是否一样，如果不一样，直接setState触发更新
    //react允许你在渲染过程中再去更新state的值，他能够保证最钟只会更新dom节点一次，所以并不会影响性能，至于死循环倒是很有可能，得小心处理执行条件
    if (prevCurrentStartHours.current !== currentStartHours) {
        setStart((currentStartHours / 24) * 100);
        prevCurrentStartHours.current = currentStartHours;
    }

    if (prevCurrentEndHours.current !== currentEndHours) {
        setEnd((currentEndHours / 24) * 100);
        prevCurrentEndHours.current = currentEndHours;
    }




    //这个是对start做的上下限条件封装，用2个usememo来限制start和end的值，做个限制
    const startPercent = useMemo(() => {
        if (start > 100) {
            return 100;
        }

        if (start < 0) {
            return 0;
        }

        return start;
    }, [start]);

    const endPercent = useMemo(() => {
        if (end > 100) {
            return 100;
        }

        if (end < 0) {
            return 0;
        }

        return end;
    }, [end]);
    //由于滑块上每滑下图标上面都显示当前的时刻，所以还得转成24小时制---
    //即将以百分数基础的时间数  =》 按24小时百分制的 start数 => 转化成 24小时制的小时数
    //这时不能直接用props过来的做24小时制小时数，因为后面都是随百分数变化走的，所以随时动态变化的百分比再自动变成24小时制数
    const startHours = useMemo(() => {
        //希望他是整数，用round来取整
        return Math.round((startPercent * 24) / 100);
    }, [startPercent]);

    const endHours = useMemo(() => {
        return Math.round((endPercent * 24) / 100);
    }, [endPercent]);

    const startText = useMemo(() => {
        //使用第三方模块，单数可以自动补零的 09:00
        return leftPad(startHours, 2, '0') + ':00';
    }, [startHours]);

    const endText = useMemo(() => {
        return leftPad(endHours, 2, '0') + ':00';
    }, [endHours]);


//这4个函数的作用就是设置滑块的坐标初始值
    function onStartTouchBegin(e) {
        const touch = e.targetTouches[0];
        lastStartX.current = touch.pageX;//横坐标
    }

    function onEndTouchBegin(e) {
        const touch = e.targetTouches[0];
        lastEndX.current = touch.pageX;
    }
    function onStartTouchMove(e) {
        const touch = e.targetTouches[0];
        const distance = touch.pageX - lastStartX.current;
        //更新下下次的横坐标，接下来做的是更新的滑块的位置，虽然滑块滑的位置也应该是distance，但是滑块的位置使用百分比来计算的额，所以得把distance改成百分比的形式
        //这得知道整个slider组件的宽度，我们测量下，用给slider类名的标签上加ref绑定测量
        lastStartX.current = touch.pageX;
        setStart((start,props) => { 
            console.log(start,props,'看看一样吗看props值');
            //不一样，这和类组件不一样，没有props参数，只有state参数，这打印出props就是undefined值
            //当前distance距离除以当前环境总宽度算个百分比，除法后，乘以100，就是百分比那个数了，，
            return start + (distance/rangeWidth.current) * 100
        })
    }

    function onEndTouchMove(e) {
        const touch = e.targetTouches[0];
        const distance = touch.pageX - lastEndX.current;
        lastEndX.current = touch.pageX;

        setEnd(end => end + (distance / rangeWidth.current) * 100);
    }

//因为窗口自动改变后，slier元素上的宽度也是自适应变化的，但是这个副作用里面获取宽度如果不写依赖的话
//他不会更新副作用，只会第一次获取到变话之前的元素值，变化后这个useEffect没触发所以就不会更新，所以需要借助
//useEffect依赖的功能。依赖一变，就能触发这个方法重新获取sldier样式宽度。所以就引入了自定义Hook的winSize实时变化的屏幕宽度
//这个副作用 就用来测量range绑定的slider元素的随窗口改变的动态获取的宽度。。。所以用上winSize依赖，窗口变这个值也会变，依赖变了会自动重新执行副作用
    useEffect(() => {
        //获取样式宽度后缓存在ref的变量里面，一般都存在useref里，不存在state里
        rangeWidth.current = parseFloat(
            //这是获取样式属性的方法，获取计算后的样式。
            window.getComputedStyle(range.current).width
        );
    }, [winSize.width]);
//reactHooks组件中怎么操作dom事件呢？？应该用useEffect里面使用操作dom事件，在这里面我们来绑定事件
//useEffect绑定dom事件，专门放在一个useeffect里，专门处理一种dom绑定事件副作用
    useEffect(() => {
        startHandle.current.addEventListener(
            'touchstart',
            onStartTouchBegin,
            false
        );
        startHandle.current.addEventListener(
            'touchmove',
            onStartTouchMove,
            false
        );
        endHandle.current.addEventListener(
            'touchstart',
            onEndTouchBegin,
            false
        );
        endHandle.current.addEventListener(
            'touchmove',
             onEndTouchMove,
              false
        );

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
            );
        };
    });

    //用来将滑动后的数据上报给Bottom组件
    useEffect(() => {
        onStartChanged(startHours);
    }, [startHours,onStartChanged]);

    useEffect(() => {
        onEndChanged(endHours);
    }, [endHours,onEndChanged]);

    return (
        <div className="option">
            <h3>{title}</h3>
            <div className="range-slider">
                {/* 相当于滑块容器区域，只是作容器用，不作定位等副作用用 */}
                <div className="slider" ref={range}>
                {/* 相当于滑块的内容区,定位级别是relative级别的，他下面的子元素都是绝对定位级别的 
                    在这子元素都是以百分比单位，left从透传过来的startHours成的百分比0开始的，这样过来的starthours一变，
                    这边显示也能自动变化
                */}
                 <div
                        className="slider-range"/* 代表的是左右2个滑块之间的距离，中间那条绿线初始值是0 */
                        style={{
                            left: startPercent + '%',
                            width: endPercent - startPercent + '%',
                        }}
                    ></div>
                    {/* 下面2个i标签就是两个滑块。圆的东西 */}
                    <i
                        ref={startHandle}
                        className="slider-handle"
                        style={{
                            left: startPercent + '%',
                        }}
                    >
                        <span>{startText}</span> {/* 左边滑块的文案 */}
                    </i>
                    <i
                        ref={endHandle}
                        className="slider-handle"
                        style={{
                            left: endPercent + '%',
                        }}
                    >
                        <span>{endText}</span>{/* 右边滑块的文案 */}
                    </i>
                </div>
            </div>
        </div>
    );
});

Slider.propTypes = {
    title: PropTypes.string.isRequired,
    currentStartHours: PropTypes.number.isRequired,
    currentEndHours: PropTypes.number.isRequired,
    onStartChanged: PropTypes.func.isRequired,
    onEndChanged: PropTypes.func.isRequired,
};

export default Slider;
