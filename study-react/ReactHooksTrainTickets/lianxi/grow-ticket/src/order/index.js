import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux';
import * as serviceWorker from '../serviceWorker.js'

//一般建项目，首页都得额外引入store和Provider的两个东西，比较常用
import store from './store.js'
import './index.css'
import App from './App.jsx'

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>
    ,
    document.getElementById('root')
);

if ('production' === process.env.NODE_ENV) {
    serviceWorker.register();
} else {
    serviceWorker.unregister();
}