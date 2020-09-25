import React from 'react';
import { CSSTransition } from 'react-transition-group';
// 由于这是ts文件除了要它的组件之外，我们还需要它的类型props，因为要用他的属性做一系列的继承
import { CSSTransitionProps } from 'react-transition-group/CSSTransition';

type AnimationName =
	| 'zoom-in-top'
	| 'zoom-in-left'
	| 'zoom-in-bottom'
	| 'zoom-in-right';

// 下面继承会报错，接口只能扩展使用静态已知成员的对象类型或对象类型的交集，
// 因为CSSTransitionProps接受范型是未知的，无法确定传递的范型与当前接口是否兼容，所以写成下面的交集类型别名
// interface TransitionProps extends CSSTransitionProps {
// 	animation?: AnimationName;
// }

type TransitionProps = CSSTransitionProps & {
    animation?: AnimationName,
    wrapper? : boolean,
  }

const Transition: React.FC<TransitionProps> = (props) => {
	const { children, classNames, animation, wrapper, ...restProps } = props;

	return (
		<CSSTransition
			classNames={classNames ? classNames : animation}
			{...restProps}
    >{wrapper ? <div>{children}</div> : children}</CSSTransition>
	);
};
Transition.defaultProps = {
    unmountOnExit: true,
    appear: true
}
export default Transition