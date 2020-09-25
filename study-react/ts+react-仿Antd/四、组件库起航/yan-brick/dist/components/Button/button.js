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
import React from 'react';
// 使用第三方类名动态切换插件classnames
import classNames from 'classnames';
// 2- 确定有哪些是需要的或需要可传入属性后，编写组件主函数从props中提出来
//@EXPORT//@ANNOTATION2
/**
 * 这是我们的第一个Button组件
 * ## Button header
 * ~~~js
 * import {Button} from 'yan.ui'
 * ~~~
 * @param {Object} props
 */
export var Button = function (props) {
    var _a;
    var btnType = props.btnType, className = props.className, // 接受支持用户自定义往组件上加指定类名，然后放到classes里
    disabled = props.disabled, size = props.size, children = props.children, href = props.href, restProps = __rest(props, ["btnType", "className", "disabled", "size", "children", "href"]) // es6展开运算符来接受余下所有属性
    ;
    //console.log(disabled, '看传过来的disabled值');
    // 这里面会有根据不同的size，type等值来切换不同的class类名
    // btn,btn-lg,btn-primary
    var classes = classNames('btn', className, (_a = {},
        _a["btn-" + btnType] = btnType,
        _a["btn-" + size] = size,
        // 这是只给Link类型的才加disabled类名的，不是这个类型会加disabled属性
        _a.disabled = btnType === 'link' && disabled,
        _a));
    if (btnType === 'link' && href) {
        return (React.createElement("a", __assign({ className: classes, href: href }, restProps), children));
    }
    else {
        return (React.createElement("button", __assign({ className: classes, disabled: disabled }, restProps), children));
    }
};
Button.defaultProps = {
    disabled: false,
    btnType: 'default'
};
//@EXPORT
export default Button;
