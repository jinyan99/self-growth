import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
//引用第三方css库，这个库会尽量帮我们统一各个浏览器的默认样式，减少我们视图浏览器的工作量
//虽然是css，也是由npm分发的，得由npm 安装  npm i normalize.css --save
import 'normalize.css/normalize.css';
//其中serviceWorker.jsbing并不是我们的写的文件它是cra自动生成的。

import * as serviceWorker from '../serviceWorker';

import store from './store';
import './index.css';
import App from './App.jsx';

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

if ('production' === process.env.NODE_ENV) {
    serviceWorker.register();
} else {
    serviceWorker.unregister();
}
