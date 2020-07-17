<template>
    <li
        :class="classes"
        @mouseenter="handleMouseenter"
        @mouseleave="handleMouseleave"
    >
        <div
            :class="[prefixCls + '-submenu-title']"
            ref="reference"
            @click.stop="handleClick"
            :style="titleStyle"
        >
            <slot name="title"></slot>
            <Icon
                :type="arrowType"
                :custom="customArrowType"
                :size="arrowSize"
                :class="[prefixCls + '-submenu-title-icon']"
            />
        </div>
        <collapse-transition v-if="mode === 'vertical'">
            <ul :class="[prefixCls]" v-show="opened">
                <slot></slot>
            </ul>
        </collapse-transition>
        <transition name="slide-up" v-else>
            <Drop
                v-show="opened"
                placement="bottom"
                ref="drop"
                :style="dropStyle"
                ><ul :class="[prefixCls + '-drop-list']">
                    <slot></slot>
                </ul>
            </Drop>
        </transition>
    </li>
</template>
<script>
import Drop from "../select/dropdown.vue";
import Icon from "../icon/icon.vue";
import CollapseTransition from "../base/collapse-transition";
import {
    getStyle,
    findComponentUpward,
    findComponentsDownward
} from "../../utils/assist";
import Emitter from "../../mixins/emitter";
// 含menu：顶级的Menu组件实例，通过find方法找到的组件，可以直接利用它执行顶级menu组件的方法
    // hasParentSubmenu：父级是否有Submenu
    // parentSubmenuNum：父级Submenu的数量
    // mode：Menu模式
import mixin from "./mixin";

const prefixCls = "ivu-menu";

export default {
    name: "Submenu",
    mixins: [Emitter, mixin],
    components: { Icon, Drop, CollapseTransition },
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
            prefixCls: prefixCls,
            active: false,
            opened: false,
            dropWidth: parseFloat(getStyle(this.$el, "width"))
        };
    },
    computed: {
        classes() {
            return [
                `${prefixCls}-submenu`,
                {
                    [`${prefixCls}-item-active`]:
                        this.active && !this.hasParentSubmenu,
                    [`${prefixCls}-opened`]: this.opened,
                    [`${prefixCls}-submenu-disabled`]: this.disabled,
                    [`${prefixCls}-submenu-has-parent-submenu`]: this
                        .hasParentSubmenu,
                    [`${prefixCls}-child-item-active`]: this.active
                }
            ];
        },
        accordion() {
            return this.menu.accordion;
        },
        dropStyle() {
            let style = {};

            if (this.dropWidth) style.minWidth = `${this.dropWidth}px`;
            return style;
        },
        titleStyle() {
            return this.hasParentSubmenu && this.mode !== "horizontal"
                ? {
                      paddingLeft: 43 + (this.parentSubmenuNum - 1) * 24 + "px"
                  }
                : {};
        },
        // 3.4.0, global setting customArrow 有值时，arrow 赋值空
        //@TODO ?还没看完。。。。
        arrowType() {
            let type = "ios-arrow-down";

            if (this.$IVIEW) {
                if (this.$IVIEW.menu.customArrow) {
                    type = "";
                } else if (this.$IVIEW.menu.arrow) {
                    type = this.$IVIEW.menu.arrow;
                }
            }
            return type;
        },
        // 3.4.0, global setting
        customArrowType() {
            let type = "";

            if (this.$IVIEW) {
                if (this.$IVIEW.menu.customArrow) {
                    type = this.$IVIEW.menu.customArrow;
                }
            }
            return type;
        },
        // 3.4.0, global setting
        arrowSize() {
            let size = "";

            if (this.$IVIEW) {
                if (this.$IVIEW.menu.arrowSize) {
                    size = this.$IVIEW.menu.arrowSize;
                }
            }
            return size;
        }
    },
    methods: {
        //下面三个方法都会通知menu层的updateOpenKeys进行同步下状态，因为submenu的展开效果与menu层逻辑有关联
        /**
         * ---------------水平模式--------------------------
         * 下面两个滑过事件，只针对于menu的水平模式，垂直模式禁用。
         * 
         */
        //当滑过Submenu时触发的进入事件
        handleMouseenter() {
            if (this.disabled) return;
            //垂直格式，滑过无效，得点击才行，水平的滑过默认展开
            if (this.mode === "vertical") return;
            //当滑过Submenu二级菜单项时，延时250ms进行 展开函数执行---每次执行时都需提前清除下延时器变量
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.menu.updateOpenKeys(this.name);
                this.opened = true;
            }, 250);
        },
        //当滑出Submenu时触发的离开事件
        handleMouseleave() {
            if (this.disabled) return;
            if (this.mode === "vertical") return;

            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                //划入离开时都执行这个openKeys的update函数，它是涵盖各种情况的。
                this.menu.updateOpenKeys(this.name);
                this.opened = false;
            }, 150);
        },
        /**
         * ---------------垂直模式-------------------------
         * Submenu 的title点击函数：menu水平模式，点击效果忽略，走的是上面两个滑过离开函数效果
         *                         menu垂直模式，点击效果正常支持，点击后展开
         * 
         */
        handleClick() {
            console.log('点击Submenu标题了')
            if (this.disabled) return;
            //若当前为水平的，则直接return，水平是hover的不让点击
            if (this.mode === "horizontal") return;
            const opened = this.opened;
            //当手风琴模式时：先让其兄弟级的Submenu展开状态为关闭状态
            if (this.accordion) {
                this.$parent.$children.forEach(item => {
                    if (item.$options.name === "Submenu") item.opened = false;
                });
            }
            //最后让自己的状态为取反状态
            this.opened = !opened;
            //通知Menu层，发送状态执行目标name的updateOpenKeys函数
            this.menu.updateOpenKeys(this.name);
        }
    },
    watch: {
        mode(val) {
            if (val === "horizontal") {
                this.$refs.drop.update();
            }
        },
        opened(val) {
            if (this.mode === "vertical") return;
            if (val) {
                // set drop a width to fixed when menu has fixed position
                this.dropWidth = parseFloat(getStyle(this.$el, "width"));
                this.$refs.drop.update();
            } else {
                this.$refs.drop.destroy();
            }
        }
    },
    mounted() {
        this.$on("on-menu-item-select", name => {
            if (this.mode === "horizontal") this.opened = false;
            this.dispatch("Menu", "on-menu-item-select", name);
            return true;
        });
        //@TODO 还不懂
        this.$on("on-update-active-name", status => {
            if (findComponentUpward(this, "Submenu"))
                this.dispatch("Submenu", "on-update-active-name", status);
            if (findComponentsDownward(this, "Submenu"))
                findComponentsDownward(this, "Submenu").forEach(item => {
                    item.active = false;
                });
            this.active = status;
        });
    }
};
</script>
