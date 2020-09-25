import React,{Component, useState} from 'react';
//这是自定义Hook,相当于自定义封装的hook，就是输入输出不同
function useSize(props) {

    const [size,setSize] = useState(props || 2);
 //   return size;
    return [size,setSize]
}
export default useSize