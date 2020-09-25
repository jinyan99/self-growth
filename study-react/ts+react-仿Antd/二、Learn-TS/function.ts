// 对函数的输入和输出进行约定
// 返回写在行参的右括号约定为number类型

// 函数声明式写法
function add(x: number, y: number, z?: number): number {
	/**
	 * 可选参数2种写法：1-用问号
	 *               2-用es6的行参的默认值写法，可以省去问号
	 * function a(z: number = 10) 相当于 function a(z?: number)
	 */
	if (typeof z === 'number') {
		return x + y + z;
	} else {
		return x + y;
	}
}

// 函数表达式写法
const add1 = function add(x: number, y: number, z?: number): number {
	if (typeof z === 'number') {
		return x + y + z;
	} else {
		return x + y;
	}
};

// 声明函数类型
// 这个声明函数类型中的箭头函数不是es6中的箭头函数，而是ts中用来声明函数类型的符号
// ts中凡是在冒号后面的都是声明类型，和实际的代码逻辑没什么关系
const add2: (x: number, y: number, z?: number) => number = add;
// 上面那个add并没有类型声明是个函数，它是由于类型推断原则，推断出是函数类型并能赋值给add2
