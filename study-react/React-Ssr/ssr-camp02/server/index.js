// 这里的node代码。会用babel处理
import React from "react";
import { renderToString } from "react-dom/server";
import express from "express";
import { StaticRouter, matchPath, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { getServerStore } from "../src/store/store";
import routes from "../src/App";
import Header from "../src/component/Header";
import path from 'path';
import fs from 'fs';
const store = getServerStore();
const app = express();
app.use(express.static("public"));

function csrRender(res) {
  //读取csr文件  返回
  const filename = path.resolve(process.cwd(), 'public/index.csr.html')
  const html = fs.readFileSync(filename, 'utf-8')
  return res.send(html);
}
app.get("*", (req, res) => {
    if(req.query._mode=='csr') {
    console.log('根据url参数判定  开启csr降级');
    return csrRender(res);
  }
  //配置开关开启csr
  //服务器负载过高，开启csr
  //获取根据路由渲染出的组件，并且拿到loadData方法  获取数据
















  // 存储网络请求
  const promises = [];
  // use `some` to imitate `<Switch>` behavior of selecting only
  // 路由匹配
  routes.some(route => {
    const match = matchPath(req.path, route);
    if (match) {
      const { loadData } = route.component;
      if (loadData) {
        promises.push(loadData(store));
      }
    }
  });
  // 等待所有网络请求结束再渲染

  Promise.all(promises)
    .then(() => {
      //如果这时有css渲染，context里就有css的值了
      const context = {
        //来存储全局的当前页面要渲染css的一个内容
        css:[]
      }
      // 把react组件，解析成html
      const content = renderToString(
        <Provider store={store}>
          <StaticRouter location={req.url}>
            <Header></Header>
            {routes.map(route => (
              <Route {...route}></Route>
            ))}
          </StaticRouter>
        </Provider>
      );

      const css = context.css.join('\n')//连接换行符成字符串
      // 字符串模板
      res.send(`
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>react ssr</title>
        <style>${css}</style>
      </head>
      <body>
        <div id="root">${content}</div>
        <script>
          window.__context=${JSON.stringify(store.getState())}
        </script>
        <script src="/bundle.js"></script>
      </body>
    </html>

    `);
    })
    .catch(() => {
      res.send("报错页面500");
    });
});
app.listen(9093, () => {
  console.log("监听完毕");
});
