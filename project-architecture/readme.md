# 项目架构 积累文档

[前端架构总结](https://blog.csdn.net/qq20004604/article/details/90575092)

- 架构一个项目从两方面入手:
  - 基础层: 偏基础设施建设，与业务相关性较低
  - 应用层: 贴近用户

是含项目的框架选择，中间件辅助工具的选择，工程化项目等等，下面只讨论最小的一点目录结构及多种redux集成方式讨论

## React-Redux-Router

> 贝壳Saas-Admin后台管理系统Node中间层架构实践设计 redux集成方案模式

### 下面是该项目架构的client/src/目录结构

├── actions
│   ├── api.js
│   ├── assignment.js
│   ├── audit.js
│   ├── cameraman.js
│   ├── city.js
│   ├── customer.js
│   ├── geo.js
│   ├── order.js
│   ├── org.js
│   ├── sycnChange.js
│   ├── types.js
│   ├── user.js
│   └── work.js
├── assets
│   ├── images
│   │   ├── ban.png
│   │   ├── ban@2x.png
│   │   ├── error.png
│   │   ├── error@2x.png
│   │   ├── Shape.png
│   │   ├── Shape@2x.png
│   │   ├── tips.png
│   │   └── wave.png
│   └── style
│       ├── base
│       │   ├── common.styl
│       │   ├── flexbox.styl
│       │   ├── global.styl
│       │   ├── reset.styl
│       │   └── uprogress.styl
│       ├── module
│       │   ├── filter.styl
│       │   ├── info-list.styl
│       │   ├── page.styl
│       │   ├── result-box.styl
│       │   └── selector.styl
│       └── index.styl
├── components
│   ├── AddressSelect
│   ├── AddressSelector
│   ├── BaseForm
│   ├── BusinessList
│   ├── CameramanList
│   ├── CityOperatorSelector
│   ├── CitySelector
│   ├── CustomerAdminList
│   ├── CustomerAdminSelector
│   ├── CustomerCityList
│   ├── CustomerInfo
│   ├── CustomerList
│   ├── CustomerPermission
│   ├── DateSelector
│   ├── Empty
│   ├── ETable
│   ├── ExceptionModal
│   │   ├── images
│   │   │   ├── error.png
│   │   │   └── error@2x.png
│   │   ├── index.jsx
│   │   └── index.styl
│   ├── Header
│   │   ├── images
│   │   │   ├── logo-w@2x.png
│   │   │   └── logo@2x.png
│   │   ├── index.jsx
│   │   └── index.styl
│   ├── ImgViewer
│   ├── MediaViewer
│   ├── NotFound
│   │   ├── images
│   │   │   └── notfound.png
│   │   ├── index.jsx
│   │   └── index.styl
│   ├── PageLoading
│   ├── PanelSelector
│   ├── TextButton
│   ├── UploadImgList
│   └── UserSug
├── constants
│   ├── api.js
│   └── options.js
├── container
│   ├── Header
│   ├── Sidebar
│   │   ├── images
│   │   │   ├── logo.png
│   │   ├── index.jsx
│   │   ├── index.styl
│   │   └── utils.js
│   ├── index.jsx
│   └── index.styl
├── exception  // 异常处理文件夹
│   ├── images
│   │   ├── error.png
│   │   └── error@2x.png
│   ├── 403.jsx
│   ├── 404.jsx
│   ├── 500.jsx
│   └── index.styl
├── pages
│   ├── customer
│   ├── order
│   │   ├── detail
│   │   ├── export
│   │   └── list
│   │       ├── index.jsx
│   │       ├── index.styl
│   │       ├── reducer.js
│   │       └── util.js
│   ├── organization
│   │   ├── assignmen
│   │   │   ├── index.jsx
│   │   │   ├── index.styl
│   │   │   └── reducer.js
│   │   ├── audit
│   │   │   ├── index.jsx
│   │   │   ├── index.styl
│   │   │   └── reducer.js
│   │   ├── auditList
│   │   │   ├── index.jsx
│   │   │   ├── index.styl
│   │   │   └── reducer.js
│   │   ├── detail
│   │   │   ├── index.jsx
│   │   │   ├── index.styl
│   │   │   └── reducer.js
│   │   └── list
│   │       ├── index.jsx
│   │       ├── index.styl
│   │       └── reducer.js
│   ├── others
│   │   └── cityList
│   │       ├── index.jsx
│   │       ├── index.styl
│   │       ├── reducer.js
│   │       └── utils.js
│   └── work
│       ├── list
│       │   ├── index.jsx
│       │   ├── index.styl
│       │   └── reducer.js
├── reducers  // reducer模块化汇总的总reducer文件(抛出的是对象形式)--用于在index入口文件中combineReducer用
│   └── index.js
├── template
│   └── index.ejs
├── user
│   └── login
│       ├── images
│       │   └── bg.png
│       ├── index.jsx
│       └── index.styl
├── utils
│   ├── connect.js
│   ├── cookie.js
│   ├── createPage.js
│   ├── filterXss.js
│   ├── getParams.js
│   ├── index.js
│   ├── request.js
│   ├── resizeImageURL.js
│   ├── router.js
│   ├── shallowEqual.js
│   ├── spark-md5.js
│   ├── throttle.js
│   └── uploadPicValidate.js
├── favicon.ico
├── index.jsx  // 主入口文件
├── routes.js  // 路由文件
├── serviceWorker.js
└── theme.js

- 重点关注它的redux与router的项目集成方式模块化方式
- 采用模块化reducer，pages/每个页面都有自己的reducer文件(单文件含state，reducer，总actions文件夹中提取的部分actioncreator)
  - 然后在src/reducer/index文件中汇总所有页面的模块reducer成一个对象抛出去
  - 在indexjs主入口文件中combineReducer中接受这个总对象处理下，并调用createStore方法再应用些相关的中间件，最后生成store直接放到
   render的1参Provider中，这样在业务页面中经utils/createPage包装后(connect方法中的state是汇总后的所有state值，得state[namespace]
   才行)，这样在业务组件中的props中就能拿到对应模块reducer里的state值了
