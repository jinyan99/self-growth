/**
 * 展示下高阶组件+ts
 * 这个withLoader的高阶组件是类组件中复用loading状态的逻辑的方式，可以写成自定义hook的方式
 * 这个安装下axios，不用装类型文件了，里面自带它的声明文件typing属性
 * “typings”：“./index.d.ts”
 * 在apptsx文件中复用
 *
 * HOC的弊端：
 *  1: 会无故增加很多节点51行空节点啥的，无端添加些界面结构（下方这个loading显示与不显示是一段逻辑代码，但是高阶给它添加了很多节点）
 *  2: 高阶组件看点来有点复杂难以理解
 *  3: HOC被包裹的组件，里面的行参如data很突兀，第一眼根本不知道它是源自哪里是干什么的，只得从高阶组建里研究才会懂
 */
import React from 'react';
import axios from 'axios';

interface ILoaderState {
	data: any;
	isLoading: boolean;
}
interface ILoaderProps {
	data: any;
}
// WrappedComponent是传入老的组件一个行参
const withLoader = <P extends ILoaderState>(
	WrappedComponent: React.ComponentType<P>,
	url: string
) => {
	return class LoaderComponent extends React.Component<
		Partial<ILoaderProps>,
		ILoaderState
	> {
		constructor(props: any) {
			super(props);
			this.state = {
				data: null,
				isLoading: false
			};
		}
		componentDidMount() {
			this.setState({
				isLoading: true
			});
			axios.get(url).then((result: any) => {
				this.setState({
					data: result.data,
					isLoading: false
				});
			});
		}
		render() {
			const { data, isLoading } = this.state;
			return (
				<>
					{isLoading || !data ? (
						<p>data is loading</p>
					) : (
						<WrappedComponent {...(this.props as P)} data={data} />
					)}
				</>
			);
		}
	};
};
export default withLoader;
