<template>
    <a
        v-if="to"
        :href="linkUrl"
        :target="target"
        :class="classes"
        @click.exact="handleClickItem($event, false)"
        @click.ctrl="handleClickItem($event, true)"
        @click.meta="handleClickItem($event, true)"
        :style="itemStyle"><slot></slot></a>
    <li v-else :class="classes" @click.stop="handleClickItem" :style="itemStyle"><slot></slot></li>
</template>
<script>
/**
 * menuitem组件模板标签分析：
 *      1-若传to地址就用a标签，若没传to地址就用普通的li标签。
 *      2-.stop是阻止冒泡的意思
 */
    import Emitter from '../../mixins/emitter';
    import { findComponentUpward } from '../../utils/assist';
    // 含menu：顶级的Menu组件实例
    // hasParentSubmenu：父级是否有Submenu
    // parentSubmenuNum：父级Submenu的数量
    // mode：Menu模式
    import mixin from './mixin';
    // 含to replace target append4个prop值 linkUrl 1个计算属性值 handleCheckClick方法值
    import mixinsLink from '../../mixins/link';

    const prefixCls = 'ivu-menu';

    export default {
        name: 'MenuItem',
        mixins: [ Emitter, mixin, mixinsLink ],
        props: {
            name: {
                //菜单项的唯一标识，必填
                type: [String, Number],
                required: true
            },
            disabled: {
                //当前菜单项是否禁用
                type: Boolean,
                default: false
            },
        },
        data () {
            return {
                //当前项是否是激活状态
                active: false
            };
        },
        computed: {
            classes () {
                return [
                    `${prefixCls}-item`,
                    {
                        [`${prefixCls}-item-active`]: this.active,
                        [`${prefixCls}-item-selected`]: this.active,
                        [`${prefixCls}-item-disabled`]: this.disabled
                    }
                ];
            },
            itemStyle () {
                return this.hasParentSubmenu && this.mode !== 'horizontal' ? {
                    paddingLeft: 43 + (this.parentSubmenuNum - 1) * 24 + 'px'
                } : {};
            }
        },
        methods: {
            handleClickItem (event, new_window = false) {
                console.log(event,new_window,'看点击时传的2参数')
                if (this.disabled) return;

                if (new_window || this.target === '_blank') {
                    // 如果是 new_window或_blank，都直接新开窗口就行，无需发送状态
                    this.handleCheckClick(event, new_window);
                    let parentMenu = findComponentUpward(this, 'Menu');
                    if (parentMenu) parentMenu.handleEmitSelectEvent(this.name);
                } else {
                    // 否则是当前处理，
                    // 得向上发送状态---发送完状态处理点击后效果(_blank类的直接新窗口了不需向上发送状态)
                    //先向上找最近的Submenu组件，
                    let parent = findComponentUpward(this, 'Submenu');

                    if (parent) {
                        //若存在，发送状态-向上派发menuitemselect事件
                        this.dispatch('Submenu', 'on-menu-item-select', this.name);
                    } else {
                        // 若不存在，则直接向Menu上派发menuitemselect事件
                        this.dispatch('Menu', 'on-menu-item-select', this.name);
                    }

                    this.handleCheckClick(event, new_window);
                }
            }
        },
        mounted () {
            this.$on('on-update-active-name', (name) => {
                if (this.name === name) {
                    //menu层触发时传进来的activename名字若与该组件的name相同时，则可以当前状态为激活true
                    //menu是向下广播的，会遍历所有menuitem组件所以得需要判断name匹配才行
                    this.active = true;
                    //当Menu层广播到这个组件事件时，该组件还得向Submenu上派发下这个事件，要是上面没有submenu就算了
                    this.dispatch('Submenu', 'on-update-active-name', name);
                } else {
                    //若menu层初始化时没传默认activename的话，或当前组件name不匹配时，则设当前组件激活状态为false
                    this.active = false;
                }
            });
        }
    };
</script>
