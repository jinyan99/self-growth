
/**
 * @file 混入的组件实例关于 a 标签的 方法参数集合
 * props 附了4个值：to replace target append
 * 计算属性：linkUrl值
 * 2个点击处理函数
 */
import { oneOf } from '../utils/assist';

export default {
    props: {
        to: {
            //跳转的链接，支持 vue-router 对象
            type: [Object, String]
        },
        replace: {
            //路由跳转时，开启 replace 将不会向 history 添加新记录
            type: Boolean,
            default: false
        },
        target: {
            //相当于 a 链接的 target 属性
            type: String,
            validator (value) {
                return oneOf(value, ['_blank', '_self', '_parent', '_top']);
            },
            default: '_self'
        },
        append: {
            //同 vue-router append
            type: Boolean,
            required: false,
            default: false,
        },
    },
    computed: {
        linkUrl () {
            const type = typeof this.to;
            console.log(type,this.to,'看看to路径的解析类型')
            if (type !== 'string') {
                return null;
            }
            //含//的就是绝对路径了不用解析
            if (this.to.includes('//')) {
                /* Absolute URL, we do not need to route this */
                return this.to;
            }
            //$router是vueRouter含编程式导航的方法
            //$route是当前组件实例获取当前路由信息的时候用的
            const router = this.$router;
            //若this.to是路由对象的时候如{path：'/path/ui'}--则利用router的resolve出href才可以。
            if (router) {
                //current是当前默认的路由信息
                const current = this.$route;
                //解析路由对象，返回解析后的位置对象含href信息
                const route = router.resolve(this.to, current, this.append);
                return route ? route.href : this.to;
            }
            //最后一种情况就是传的如'/path'这种直接return即可
            return this.to;
        }
    },
    methods: {
        handleClick (new_window = false) {
            const router = this.$router;
            //new_window是要不要新窗口打开新路由页面，默认是使用当前窗口
            //源码级脱离于targetAPI实现的_blankh和_self效果
            if (new_window) {
                let to = this.to;
                if (router) {
                    const current = this.$route;
                    const route = router.resolve(this.to, current, this.append);
                    to = route ? route.href : this.to;
                }
                //新窗口
                window.open(to);
            } else {
                if (router) {
                    this.replace ? this.$router.replace(this.to) : this.$router.push(this.to);
                } else {
                    //当前窗口
                    window.location.href = this.to;
                }
            }
        },
        handleCheckClick (event, new_window = false) {
            if (this.to) {
                if (this.target === '_blank') {
                //把_blank当做个特例吧，当用户不传_blank时，利用new_window参数也当ctrl按住点击时即
                //使没传_blankAPI,需要也可以实现_blank的效果
                    console.log('当前是_blank')
                    return false;
                } else {
                    console.log(this.target)
                    event.preventDefault();
                    this.handleClick(new_window);
                }
            }
        }
    }
};
