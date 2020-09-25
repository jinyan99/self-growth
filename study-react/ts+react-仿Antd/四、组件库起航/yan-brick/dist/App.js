import React, { useEffect, useState, useRef } from 'react';
import Button from './components/Button/button';
import axios from 'axios';
import Menu from './components/Menu/menu';
import MenuItem from './components/Menu/menuItem';
import SubMenu from './components/Menu/subMenu';
// import {library} from '@fortawesome/fontawesome-svg-core';
// import {fas} from '@fortawesome/free-solid-svg-icons';
import Icon from './components/Icon/icon';
//library方法必须放在import后面，遵循es6 import/first原则
//library.add(fas);
var obj = {
    index: 0
};
console.log('重新了吗');
var App = function () {
    var _a = useState(''), title = _a[0], setTitle = _a[1];
    var indexRef = useRef(0);
    var postData = {
        data: {
            title: 'mmy title',
            body: 'hello man'
        }
    };
    useEffect(function () {
        console.log('组件渲染了', obj, indexRef);
        axios
            .get('https://jsonplaceholder.typicode.com/posts/1', postData)
            //{ // 是第三个参数的配置对象
            //     headers: {
            //         'X-Requested-With': 'XMLHttpRequest'
            //     },
            //     responseType: 'json'
            // }
            .then(function (resp) {
            //console.log(resp);
            obj['index'] = 1;
            indexRef.current = 1;
            setTitle(resp.data.title);
        });
    });
    var handleFileChange = function (e) {
        var files = e.target.files;
        if (files) {
            var uploadedFile = files[0]; //这就是列表里的第一个file对象
            // 这是另一种针对XHR2设计的一个新的数据类型，使用FormData能够很方便地适时以javascript的形式创建html-form的一些数据
            var formData = new FormData();
            formData.append(uploadedFile.name, uploadedFile);
            // 有了这种格式数据就很容易能发送post请求了,axios的第二个参数支持post body数据也支持formData数据直接传进去
            axios
                .post('https://jsonplaceholder.typicode.com/posts', formData, {
                headers: {
                    //这个content-type其实就是与form的enctype相对应的，这样才能更快速支持文件二进制流上传
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(function (resp) {
                console.log(resp);
            });
        }
    };
    return (React.createElement("div", { className: "App" },
        "app\u7EC4\u4EF6",
        React.createElement("h1", null,
            "hello world---",
            !title ? React.createElement(Icon, { icon: "spinner", spin: true }) : title),
        React.createElement("code", null, "const a = b"),
        React.createElement("hr", null),
        React.createElement(Icon, { icon: "arrow-down", theme: "primary", size: "10x" }),
        React.createElement(Icon, { icon: "spinner", spin: true }),
        React.createElement(Menu, { className: "test", defaultIndex: '0', 
            //mode="vertical"
            onSelect: function (index) {
                alert(index);
            }, defaultOpenSubMenus: ['1'] },
            React.createElement(MenuItem, null, "cool link1"),
            React.createElement(SubMenu, { title: "dropdown" },
                React.createElement(MenuItem, null, "cool link2.1"),
                React.createElement(MenuItem, { disabled: true }, "cool link2.2")),
            React.createElement(MenuItem, null, "cool link3")),
        React.createElement(Button, { disabled: true }, "Hello"),
        React.createElement("hr", null),
        React.createElement("h4", null, "\u6587\u4EF6\u4E0A\u4F20---\u5F02\u6B65\u8BF7\u6C42\u65B9\u5F0F\u6F14\u793A--"),
        React.createElement("div", null,
            React.createElement("input", { type: "file", name: "myFile", onChange: handleFileChange }))));
};
export default App;
