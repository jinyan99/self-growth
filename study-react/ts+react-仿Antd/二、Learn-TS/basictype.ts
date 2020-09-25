// 这节主要讲ts中基础数据类型
// es6中提供了二进制和八进制的新的写法分别用前缀0b和0o表示

// 1-5种原始数据类型的介绍
let isDone: boolean = false;
let age: number = 20;
let binaryNumber: number = 0b111;

let firstName: string = 'jinyan';
let meaage: string = `Hello, ${firstName},age is ${age}`;

let u: undefined = undefined;
let n: null = null;
// 注意：undefined和null是所有类型的子类型，即undefined类型的变量可以赋值给number类型的变量
let num: number = undefined;

// 2-其他类型介绍
// any类型
let notSure: any = 4;
notSure = 'maybe it is a string';
notSure = true;
// 联合类型
let numberOrString: number | string = 234;
numberOrString = 'abc';
// 数组类型 ：把同种类型放到一起
let arrOfNumbers: number[] = [1, 2, 4, 5];
arrOfNumbers.push(4);
arrOfNumbers.push('zifu'); // 用这个方法时就会报错这叫编译时检查类型，单纯js是运行时才会执行检查

function test() {
	// 类数组
	console.log(arguments);
	let arr: [] = arguments; // 类数组类型也不能赋值给arr
}
// 元组:限定了数据类型和长度的数组
let user: [string, number] = ['dd', 2];

// 对象类型--可以直接写成对象形式，也可以用接口来约束类型
// 'axios'.get(url).then((result: { data: any; }) => {
// setData(result.data);
// });
// Interface接口
// --对对象的形状(shape)进行描述
// --对类(class)进行抽象
// --DuckTyping(鸭子类型)
