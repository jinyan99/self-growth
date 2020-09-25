import React, { useContext, FunctionComponentElement ,useState} from 'react';
import classNames from 'classnames';
import { MenuContext } from './menu';
import { MenuItemProps } from './menuItem';
import Icon from '../Icon/icon'
import Transition from '../Transition/transition';

export interface SubMenuProps {
	index?: string;
	title: string;
	className?: string;
}

const SubMenu: React.FC<SubMenuProps> = ({
	index,
	children,
	title,
	className
}) => {
    const context = useContext(MenuContext);

    // 纵向模式默认展开逻辑
    const openedSubMenus = context.defaultOpenSubMenus as Array<string>;
    const isOpened = (index && context.mode === 'vertical') ? openedSubMenus.includes(index) : false;

    const [menuOpen,setOpen] = useState(isOpened);
	// children不用定义在接口里直接就有类型声明
	// 第一步：添加class类名
	const classes = classNames('menu-item submenu-item', className, {
        'is-active': context.index === index,
        // 刚加上图标的动画hover效果后，而垂直模式不需要这个hover效果，这里可以判断加类名来特例hover效果
        // 不用管样式css怎么写，直接就随心所欲加对应需求的名字类名即可，样式填充以后再说
        'is-opened': menuOpen,
        'is-vertical': context.mode === 'vertical'
    });

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setOpen(!menuOpen)
    }

    let timer: any;
    const handleMouse = (e: React.MouseEvent, toggle: boolean) => {
        clearTimeout(timer);
        e.preventDefault()
        timer = setTimeout(() => {
            setOpen(toggle)
        },200)
    }

    const clickEvents = context.mode === 'vertical' ? {
        onClick: handleClick
    }: {}
    const hoverEvents = context.mode !== 'vertical' ? {
        onMouseEnter: (e:React.MouseEvent) => {handleMouse(e,true)},
        onMouseLeave: (e:React.MouseEvent) => {handleMouse(e,false)}

    }:{}
	const renderChildren = () => {
        const subMenuClasses = classNames('viking-submenu', {
            'menu-opened': menuOpen
        })
		const childrenComponent = React.Children.map(children, (child, i) => {
			const childElement = child as FunctionComponentElement<
				MenuItemProps
			>;
			if (childElement.type.displayName === 'MenuItem') {
				return React.cloneElement(childElement, {
                    index: `${index}-${i}`
                })
			} else {
				console.warn(
					'Warnning: SubMenu has a child which is not MenuItem'
				);
			}
		});
		return (
            <Transition
                in={menuOpen}
                timeout={100}
                animation="zoom-in-top"
            >
                <ul className={subMenuClasses}>{childrenComponent}</ul>
            </Transition>
        )
	};
	// 第二步：把render结构写出来
	return (
		<li key={index} className={classes} {...hoverEvents}>
			<div className="submenu-title" {...clickEvents}>
                {title}
                <Icon icon="angle-down" className="arrow-icon"/>
            </div>
			{renderChildren()}
		</li>
	);
};

SubMenu.displayName = 'SubMenu';
export default SubMenu;
