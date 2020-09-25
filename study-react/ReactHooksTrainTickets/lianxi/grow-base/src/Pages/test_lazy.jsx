import React,{lazy, Suspense, memo} from 'react';
const TestLazy = lazy(() => import("./test_lazy1"))
const A1 = memo(function  A1(props) {
    console.log(props,'看testlazy的props值，并且渲染一次')
    const callback = () => (<h1>加载中...</h1>)
    return (
        <div>
            <Suspense fallback={callback}>
                <TestLazy></TestLazy>
            </Suspense>
        </div>
    )
})
export default A1;