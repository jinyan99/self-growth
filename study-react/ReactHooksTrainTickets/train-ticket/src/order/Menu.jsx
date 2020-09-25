import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './Menu.css';
//在这来定义menu组件
const MenuItem = memo(function MenuItem(props) {
    const { 
        onPress, 
        title, 
        value, //唯一代表这个选项的值
        active //当前选项是否被选中
    } = props;
    return (
        <li
            className={classnames({ active })}
            onClick={() => {
                onPress(value);
            }}
        >
            {title}
        </li>
    );
});

MenuItem.propTypes = {
    onPress: PropTypes.func,
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    active: PropTypes.bool.isRequired,
};
//这是主组件
const Menu = memo(function Menu(props) {
    const { 
            show,
            options,
            onPress,
            hideMenu
        } = props;
    return (
        <div>
            {show && (//show开关，用于点击任何地方都能关闭菜单
                <div className="menu-mask" onClick={() => hideMenu()}>
                    {/* 这个div是全透明的浮层 ，有弹出的组件，必须得设个全透明的背景，防止误点不必要的内容，方便点空白处就切换开关*/}
                </div>
            )}
            <div className={classnames('menu', { show })}>
                <div className="menu-title"></div>
                <ul>
                    {options &&
                        options.map(option => {
                            return (
                                <MenuItem
                                    key={option.value}
                                    {...option}
                                    onPress={onPress}
                                ></MenuItem>
                            );
                        })}
                </ul>
            </div>
        </div>
    );
});

Menu.propTypes = {
    show: PropTypes.bool.isRequired,
    options: PropTypes.array,
    onPress: PropTypes.func,
    hideMenu: PropTypes.func.isRequired,
};

export default Menu;
