import React from 'react';
import classNames from 'classnames';
import {
	FontAwesomeIcon,
	FontAwesomeIconProps
} from '@fortawesome/react-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fas} from '@fortawesome/free-solid-svg-icons';
library.add(fas);

export type ThemeProps =
	| 'primary'
	| 'secondary'
	| 'success'
    | 'info'
    | 'danger'
	| 'warning';

export interface IconProps extends FontAwesomeIconProps {
	// 除了继承它的一些属性，我们再往里定义下自己的属性
	theme?: ThemeProps;
}
// 把接口传给函数组件的范型即可,来二次封装第三方icon组件
const Icon: React.FC<IconProps> = (props) => {
	// 我们要根据theme动态指定className如传theme生成icon-primary类名
	const { className, theme, ...restProps } = props;
	const classes = classNames('viking-icon', className, {
		[`icon-${theme}`]: theme
	});
	return <FontAwesomeIcon className={classes} {...restProps} />;
};

export default Icon;
