import React, { useState, createContext } from 'react';
import classNames from 'classnames';
// context需要给子组件用所以export出去
export var MenuContext = createContext({ index: '0' });
// 当我们点击MenuItem时，会切换active状态，而且active有且只有一个，就需要在整个父组件中添加一个state，指示当前state是哪一个
var Menu = function (props) {
    var className = props.className, mode = props.mode, style = props.style, children = props.children, defaultIndex = props.defaultIndex, onSelect = props.onSelect, defaultOpenSubMenus = props.defaultOpenSubMenus;
    var _a = useState(defaultIndex), currentActive = _a[0], setActive = _a[1];
    var classes = classNames('viking-menu', className, {
        'menu-vertical': mode === 'vertical',
        'menu-horizental': mode !== 'vertical'
    });
    // 父组件handleSelect传递给子组件handleSelect要做两件事，不能直接把props收的直接传给子组件，还需要控制下active的逻辑
    var handleClick = function (index) {
        setActive(index);
        if (onSelect) {
            onSelect(index);
        }
    };
    var passedContext = {
        index: currentActive ? currentActive : '0',
        onSelect: handleClick,
        mode: mode,
        defaultOpenSubMenus: defaultOpenSubMenus
    };
    // react官方方法来循环children来判断子节点类型
    var renderChildren = function () {
        return React.Children.map(children, function (child, index) {
            var childElement = child;
            // 类型断言后，childElement就能拿到functionComponent上面的各种属性了
            var displayName = childElement.type.displayName;
            if (displayName === 'MenuItem' || displayName === 'SubMenu') {
                // return child 需要动态添加属性所以借助cloneElement方法
                return React.cloneElement(childElement, { index: index + '' });
            }
            else {
                console.warn('Warning:Menu has a child which is not a MenuItem component');
            }
        });
    };
    return (React.createElement("ul", { className: classes, style: style, "data-testid": "test-menu" },
        React.createElement(MenuContext.Provider, { value: passedContext }, renderChildren())));
};
Menu.defaultProps = {
    defaultIndex: '0',
    mode: 'horizontal',
    defaultOpenSubMenus: []
};
export default Menu;
