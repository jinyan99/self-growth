/**
 * 1- 类型别名
 * 2- 类型断言
 * 3- 交叉类型联合类型
 * 4- 新特性之字符串字面量类型定义
 * 5- Omit与Partial方法
 */
import React, { ReactElement, InputHTMLAttributes } from 'react';
// 1- 类型别名
// 类型别名常用在联合类型里面
type PlusType = (x: number, y: number) => number;
function sum(x: number, y: number): number {
	return x + y;
}
const sum2: PlusType = sum;
// 用在联合类型里面
type NameResolver = () => string;
type NameOrResolver = string | NameResolver;
function getName(n: NameOrResolver): string {
	if (typeof n === 'string') {
		return n;
	} else {
		return n();
	}
}

// 2- 类型断言：当ts不确定一个联合类型的变量到底是哪个类型的时候，我们只能访问此联合类型里所有类型里共用的属性和方法
// 类型断言as是伴随着js中赋值运算符的，直接断言给新变量名，以后都拿新变量名用即可
function getLength(input: string | number): number {
	// input.length就会报错现在还不确定传进来是数字还是字符串，这时候只能用他俩的公有属性如toString方法等
	// 这时候想用length的话，可以使用类型断言：就是告诉编译器你若没法判断我的代码的话，我本人能保证什么类型就断言给as看作一种类型
	// 这是基础写法：
	// const str = input as String; // 把它断言成string类型
	// if (str.length) {
	//     return str.length
	// } else {
	//     const number = input as Number
	//     return number.toString().length
	// }
	// 这是简便写法
	if ((<string>input).length) {
		return (<string>input).length;
	} else {
		return input.toString().length;
	}
	return;
}
// 当我们使用第三方库的时候，我们需要引用它的声明文件，才能获得对应的代码补全，接口提示等功能
// 加入我们想使用第三方库jquery的时候

// 3- 交叉类型& 联合类型｜
//  交叉类型让多种类型叠加到一起返回总类型，联合类型是或的样子

// 4- 字符串字面类型String Literal Types
type Easing = 'ease-in' | 'ease-out' | 'ease-in-out';
class UIElement {
	animate(dx: number, dy: number, easing: Easing) {
		// ...
	}
}
// 5- Omit忽略方法 Partial方法
export interface InputProps extends Omit<InputHTMLAttributes<HTMLElement>, 'size'>{
    disabled?: boolean;
    //使用Omit<T,k>来移除忽略InputHTMLAttributes中的size属性，2个参数，第一个参数是传入的泛型，第二个是将传入的范性里面的属性类型给忽略掉，以当前定义的同名属性为准
    size?: 'uiuiu' | 'tyuio'
}
// ts中内置的utility通用转化类型之一的的Partial<T>
// 就可以把提供的泛型全变成可选的
export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>;