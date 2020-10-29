/**
 * 泛型的讲解，ts中难点，
 *  学会泛型真是无所不能，就是对之前的ts东西变得动态了(可以非常灵活地返回不同的类型)，更灵活了，不用也没事不影响就是得写的多点
 *
 * 泛型相当于函数动态传参:
 *  <number>：触发器：就是函数名，支持动态传参如number
 *  <T>：注册器：这个泛型内部函数
 *  动态返回对应的不同约束类型的接口或类或函数
 *
 *  1: 就是定义函数，接口和类的时候，我们不预先指定具体的类型，而是在使用的时候在制定类型的一些特征
 *  2: 函数类接口名后圆括号前加一对见括号<T>
 *  3: 当使用时不给范型传具体类型参的话，他会隐式根据函数接受的实参进行类型推断自动给范型赋值
 */
/**
 * 1- 泛型描述函数
 */
// 简单的泛型，参数返回值的约束类型全部执行时传入的类型T变量动态设定
function echor<T>(arg: T): T {
	return arg;
}
const str: string = 'str';
const result = echor('str');
// 泛型也可以传入多个值
/* 泛型中数组类型约束可以直接写成元组:[T,U]来描述数组类型*/
function swap<T, U>(tuple: [T, U]): [U, T] {
	return [tuple[1], tuple[0]];
}
const result1 = swap(['string', 123]);
// 约束泛型
/* 1- 可以对T泛型约束指定单一类型，下面的arg：T[] 传入的T泛型只能是数组类型 */
function echoWithArr<T>(arg: T[]): T[] {
	console.log(arg.length);
	return arg;
}
const arrs = echoWithArr([1, 2, 3]);
/* 2- 通过接口，对泛型约束指定形状 ---传入的值可以有更多属性，只要包含接口里指定的就可以
   这点和正常接口不一样，政策接口是数量完全符合不能包含，泛型中不一样*/
interface IWithLength {
	length: number;
}
function echoWithLength<T extends IWithLength>(arg: T): T {
	console.log(arg.length);
	return arg;
}
const str1 = echoWithLength('str');
const obj = echoWithLength({ length: 10 });
const arr2 = echoWithLength([1, 2, 3]);
const arr3 = echoWithLength(122);

//泛型多场景使用
/* 1- 还可以使用在类上面（见下面的队列类）
 */
class Queue {
	private data = [];
	push(item) {
		return this.data.push(item);
	}
	pop() {
		return this.data.shift();
	}
}
const queue = new Queue();
queue.push(1);
queue.push('str');
// TS好处发现：
// 1: 这个代码就体现出不用泛型的不好处了，在这你还得加判断后才能用数值的方法toFixed，得多写很多代码有时候不额外判断有可能会出错
// 而且是在运行时才会出错。。要是用TS类型约束的话，提前约定好类型，就可以不用判断直接执行toFixed方法即可，而且万一输入的类型
// 不对的话，直接在编写代码的时候编译时就会给你爆出错误，不是运行时才返出错，这是极大的提升效率的地方
console.log(queue.pop().toFixed());
console.log(queue.pop().toFixed());

// 开始对类使用泛型
class Queue1<T> {
	private data = [];
	push(item: T) {
		return this.data.push(item);
	}
	pop(): T {
		return this.data.shift();
	}
}
// 可以在new时的尖括号来指定number类型，这样74行传的字符串就不行了
const queue1 = new Queue1<number>();
queue1.push(1);
queue1.push('str');

const queue2 = new Queue1<string>();
queue2.push('str');
queue2.push(123);
console.log(queue2.pop().length);

/**
 * 2- 接口也可以使用泛型让它变的更灵活
 */
interface KeyPair<T, U> {
	key: T;
	value: U;
}
let kp1: KeyPair<number, string> = { key: 123, value: 'str' };
let kp2: KeyPair<string, number> = { key: 'test', value: 123 };

let arr: number[] = [1, 2, 3];
// ts里内置的Array就是接口和泛型的结合起来一个语法糖
let arrTwo: Array<number> = [1, 2, 3];

/**
 * 3- 使用Interface接口配合泛型---来描述函数的类型
 */
interface IPlus {
	// 接口中描述函数不写箭头=>了，直接(): ;即可
	(a: number, b: number): number;
}
interface IPlus1<T> {
	(a: T, b: T): T;
}
function plus(a: number, b: number): number {
	return a + b;
}
function connect(a: string, b: string): string {
	return a + b;
}
const a: IPlus = plus;
const b: IPlus1<number> = plus;
const c: IPlus1<string> = connect;

/**
 * 4- 类型别名也可以使用泛型
 */
// 如React函数组件的类型声明的类型别名FC
// type FC<P = {}> = FunctionComponent<P>;
