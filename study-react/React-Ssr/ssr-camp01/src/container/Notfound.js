import React from 'react';
import {Route} from 'react-router-dom'
function Status({code,children}) {
    return <Route render={({staticContext})=>{
         if(staticContext) {
            staticContext.statuscode = code //如赋给404
        }
        return children
    }}></Route>
}
function Notfound(props){
   console.log('notfound', props)
   //渲染了这个组件，给staticCOntext赋值：statusCode=404
   return <Static code={404}>
        <h1>大兄帝瞅啥呢</h1>
        <img id='img-404' src="/404.jpg" alt></img>
    </Static>
}
export default Notfound