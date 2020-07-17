<template>
    <ul :class="classes" :style="styles">
        <slot></slot>
    </ul>
</template>
<script>
import { oneOf, findComponentsDownward, findComponentsUpward } from '../../utils/assist';
import Emitter from '../../mixins/emitter';

const prefixCls = 'ivu-menu';

export default {
    name: 'Menu',
    mixins: [ Emitter ],
    props: {
        mode: {
            validator(value) {
                return oneOf(value, ['horizontal', 'vertical'])
            },
            default: 'vertical'
        },
        theme: {
            validator(value) {
                return oneOf(value, ['light', 'dark', 'primary'])
            },
            default: 'light'
        },
        activeName: {
            type: [String, Number]
        },
        openNames: {
            type: Array,
            default() {
                return []
            }
        },
        accordion: {
            type: Boolean,
            default: false
        },
        width: {
            type: String,
            default: '240px'
        }
    },
    data() {
        return {
            //当前点击激活后的菜单项的name值
            currentActiveName: this.activeName,
            //submenu展开的菜单项的name值如[3]
            openedNames: []
        }
    },
    computed: {
        classes() {
            let theme = this.theme;
            if (this.mode === 'vertical' && this.theme === 'primary') theme = 'light';
            // 巧用组件地class用法，props变量直接换到类名上加以控制
            return [
                `${prefixCls}`,
                `${prefixCls}-${theme}`,
                {
                    [`${prefixCls}-${this.mode}`]: this.mode
                }
            ];
        },
        styles() {
            let style = [];
            if (this.mode === 'vertical') style.width = this.width;
            return style;
        }
    },
    methods: {
        updateActiveName() {
            //更新激活的名字
            if (this.currentActiveName === undefined) {
                this.currentActiveName = -1;
            }
            // 需要广播事件，@TODO 还没看懂
            this.broadcast('Submenu', 'on-update-active-name', false);
            this.broadcast('MenuItem', 'on-update-active-name', this.currentActiveName)
        },
        //更新展开的键名
        updateOpenKeys(name) {
            let names = [...this.openedNames];
            const index = names.indexOf(name);
            //@TODO 没看懂--若当前有手风琴，让它子项的展开状态都为false 
            if (this.accordion) findComponentsDownward(this, 'Submenu').forEach(item => {
                item.opened = false;
            });
            if (index >= 0) {
                let currentSubmenu = null;
                //让下级对应名字的子项opened设为false
                findComponentsDownward(this, 'Submenu').forEach(item => {
                    if (item.name === name) {
                        currentSubmenu = item;
                        item.opened = false;
                    }
                });
                // 让下级@TODO...
                findComponentsUpward(currentSubmenu, 'Submenu').forEach(item => {
                    item.opened = true;
                });
                findComponentsDownward(currentSubmenu, 'Submenu').forEach(item => {
                    item.opened = false;
                });
            } else {
                if (this.accordion) {
                    let currentSubmenu = null;
                    findComponentsDownward(this, 'Submenu').forEach(item => {
                        if (item.name === name) {
                            currentSubmenu = item;
                            item.opened = true;
                        }
                    });
                    findComponentsUpward(currentSubmenu, 'Submenu').forEach(item => {
                        item.opened = true;
                    });
                } else {
                    findComponentsDownward(this, 'Submenu').forEach(item => {
                        if (item.name === name) item.opened = true;
                    });
                }
            }
            let openedNames = findCOmponentDownward(this, 'Submenu')
                .filter(item => item.opened)
                .map(item => item.name);
            this.openedNames = [...openedNames];
            this.$emit('on-open-change', openedNames);
        },
        //更新展开??
        updateOpened() {
            const items = findComponentsDownward(this, 'Submenu');

            if (items.length) {
                items.forEach(item => {
                    if (this.openedNames.indexOf(item.name) > -1) item.opened = true;
                    else item.opened = false;
                })
            }
        },
        //处理触发选中事件
        handleEmitSelectEvent(name) {
            this.$emit('on-select', name);
        }
    },
    mounted() {
        this.openedNames = [...this.openNames];
        this.updateOpened();
        this.$nextTick(() => this.updateActiveName());
        this.$on('on-menu-item-select', name => {
            this.currentActiveName = name;
            this.$emit('on-select', name)
        });
    },
    watch: {
        openNames(names) {
            this.openedNames = names;
        },
        activeName(val) {
            this.currentActiveName = val;
        },
        currentActiveName() {
            this.updateActiveName();
        }
    }
}
</script>