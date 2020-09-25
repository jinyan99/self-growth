// import React, { ReactElement, InputHTMLAttributes,FC } from 'react';
// import { IconProp} from '@fortawesome/fontawesome-svg-core';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
// type InputSize = 'lg' | 'sm';
// // 第一步：抛出组件props接口类型---(使用ts中的Omit就把size忽略掉了否则当前同名属性size与传入的input原生范型中的size属性同名属性类型冲突了就会报错，下面是忽略掉范型中的number类型以当前string类型为准)
// export interface InputProps extends Omit<InputHTMLAttributes<HTMLElement>, 'size'>{
//     disabled?: boolean;
//     //使用Omit<T,k>来移除忽略InputHTMLAttributes中的size属性，2个参数，第一个参数是传入的泛型，第二个是将传入的范性里面的属性类型给忽略掉，以当前定义的同名属性为准
//     size?: InputSize;
//     icon?: IconProp;
//     prepand?: string | ReactElement;
//     append?: string | ReactElement;
// }
// // 第二步：抛出主组件编写
// export const Input: FC<InputProps> = (props) => {
//     // 1- 取出各种属性
//     // 2- 根据属性计算不同的className预设，用来添加样式
//     return (
//         // 根据属性判断是否要添加特定的节点
//         <>
//         </>
//     )
// }
//========== 上面是组件流程开发思路结构 ===========
//========== 下面是正式组件开发代码文件 ===========
import React from 'react';
import classNames from 'classnames';
import Icon from '../Icon/icon';
/**
 * Input 输入框 通过鼠标或键盘输入内容，是最基础的表单域的包装。
 *
 * ~~~js
 * // 这样引用
 * import { Input } from 'yan.ui'
 * ~~~
 * 支持 HTMLInput 的所有基本属性
 */
export var Input = function (props) {
    var _a;
    var disabled = props.disabled, size = props.size, icon = props.icon, prepend = props.prepend, append = props.append, style = props.style, restProps = __rest(props, ["disabled", "size", "icon", "prepend", "append", "style"]);
    var cnames = classNames('viking-input-wrapper', (_a = {},
        _a["input-size-" + size] = size,
        _a['is-disabled'] = disabled,
        _a['input-group'] = prepend || append,
        _a['input-group-append'] = !!append,
        _a['input-group-prepend'] = !!prepend,
        _a));
    var fixControlledValue = function (value) {
        if (typeof value === 'undefined' || value === null) {
            return '';
        }
        return value;
    };
    // 由于表单组件的受控组件和非受控组件defautValue不能同时存在，会报错，在这里做个判断
    if ('value' in props) {
        // 如果value属性在props中，就delete下restProp中defaultValue以value为主
        delete restProps.defaultValue;
        // 当在故事文件中写受控组件的case中，若useState()默认什么都不填undefiend时，这时候受控的话，在一个组件中react不允许非受控组件转为受控组件，就会报错
        // 所以加了下面的赋值函数，在组件内部中规避这种错误发生
        restProps.value = fixControlledValue(props.value);
    }
    return (React.createElement("div", { className: cnames, style: style },
        prepend && React.createElement("div", { className: "viking-input-group-prepend" }, prepend),
        icon && React.createElement("div", { className: "icon-wrapper" },
            React.createElement(Icon, { icon: icon, title: "title-" + icon })),
        React.createElement("input", __assign({ className: "viking-input-inner", disabled: disabled }, restProps)),
        append && React.createElement("div", { className: "viking-input-group-append" }, append)));
};
export default Input;
