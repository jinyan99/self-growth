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
import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import Input from '../Input/input';
import Icon from '../Icon/icon';
import useDebounce from '../../hooks/useDebounce';
import useClickOutside from '../../hooks/useClickOutside';
// 第二步抛出主体组件
export var AutoComplete = function (props) {
    var fetchSuggestions = props.fetchSuggestions, onSelect = props.onSelect, value = props.value, renderOption = props.renderOption, restProps = __rest(props, ["fetchSuggestions", "onSelect", "value", "renderOption"]);
    var _a = useState(value), inputValue = _a[0], setInputValue = _a[1]; // 将value断言成仅string类型，否则作为fetchSuggestions参数类型不对报错
    var _b = useState([]), suggestions = _b[0], setSuggestions = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var _d = useState(-1), highlightIndex = _d[0], setHighlightIndex = _d[1];
    // 加入防抖自定义hook
    var debouncedValue = useDebounce(inputValue, 500);
    // 来控制enter键后的多余请求的状态变量
    var triggerSearch = useRef(false);
    // 用来实现clickOutSide的useRef,并有范型的使用融入
    var componentRef = useRef(null);
    // 直接这一行就可以完成这个通用功能
    useClickOutside(componentRef, function () { setSuggestions([]); });
    useEffect(function () {
        if (debouncedValue && triggerSearch.current) {
            var results = fetchSuggestions(debouncedValue);
            if (results instanceof Promise) {
                // 加个loading图标
                setLoading(true);
                results.then(function (data) {
                    setLoading(false);
                    setSuggestions(data);
                });
            }
            else {
                setSuggestions(results);
            }
        }
        else {
            setSuggestions([]);
        }
        //每次下拉菜单显示完都给它高亮Index重制为-1
        setHighlightIndex(-1);
    }, [debouncedValue]);
    var highlight = function (index) {
        if (index < 0)
            index = 0;
        if (index >= suggestions.length) {
            index = suggestions.length - 1;
        }
        setHighlightIndex(index);
    };
    var handleKeyDown = function (e) {
        //KeyboardEvent类型是react内置定义的才可接受范型，需要从react中引入,不引入的话也是react中内置类型不过不支持范型
        switch (e.keyCode) {
            case 13: //回车
                if (suggestions[highlightIndex]) {
                    handleSelect(suggestions[highlightIndex]);
                }
                break;
            case 38: //上
                highlight(highlightIndex - 1);
                break;
            case 40: //下
                highlight(highlightIndex + 1);
                break;
            case 27: //ESC
                setSuggestions([]);
                break;
            default:
                break;
        }
    };
    var handleChange = function (e) {
        var value = e.target.value.trim();
        setInputValue(value);
        triggerSearch.current = true;
        // //下方代码全搬到useEffect分类专门副作用函数处理了
        // //这里要展示github用户名的列表，我们使用一个github官方的接口来做异步处理的测试
        // if (value) {
        //     const results = fetchSuggestions(value);
        //     if (results instanceof Promise) {
        //         // 加个loading图标
        //         setLoading(true)
        //         results.then(data => {
        //             setLoading(false)
        //             setSuggestions(data)
        //         })
        //     } else {
        //         setSuggestions(results);
        //     }
        // } else {
        // 	setSuggestions([]);
        // }
    };
    var handleSelect = function (item) {
        // 这个事件函数要处理三件事
        setInputValue(item.value); // 1- input值更新进去
        setSuggestions([]); // 2- 下拉菜单消失
        if (onSelect) {
            //3- 用户传入onSelect方法被触发
            onSelect(item);
        }
        triggerSearch.current = false;
    };
    var renderTemplate = function (item) {
        return renderOption ? renderOption(item) : item.value;
    };
    var generateDropdown = function () {
        return (React.createElement("ul", null, suggestions.map(function (item, index) {
            var cnames = classNames('suggestion-item', {
                'is-active': index === highlightIndex
            });
            return (React.createElement("li", { key: index, className: cnames, onClick: function () { return handleSelect(item); } }, renderTemplate(item)));
        })));
    };
    return (React.createElement("div", { className: "viking-auto-complete", ref: componentRef },
        React.createElement(Input, __assign({ value: inputValue, onChange: handleChange, onKeyDown: handleKeyDown }, restProps)),
        loading && React.createElement("ul", null,
            "\u52A0\u8F7D\u4E2D...",
            React.createElement(Icon, { icon: "spinner", spin: true })),
        suggestions.length && generateDropdown()));
};
export default AutoComplete;
