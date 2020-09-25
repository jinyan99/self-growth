/**
 * 自定义好loading的，状态逻辑复用的封装
 * 然后在apptsx组件中引用它实现一下通过这个自定义hook在appts中使用后可以发现
 * 自定义相对HOC的优势在于：
 *      1: 我们可以把天然的一些逻辑，重复的代码提取到一个函数中
 *      2: 然后外界使用时，像调用一个函数一样进行调用，它的结果也非常明晰不会产生一些无故的节点
 *      3: 这个自定义hook就能胜任在任何组件完成对异步数据的获取，达到复用逻辑的效果像mixins一样
 */
import { useState, useEffect } from 'react';
import axios from 'axios';

const useURLLoader = (url: string, deps: any[] = []) => {
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		setLoading(true);
		axios.get(url).then((result: { data: any }) => {
			setData(result.data);
			setLoading(false);
		});
	}, deps);
	return [data, loading];
};
export default useURLLoader;
