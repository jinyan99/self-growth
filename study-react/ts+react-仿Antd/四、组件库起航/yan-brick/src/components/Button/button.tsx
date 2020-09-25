import React, {FC, ButtonHTMLAttributes,AnchorHTMLAttributes} from 'react';
// 使用第三方类名动态切换插件classnames
import classNames from 'classnames';

// 开始编写组件的思路：
// 1-先从用户使用可传入属性层面看，将确定下来的可掺入参数数据抽离枚举出来：利于可配置原则
// export enum ButtonSize {
// 	large = 'lg',
// 	Small = 'sm'
// }

// export enum ButtonType {
// 	Primary = 'primary',
// 	Default = 'default',
// 	Danger = 'danger',
// 	Link = 'link'
// }

// 不用enum了，用字符串字面量了更好用些
export type ButtonSize = 'lg' | 'sm';
export type ButtonType = 'primary' | 'default' | 'danger' | 'link';

interface BaseButtonProps {//@ANNOTATION1
    className?: string;
    /**设置 Button 的禁用 */
    disabled?: boolean;
    /**设置 Button 的尺寸 */
    size?: ButtonSize;
    /**设置 Button 的类型 */
	btnType?: ButtonType;
	children: React.ReactNode;
	href?: string;
}
// 3- 这个类型别名要拿到button的所有reactjsx和原生button元素支持的所有属性加到Button组件上，一个个取太麻烦，这时候react提供了这种类型直接使用。
// 如可以使用jsx上可以使用onClick属性的类型支持，原生html属性的target啥的
// 这时候想把写的可传入props与这些native类型加到一起，用联合类型不行，得用交叉类型了
type NativeButtonProps = BaseButtonProps &
	ButtonHTMLAttributes<HTMLElement>;
type AnchorButtonProps = BaseButtonProps &
	AnchorHTMLAttributes<HTMLElement>;
// export type ButtonProps = NativeButtonProps & AnchorButtonProps;
// 然后这些属性都是可选的，还需要把这些属性都变成可选的，借助ts中内置的utility通用转化类型之一的的Partial<T>
// 就可以把提供的泛型全变成可选的
export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>;

// 2- 确定有哪些是需要的或需要可传入属性后，编写组件主函数从props中提出来
//@EXPORT//@ANNOTATION2
/**
 * 这是我们的第一个Button组件
 * ## Button header
 * ~~~js
 * import {Button} from 'yan.ui'
 * ~~~
 * @param {Object} props
 */
export const Button: FC<ButtonProps> = (props) => {
	const {
		btnType,
		className, // 接受支持用户自定义往组件上加指定类名，然后放到classes里
		disabled,
		size,
		children,
		href,
		...restProps // es6展开运算符来接受余下所有属性
	} = props;
	//console.log(disabled, '看传过来的disabled值');
	// 这里面会有根据不同的size，type等值来切换不同的class类名
	// btn,btn-lg,btn-primary
	const classes = classNames('btn', className, {
		[`btn-${btnType}`]: btnType,
		[`btn-${size}`]: size,
		// 这是只给Link类型的才加disabled类名的，不是这个类型会加disabled属性
		disabled: btnType === 'link' && disabled
	});
	if (btnType === 'link' && href) {
		return (
			<a className={classes} href={href} {...restProps}>
				{children}
			</a>
		);
	} else {
		return (
			<button className={classes} disabled={disabled} {...restProps}>
				{children}
			</button>
		);
	}
};
Button.defaultProps = {
	disabled: false,
	btnType: 'default'
};
//@EXPORT
export default Button;
