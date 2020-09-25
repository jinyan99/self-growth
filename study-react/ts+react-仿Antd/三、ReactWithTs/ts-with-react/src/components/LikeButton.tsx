/**
 * 使用usesttae仿做个点赞按钮组件
 */
import React, { useState, useContext } from 'react';
import { ThemeContext } from '../App';

// 复用自定义hook
import useMousePosition from './useHooks/useMousePosition';
const LikeButton: React.FC = () => {
	const [obj, setObj] = useState({ like: 0, on: true });
	const [on, setOn] = useState(true);
	// 自定义hook复用状态逻辑
	const positions = useMousePosition();
	// useContext逻辑
	const theme = useContext(ThemeContext);
	console.log(theme, '看拿到的上下文值');
	const style = {
		background: theme.background,
		color: theme.color
	};
	return (
		<>
			<button
				style={style}
				onClick={() => {
					setObj({ like: obj.like + 1, on: obj.on });
				}}
			>
				{obj.like}
			</button>
			<p>{positions.x + positions.y}</p>
			<button
				onClick={() => {
					setOn(!on);
				}}
			>
				{obj.on ? 'ON' : 'OFF'}
			</button>
		</>
	);
};
export default LikeButton;
