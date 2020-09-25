/**
 * 讲解useContext的技巧
 * 1: 上下文传递不宜常用在项目里，适用于一些全局配置数据。它的目的就是为了共享一些组件树而言是一个全局可配置的数据，例如当前的主题换肤首选语言
 * 2: 使用useContext，子组件可以快速得到全局样式主题肤色啥的，然后采取对应的布局
 */
// 先在app.tsx文件里定义一下全局的主题样式IThemeProps接口类型
// 在appjs文件中包裹一下，然后在likeButton组件文件中可以获取到

// 然后在app.tsx文件中，设个按钮，动态更换context的往外传的值
//<ThemeContext.Provider value={themes.light}> 让value值动态变化
