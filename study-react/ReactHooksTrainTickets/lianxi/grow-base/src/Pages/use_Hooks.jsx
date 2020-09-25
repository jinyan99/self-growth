import React,{useState, memo, useEffect, useContext, useMemo, useCallback, useRef} from 'react';
import ThemeContext from '../base-context.js';
import useSelfhook from './selfHook';
const A1 = memo(function A1(props) {
    const refb = useRef('ref值');
    const size = useSelfhook(3);
    const count = useContext(ThemeContext)
    //这个count直接就是默认的上下文值，简化了类组件的this.context,这直接就是返回值了
    useEffect(() => {
        console.log(props,'传过来的props')//获取不到App中的ref属性值是类的ref功能的关键字。
        console.log('副作用(相干逻辑)分离第一站',value1,ref1,'<><>',size);
       // setValue(v1) //渲染相同值不会触发重新渲染。
    })
    const [value1,setValue1] = useState(1)
    //这块示范者用useref缓存当前渲染时的变量，下次渲染时ref1获的值还是不变的
    const ref1 = useRef(value1);
    const v1 = '新哈'
    //用这种回掉的方式初始state值，每次渲染时会只执行里面逻辑一次，要变量的，赋值逻辑写在顶层函数体就每次都会渲染一遍逻辑
    const [value,setValue] = useState(() => {return v1 || 0} );
    const double = useMemo(() => {console.log('usememo又执行了');return value1+2} ,[])
    const double1 = useMemo(() => {console.log('usememo又执行了');return ()=>{console.log(33)}} ,[])
    const callback1 = useCallback(() => {console.log('测usecallback显示')}, [])
    const forceupdater = () => {setUpdater(2)}
    console.log(value1,value,'看函数组件的状态值')
    //不用多用context，他会破坏你的组件独立性
    console.log(count,'看函数组件的上下文')
    const [updater,setUpdater] = useState(0)
    return (
        <div onClick={()=> setValue1(2)}>
            <div onClick={forceupdater}> 点击强制渲染</div>
            练习hook组件 --看usememo效果{double1()} {callback1()}
        </div>
    )
})

export default A1;