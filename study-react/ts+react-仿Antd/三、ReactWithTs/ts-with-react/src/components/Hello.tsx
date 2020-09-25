import React from 'react';

interface IHelloProps {
	message: string;
}
// 官方react内部声明的类型中内置的即关于react框架的声明文件，都是适配于react语法的类型所以用起来极为方便。
// 所以下面就可以使用react官方定义的FunctionComponent这样一个接口，点开这个类型可以知道它也是接口和泛型
// 的结合体，可以传入泛型参数，使用这类型后里面默认就会获得一系列的静态属性的类型约束，就可以直接使用这些属
// 性了不用再额外类型描述了
// 这个类型太长，react都提供了类型别名，这个可以简写成FC
const Hello: React.FunctionComponent<IHelloProps> = (props: IHelloProps) => {
	// 约束类型后，有自动补齐功能
	return <div>{props.message}</div>;
};
// 使用FC后会自动获得一系列默认属性等等
Hello.defaultProps = {
	// 如这个设了默认props后，不用传props，自动显示这个，同时在IHelloProps中改成可选的
	//     interface IHelloProps {
	// 	message?: string;
	// }
	message: 'Hello world'
};
Hello.displayName;
Hello.propTypes;
export default Hello;
