<template>
    <ul :class="classes" :style="styles"><slot></slot></ul>
</template>
<script>
    import { oneOf, findComponentsDownward, findComponentsUpward } from '../../utils/assist';
    import Emitter from '../../mixins/emitter';

    const prefixCls = 'ivu-menu';
/**
 * 该组件是用户首级组件，用户传进最多2个事件：on-select(选择菜单（MenuItem）时触发)
 *                                        on-open-change(当 展开/收起 子菜单时触发)
 * 该组件可以在任何时机触发这两个事件执行用户自定义的事件函数。
 */
    export default {
        name: 'Menu',
        mixins: [ Emitter ],
        props: {
            mode: {
                validator (value) {
                    return oneOf(value, ['horizontal', 'vertical']);
                },
                default: 'vertical'
            },
            theme: {
                validator (value) {
                    return oneOf(value, ['light', 'dark', 'primary']);
                },
                default: 'light'
            },
            activeName: {
                type: [String, Number]
            },
            //设置open-names可以指定默认展开指定的子菜单。数组里面只是submneu标签的name值，[2,3]即name为2和3的两个submenu默认展开
            openNames: {
                type: Array,
                default () {
                    return [];
                }
            },
            //手风琴效果参数
            accordion: {
                type: Boolean,
                default: false
            },
            width: {
                type: String,
                default: '240px'
            }
        },
        data () {
            return {
                //当前点击激活后的菜单项的name值-即当前menu组件的直接子组件的各项name值，有可能是submenu或menuitem
                currentActiveName: this.activeName,
                //submenu展开的菜单项的name值如[3]就是name为3的submenu菜单当前是展开状态，收起则
                //此数组里的值清空。
                openedNames: []
            };
        },
        computed: {
            classes () {
                let theme = this.theme;
                if (this.mode === 'vertical' && this.theme === 'primary') theme = 'light';

                return [
                    `${prefixCls}`,
                    `${prefixCls}-${theme}`,
                    {
                        [`${prefixCls}-${this.mode}`]: this.mode
                    }
                ];
            },
            styles () {
                let style = {};

                if (this.mode === 'vertical') style.width = this.width;

                return style;
            }
        },
        methods: {
            //当前激活名字变时触发此函数
            updateActiveName () {
                console.log('触发 updateActiveName函数')
                if (this.currentActiveName === undefined) {
                    this.currentActiveName = -1;
                }
                //开始向下广播事件(可以跨层级的向下广播触发对应组件注册的on-update-active-name事件)
                this.broadcast('Submenu', 'on-update-active-name', false);//如广播子组件的注册事件效果就是当点击(划过)二级菜单项时会让二级菜单展开下拉效果
                this.broadcast('MenuItem', 'on-update-active-name', this.currentActiveName);//触发menuitem组件注册好的on-update-active-name事件
            },
            /**
             * 当点击二级菜单Submenu时，会执行这个目标展开函数
             * 
             * @param {string} name 接受指定的name名字，然后找对应这个名字组件进行展开更新
             */
            updateOpenKeys (name) {
                let names = [...this.openedNames];
                const index = names.indexOf(name);
                //若当前是手风琴模式，则先向下寻找所有Submenu组件全部展开状态置为false
                if (this.accordion) findComponentsDownward(this, 'Submenu').forEach(item => {
                    item.opened = false;
                });
                // 当目标name存在于openedNames中
                if (index >= 0) {
                    let currentSubmenu = null;
                    //先向下找所有Submenu组件，因为在openedNames中所以默认是展开状态的，
                    //这时候当滑过事件时，当前Submenu组件应该置于关闭状态
                    findComponentsDownward(this, 'Submenu').forEach(item => {
                        if (item.name === name) {
                            currentSubmenu = item;
                            //置于关闭状态
                            item.opened = false;
                        }
                    });
                    // 当前Submenu向上找的所有Submenu组件应该都置于原来的展开状态
                    findComponentsUpward(currentSubmenu, 'Submenu').forEach(item => {
                        item.opened = true;
                    });
                    // 给当前Submenu组件的子孙Submenu组件也都置于opened关闭状态
                    findComponentsDownward(currentSubmenu, 'Submenu').forEach(item => {
                        item.opened = false;
                    });
                } else {
                //当目标name不存在openedNames中
                    //若手风琴模式的话
                    if (this.accordion) {
                        let currentSubmenu = null;
                        //向下找所有Submenu，name匹配的当前Submenu;
                        findComponentsDownward(this, 'Submenu').forEach(item => {
                            if (item.name === name) {
                                currentSubmenu = item;
                                //由于不在openedNames中没默认展开，就让其状态为展开状态
                                item.opened = true;
                            }
                        });
                        //以当前Submenu开始向上找其所有Submenu，全部置为展开状态
                        findComponentsUpward(currentSubmenu, 'Submenu').forEach(item => {
                            item.opened = true;
                        });
                    } else {
                        findComponentsDownward(this, 'Submenu').forEach(item => {
                            if (item.name === name) item.opened = true;
                        });
                    }
                }
                //手动滑过改变了某Submenu组件的opened状态，再收集所有Submenu的opened状态
                //同步更新到openedNames数据中
                let openedNames = findComponentsDownward(this, 'Submenu').filter(item => item.opened).map(item => item.name);
                this.openedNames = [...openedNames];
                //当 展开/收起 子菜单时触发on-open-change事件
                //最后触发下openChange事件，传给用户的参数是：当前展开的 Submenu 的 name 值数组；
                this.$emit('on-open-change', openedNames);
            },
            //根据data里的openedNames的name值去寻找对应子组件，通知其状态设为opened-true状态。
            updateOpened () {
                //先向下获取到所有Submenu组件
                const items = findComponentsDownward(this, 'Submenu');
                //然后遍历所有Submenu组件数组--找出名字为openedNames里的name相符的，则通知其submenu组件opened状态为true；
                if (items.length) {
                    items.forEach(item => {
                        if (this.openedNames.indexOf(item.name) > -1) item.opened = true;
                        else item.opened = false;
                    });
                }
            },
            //手动触发用户定义的onselect事件
            handleEmitSelectEvent (name) {
                this.$emit('on-select', name);
            }
        },
        mounted () {
            //挂载时就将props里的opennames设到当前data值里
            this.openedNames = [...this.openNames];
            //然后触发--更新展开子项的函数
            this.updateOpened();
            //初次加载传进activename时触发下updateActiveName函数
            this.$nextTick(() => this.updateActiveName());
            //挂载时就注册个子菜单项menuitem选中事件，当有菜单项选中时由子菜单项组件通知menu状态，让this.currentActive同步name值
            this.$on('on-menu-item-select', (name) => {
                this.currentActiveName = name;
                //当子菜单项组件由点击而触发这个menuitemselect事件后触发用户传入的on-select事件
                //只是在menuitem组件点击时被触发，返给用户的是name名字当前激活的name。
                this.$emit('on-select', name);
            });
        },
        watch: {
            openNames (names) {
                this.openedNames = names;
            },
            activeName (val) {
                this.currentActiveName = val;
            },
            currentActiveName () {
                //当前激活类名变化时，就触发对应的更新名字激活的函数
                this.updateActiveName();
            }
        }
    };
</script>
