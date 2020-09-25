import {FC} from 'react';
import Menu, {MenuProps} from './menu'
import SubMenu,{SubMenuProps} from './subMenu';
import MenuItem, {MenuItemProps} from './menuItem'

// 交叉类型得需要声明并赋值新类型名
// 类型断言as是伴随着js中赋值运算符的，直接断言给新变量名，以后都拿新变量名用即可
export type IMenuComponent = FC<MenuProps> & {
    Item: FC<MenuItemProps>,
    SubMenu: FC<SubMenuProps>
}

const TransMenu = Menu as IMenuComponent

TransMenu.Item = MenuItem
TransMenu.SubMenu = SubMenu

export default TransMenu;