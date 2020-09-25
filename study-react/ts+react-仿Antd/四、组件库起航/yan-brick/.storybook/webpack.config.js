module.exports = ({ config }) => {
	config.module.rules.push({
		test: /\.tsx?$/,
		use: [
			{
				loader: require.resolve('babel-loader'),
				options: {
					presets: [require.resolve('babel-preset-react-app')]
				}
			},
			{
				loader: require.resolve('react-docgen-typescript-loader'),
				options: {
                    // 让一些枚举类型联合类型展示成原字符串值形式
                    shouldExtractLiteralValuesFromEnum: true,
                    // prop过滤
					propFilter: (prop) => {
						if (prop.parent) {
                            // 过滤掉来自node_modules原生属性，因为一些react内置的原生类型都放在node_modules/react中
							return !prop.parent.fileName.includes(
								'node_modules'
							);
						}
						return true;
					}
				}
			}
		]
	});

	config.module.rules.push({
		test: /\.scss$/,
		// 注意:use 的别名 是 loaders。下面3个加载的执行顺序是 3 2 1
		use: [
			// 1.不用传递参数可以简写
			'style-loader',
			{
				loader: 'css-loader',
				// 2.给css-loader传递参数
				options: {
					url: true,
					import: true
				}
			},
			// 3.使用sass加载器
			'sass-loader'
		]
	});

	config.resolve.extensions.push('.ts', '.tsx');

	return config;
};
