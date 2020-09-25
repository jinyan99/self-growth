import React from 'react';
//任何用到jsx的地方都需要用到react。
import hoistNonReactStatic from 'hoist-non-react-statics';
function withStyle(Comp,styles) {
    function NewComp (props) {
        if(props.staticContext){
            props.staticContext.css.push(styles._getCss())
        }
        return <Comp {...props} />
    }
  // hoistNonReactStatic(NewComp, Comp)
  // 这种方式也可以解决 NewComp.loadData = Comp.loadData
    return NewComp
}
export default withStyle