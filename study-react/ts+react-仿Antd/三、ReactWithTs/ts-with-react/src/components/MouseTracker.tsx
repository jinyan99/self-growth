/**
 * 鼠标跟踪器组件：关于useEffect钩子的讲解
 */
import React, { useState } from 'react';
import { useEffect } from 'react';
const MouseTracker: React.FC = () => {
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
	});
	console.log('before render', positions.x);
	return (
		<p>
			X: {positions.x},Y: {positions.y}
		</p>
	);
};
export default MouseTracker;
/**
 * useEffect里的执行顺序，按序写的：
 * 当初始化进入页面时：
 *      before render 0
 *      add effect 0
 * 当点击页面触发事件时：
 *      会直接执行事件函数里的内容
 *      inner
 *      before render 102   // 由setPositions触发更新重新渲染
 *      remove effect 0 // 更新重渲染时，dom挂载完后，先执行上次渲染的effect快照里留下的return函数，所以打印的是0值
 *      add effect 102 // 执行完上次遗留的effect的return后，再开始此时新的effect函数即打印add effct
 * 1- 可以发现每次组件更新渲染就会执行effect，会造成资源浪费，这时候就要有数据依赖了
 * 2- 触发useeffect的return函数2个条件：卸载组件，切换组件时和组件更新渲染重新渲染时
 * 3- 当useeffect依赖为空时，是useeffect初次渲染时执行一次，
 *    后面如点击事件时：打印顺序结果始终是inner 和 before render。
 *    每次点击立即触发事件函数，也会出发setState的重新渲染，但后面多次渲染时不会执行useeffect函数也不会执行上次effect遗
 *    留的return函数。这时候就切换组建卸载组建时能触发return函数
 */
