import React, { useState } from 'react';
import logo from './logo.svg';
// import Hello from './components/Hello';
import './App.css';
import LikeButton from './components/LikeButton';
import MouseTracker from './components/MouseTracker';
// 自定义hook复用
import useMousePosition from './components/useHooks/useMousePosition';
// HOC复用方式
import withLoader from './components/useHooks/withLoader';
// 自定义hooks改造
import useURLLoader from './components/useHooks/useURLLoader';

interface IShowResult {
	message: string;
	status: string;
}
// 全局样式供context使用
interface IThemeProps {
	[key: string]: { color: string; background: string };
}
const themes: IThemeProps = {
	light: {
		color: '#000',
		background: '#eee'
	},
	dark: {
		color: '#fff',
		background: '#222'
	}
};
export const ThemeContext = React.createContext(themes.light);
const DogShow: React.FC<{ data: IShowResult }> = ({ data }) => {
	return (
		<>
			<h2>Dog show: {data.status} </h2>
			<img src={data.message} />
		</>
	);
};
const App: React.FC = () => {
	// 1-之前的方式
	const positions = useMousePosition();
	const WrapperDogShow = withLoader(
		DogShow,
		'https://dog.ceo/api/breeds/otterhound/n02091635_2761.jpg'
	);
	// 2- 自定义hook使用useURLLoader的方式
	const [show, setShow] = useState(true);
	const [
		data,
		loading
	] = useURLLoader(
		'https://dog.ceo/api/breeds/otterhound/n02091635_2761.jpg',
		[show]
	);
	// 传第二项的时候，每点击下开关都会truefalse变化，所以能不断触发自定义hook里的数据请求
	// 第二种方式时还需要把data的类型约束一下--因为data类型默认是any类型，我们把它as成IShowResult类型
	const dogResult = data as IShowResult; // 这时dogResult类型就变成了IShowResult类型

	return (
		<div className="App">
			<ThemeContext.Provider value={themes.light}>
				<header className="App-header">
					<WrapperDogShow />
					<LikeButton />
					{loading ? (
						<p>🐶 读取中..</p>
					) : (
						<img src={dogResult && dogResult.message} />
					)}
					<p>{positions.x + positions.y}</p>
				</header>
			</ThemeContext.Provider>
		</div>
	);
};

export default App;
