import React, { useState, createContext } from 'react';
import classNames from 'classnames';
import { MenuItemProps } from './menuItem';

// 由于下方onSelect函数类型都是一样的，MenuProps和IMenuContext里会重复写两遍所以写个类型抽出来
type SelectCallback = (selectedIndex: string) => void;

type MenuMode = 'horizontal' | 'vertical';
export interface MenuProps {
	defaultIndex?: string;
	className?: string;
	mode?: MenuMode;
	style?: React.CSSProperties; // react 自己提供的
    onSelect?: (selectIndex: string) => void;
    defaultOpenSubMenus?: string[]
}
// 此时该层被用户传的一些属性如onSelect属性怎么传给他的子组件，子组件都是由children显示的没法用props传递--可采取context
interface IMenuContext {
	index: string;
    onSelect?: SelectCallback;
    mode?: string,
    defaultOpenSubMenus?: string[]
}
// context需要给子组件用所以export出去
export const MenuContext = createContext<IMenuContext>({ index: '0' });
// 当我们点击MenuItem时，会切换active状态，而且active有且只有一个，就需要在整个父组件中添加一个state，指示当前state是哪一个
const Menu: React.FC<MenuProps> = (props) => {
	const { className, mode, style, children, defaultIndex, onSelect, defaultOpenSubMenus } = props;
	const [currentActive, setActive] = useState(defaultIndex);
	const classes = classNames('viking-menu', className, {
        'menu-vertical': mode === 'vertical',
        'menu-horizental': mode !== 'vertical'
	});
	// 父组件handleSelect传递给子组件handleSelect要做两件事，不能直接把props收的直接传给子组件，还需要控制下active的逻辑
	const handleClick = (index: string) => {
		setActive(index);
		if (onSelect) {
			onSelect(index);
		}
	};
	const passedContext: IMenuContext = {
		index: currentActive ? currentActive:'0',
        onSelect: handleClick,
        mode,
        defaultOpenSubMenus
    };
    // react官方方法来循环children来判断子节点类型
    const renderChildren = () => {
        return React.Children.map(children,(child,index) => {
            const childElement = child as React.FunctionComponentElement<MenuItemProps>
            // 类型断言后，childElement就能拿到functionComponent上面的各种属性了
            const {displayName} = childElement.type;
            if (displayName === 'MenuItem' || displayName === 'SubMenu') {
                // return child 需要动态添加属性所以借助cloneElement方法
                return React.cloneElement(childElement, {index: index+''})
            }else {
                console.warn('Warning:Menu has a child which is not a MenuItem component')
            }
        })
    }
	return (
		<ul className={classes} style={style} data-testid="test-menu">
			<MenuContext.Provider value={passedContext}>
				{/* {children} */}
                {renderChildren()}
			</MenuContext.Provider>
		</ul>
	);
};
Menu.defaultProps = {
	defaultIndex: '0',
    mode: 'horizontal',
    defaultOpenSubMenus: []
};

export default Menu;
