/**
 * @file 混入文件为公共的方法集合。
 *  为目标组件实例植入一个data数据3个计算属性。
 *  menu：顶级的Menu组件实例
 *  hasParentSubmenu：父级是否有Submenu
 *  parentSubmenuNum：父级Submenu的数量
 *  mode：父级Menu采取的模式
 * 
 * 
 * 
 */
import { findComponentUpward, findComponentsUpward } from '../../utils/assist';
export default {
    data () {
        return {
            menu: findComponentUpward(this, 'Menu')
        };
    },
    computed: {
        hasParentSubmenu () {
            return !!findComponentUpward(this, 'Submenu');
        },
        parentSubmenuNum () {
            return findComponentsUpward(this, 'Submenu').length;
        },
        mode () {
            return this.menu.mode;
        }
    }
};
