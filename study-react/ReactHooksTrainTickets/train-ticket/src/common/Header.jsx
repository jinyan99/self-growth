//文件中只要有jsx存在就一定要引入react。
import React from 'react';
//npm i prop-types --save
import PropTypes from 'prop-types';
import './Header.css';

export default function Header(props) {
    //设计函数组件，时的props参数接受设置，主要看上层怎么使用的，根据使用决定传什么参数，
    //从效果图能看出就两个东西返回按钮和标题 就认为接受2参数即可
    const { onBack, title } = props;
    return (
        <div className="header">
            <div className="header-back" onClick={onBack}>
             {/* 用一个简单的svg来显示箭头图形*/}
                <svg width="42" height="42">
                    <polyline /* 折线的写法 */
                        points="25,13 16,21 25,29"
                        stroke="#fff"
                        strokeWidth="2"
                        fill="none"
                    />
                </svg>
            </div>
            <h1 className="header-title">{title}</h1>
        </div>
    );
}
//用PropTypes插件的声明传入值的类型，之前都是类组件用的propTypes，这下在函数组件中用的化，放在函数组件的静态属性上
Header.propTypes = {
    onBack: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
};
