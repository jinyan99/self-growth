import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
	AutoComplete,
	AutoCompleteProps,
	DataSourceType
} from './autoComplete';
interface LakerPlayerProps {
	value: string;
	number: number;
}
interface GithubUserProps {
	login: string;
	url: string;
	avatar_url: string;
}
const SimpleComplete = () => {
	const lakers = [
		'bradley',
		'pope',
		'caruso',
		'cook',
		'cousions',
		'james',
		'AD',
		'green',
		'howard',
		'kuzma',
		'McGee',
		'rando'
	];
	const lakersWithNumber = [
		{ value: 'bradley', number: 11 },
		{ value: 'pope', number: 1 },
		{ value: 'caruso', number: 4 },
		{ value: 'cook', number: 2 },
		{ value: 'cousins', number: 15 },
		{ value: 'james', number: 23 },
		{ value: 'AD', number: 3 },
		{ value: 'green', number: 14 },
		{ value: 'howard', number: 39 },
		{ value: 'kuzma', number: 0 }
	];
	// const handleFetch = (query: string) => {
	//     return lakers.filter(name => name.includes(query))
	// }
	//---同步处理
	// const handleFetch = (query: string) => {
	//     return lakersWithNumber.filter(player => player.value.includes(query))
	// }
	//---异步处理
	const handleFetch = (query: string) => {
		return fetch(`https://api.github.com/search/users?q=${query}`)
			.then((res) => res.json())
			.then(({ items }) => {
				console.log(items);
				return items
					.slice(0, 10)
					.map((item: { login: any }) => ({
						value: item.login,
						...item
					}));
			});
    };
    //-----这种会报类型错误，所以注释-------
	// const renderOption = (item: DataSourceType<GithubUserProps>) => {
	// return (
	//     <>
	//     <h4>Name: {item.value}</h4>
	// <p>Number: {item.url}</p>
	//     </>
	//     )
	// }
	const renderOption = (item: DataSourceType) => {
		const itemWithGithub = item as DataSourceType<GithubUserProps>;
		return (
			<>
				<h2>Name: {itemWithGithub.value}</h2>
				<p>url: {itemWithGithub.url}</p>
			</>
		);
	};
	return (
		<AutoComplete
			fetchSuggestions={handleFetch}
			// 模拟的selected事件函数，内置可自动接受参数值
			onSelect={action('selected')}
			// 抛出用户自定义渲染模版
			renderOption={renderOption}
		></AutoComplete>
	);
};

storiesOf('AutoComplete Component', module).add('AutoComplete', SimpleComplete);
