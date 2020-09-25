/**
 * 主要讲自定义hook----使用自定义hook抽象鼠标跟踪器
 * 1- 自定义hook可以方便的复用状态逻辑--如当前的hook复用到app.tsx中
 */
import React, { useState, useEffect } from 'react';
const useMousePosition = () => {
	const [positions, setPositions] = useState({ x: 0, y: 0 });
	useEffect(() => {
		console.log('add effect', positions.x);
		// MouseEvent是react内置声明的类型
		const updateMouse = (e: MouseEvent) => {
			console.log('inner');
			setPositions({ x: e.clientX, y: e.clientY });
		};
		document.addEventListener('click', updateMouse);
		// 这时若不写return的话，会有bug，当初始时点击创建个事件，当更新时，还会执行effects里方法
		// 还会创建监听事件，以前的事件并没消除就会越来越多事件，就点击一次会触发多次
		return () => {
			console.log('remove effect', positions.x);
			document.removeEventListener('click', updateMouse);
		};
	}, []);
	return positions;
};
export default useMousePosition;
/**
 * 自定义hook的use必须开头，这个约定非常重要
 * 在2个组件中使用相同的hook会共享state吗----答案是不会
 * 每次使用自定义hook的时候，所有state都是完全独立的
 */
