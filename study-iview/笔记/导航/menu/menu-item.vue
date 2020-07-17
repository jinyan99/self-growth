<template>
    <a
        v-if="to"
        :href="linkUrl"
        :target="target"
        :class="classes"
        @click.exact="handleClickItem($event, false)"
        @click.ctrl="handleClickItem($event, true)"
        @click.meta="handleClickItem($event, true)"
        :style="itemStyle"
    >
        <slot></slot>
    </a>
    <li
        v-else
        :class="classes"
        @click.stop="handleClickItem"
        :style="itemStyle"
    >
        <slot></slot>
    </li>
</template>
<script>
    import Emitter from '../../mixins/emitter';
    import { findComponentUpward } from '../../utils/assist';
    import mixin from './mixin';
    import mixinsLink from '../../mixins/link';

    const prefixCls = 'ivu-menu';

    export default {
        name: 'MenuItem',
        mixins: [
            Emitter,
            mixin,
            mixinsLink
        ],
        props: {
            name: {
                type: [String, Number],
                required: true
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                active: false
            };
        },
        computed: {
            classes() {
                return [
                    `${prefixCls}-item`,
                    {
                        [`${prefixCls}-item-active`]: this.active,
                        [`${prefixCls}-item-selected`]: this.active,
                        [`${prefixCls}-item-disabled`]: this.disabled
                    }
                ];
            },
            itemStyle() {
                return this.hasParentSubmenu && this.mode !== 'horizontal'
                    ? {
                        paddingLeft: 43 + (this.parentSubmenuNum - 1) * 24 + 'px'
                      }
                    : {};
            }
        },
        methods: {
            handleClickItem(event, new_window = false) {
                //处理菜单项点击事件
                if (this.disabled) return;

                if (new_window || this.target === '_blank') {
                    // 如果是 new_window,直接新开窗口就行，无需发送状态
                    this.handleCheckClick(event, new_window);//处理点击事件
                    let parentMenu = findComponentUpward(this, 'Menu');
                    //父级有Menu标签时
                    if (parentMenu) parentMenu.handleEmitSelectEvent(this.name);
                } else {
                    //若父级有二级菜单标签时
                    let parent = findComponentUpward(this, 'Submenu');

                    if (parent) {//有时就--直接触发Submenu的预备好的项选中事件，然后传入当前组件名
                        this.dispatch('Submenu', 'on-menu-item-select', this.name);
                    } else {//若没有时--就触发顶级的Menu的项选中事件
                        this.dispatch('Menu', 'on-menu-item-select', this.name);
                    }

                    this.handleCheckClick(event, new_window);
                }
            }
        },
        mounted() {
            this.$on('on-update-active-name', (name) => {
                if (this.name === name) {
                    this.active = true;
                    this.dispatch('Submenu', 'on-update-active-name', name);
                } else {
                    this.active = false;
                }
            });
        }
    };
</script>