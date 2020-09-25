import React, { useEffect, useState, useRef } from 'react';
import Button, { ButtonType, ButtonSize } from './components/Button/button';
import axios from 'axios';

import Menu from './components/Menu/menu';
import MenuItem from './components/Menu/menuItem';
import SubMenu from './components/Menu/subMenu';

// import {library} from '@fortawesome/fontawesome-svg-core';
// import {fas} from '@fortawesome/free-solid-svg-icons';
import Icon from './components/Icon/icon';
//library方法必须放在import后面，遵循es6 import/first原则
//library.add(fas);

const obj = {
	index: 0
};
console.log('重新了吗');
const App: React.FC = () => {
	const [title, setTitle] = useState('');
	const indexRef = useRef(0);
	const postData = {
		data: {
			title: 'mmy title',
			body: 'hello man'
		}
	};
	useEffect(() => {
		console.log('组件渲染了', obj, indexRef);
		axios
			.get('https://jsonplaceholder.typicode.com/posts/1', postData)
			//{ // 是第三个参数的配置对象
			//     headers: {
			//         'X-Requested-With': 'XMLHttpRequest'
			//     },
			//     responseType: 'json'
			// }
			.then((resp: { data: { title: React.SetStateAction<string> } }) => {
				//console.log(resp);
				obj['index'] = 1;
				indexRef.current = 1;
				setTitle(resp.data.title);
			});
	});

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			const uploadedFile = files[0]; //这就是列表里的第一个file对象
			// 这是另一种针对XHR2设计的一个新的数据类型，使用FormData能够很方便地适时以javascript的形式创建html-form的一些数据
			const formData = new FormData();
			formData.append(uploadedFile.name, uploadedFile);
			// 有了这种格式数据就很容易能发送post请求了,axios的第二个参数支持post body数据也支持formData数据直接传进去
			axios
				.post('https://jsonplaceholder.typicode.com/posts', formData, {
					headers: {
						//这个content-type其实就是与form的enctype相对应的，这样才能更快速支持文件二进制流上传
						'Content-Type': 'multipart/form-data'
					}
				})
				.then((resp) => {
					console.log(resp);
				});
		}
	};
	return (
		<div className="App">
			app组件
			<h1>
				hello world---{!title ? <Icon icon="spinner" spin /> : title}
			</h1>
			<code>const a = b</code>
			<hr />
			<Icon icon="arrow-down" theme="primary" size="10x" />
			<Icon icon="spinner" spin />
			<Menu
				className="test"
				defaultIndex={'0'}
				//mode="vertical"
				onSelect={(index) => {
					alert(index);
				}}
				defaultOpenSubMenus={['1']}
			>
				<MenuItem>cool link1</MenuItem>
				<SubMenu title="dropdown">
					<MenuItem>cool link2.1</MenuItem>
					<MenuItem disabled>cool link2.2</MenuItem>
				</SubMenu>
				<MenuItem>cool link3</MenuItem>
			</Menu>
			<Button disabled>
				Hello
			</Button>
			<hr />
			<h4>文件上传---异步请求方式演示--</h4>
			<div>
				<input type="file" name="myFile" onChange={handleFileChange} />
			</div>
		</div>
	);
};

export default App;
