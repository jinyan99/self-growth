/**
 * 使用useRef仿做个点赞按钮组件
 * 注意：
 *      1: 修改ref的值是不会引发重新render的
 *      2: 想在组件更新的时候发生一些操作时，在类组件可以用生命周期，函数组建里可以借用useRef完成
 *          即用useRef达到更新的生命周期钩子函数，用useRef的特性配合useEffect完成
 *          即可以将useEffect里含的mount和updated周期能明确分开。
 *      3: 基础的功能就是帮助函数组件获取dom节点
 */
import React, { useState, useRef, useEffect } from 'react';
// 复用自定义hook
import useMousePosition from './useHooks/useMousePosition';
const LikeButton: React.FC = () => {
	const [like, setLike] = useState(0);
	const likeRef = useRef();
	const didMountRef = useRef(false);
	// 用ref获取dom操作
	// 用泛型指定一下应该是Input元素类型呢
	const domRef = useRef<HTMLInputElement>(null);
	// ref获取dom的副作用函数
	useEffect(() => {
		if (domRef && domRef.current) {
			domRef.current.focus();
		}
	});

	useEffect(() => {
		document.title = `点击了${like}次`;
	}, [like]);
	useEffect(() => {
		if (didMountRef.current) {
			// 当DidUpdate更新期间执行的逻辑
			console.log('this is updated');
		} else {
			// 当didMount执行的逻辑
			didMountRef.current = true;
		}
	});
	function handleAlertClick() {
		setTimeout(() => {
			alert('you clicked on ' + likeRef.current);
		}, 3000);
	}
	return (
		<>
			<input type="text" ref={domRef} />
			<button>{like}</button>
		</>
	);
};
export default LikeButton;
