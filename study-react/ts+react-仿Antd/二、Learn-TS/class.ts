/**
 * 类 class
 * 类class：定义了一切事物的抽象特点
 * 对象Object：类的实例
 * 面向对象OOP：三大特性封装继承多态
 */
class Animal {
	// ts中类里面可以直接写属性的声明用分号结尾不用写值。
	// 如下面的12行的name属性提前被类型约束成string类型
	public name: string;
	constructor(name: string) {
		this.name = name;
	}
	run() {
		return `${this.name} is running`;
	}
}
const snake = new Animal('lily');
console.log(snake);

// 继承特性
class Dog extends Animal {
	readonly name1: string;
	bark() {
		return `${this.name} is barking`;
	}
}
const xiaobao = new Dog('xiaobao');
console.log(xiaobao.run());
console.log(xiaobao.bark()); // 继承后父类方法也可以执行
// 方法的重写
class Cat extends Animal {
	constructor(name) {
		super(name);
		console.log(this.name);
	}
	run() {
		return `Meow ,${super.run()}`;
	}
}
const maomao = new Cat('maomao');
console.log(maomao.run()); // maomao Meow, maomao is running

/**
 * 类的修饰符
 *  1- 给类的接受参数做权限管理
 *  2- ts给我们提供了3种访问修饰符
 *      1: public：修饰的属性和方法是公有的可以在任何地方都被访问到，默认所有的属性和方法都是public
 *          默认都是public，可以访问到和赋值，可以显示写上也可以默认不写
 *      2: protected：子类可以访问到，实例访问不到
 *      3: private：有些属性方法不愿意被别人访问到，实例和子类都访问不到
 *  3- ts还提供了一种readonly修饰符号，只能读不能写
 *  4- 静态属性和静态方法：static
 */

class Animal1 {
	readonly name: string;
	// 静态属性和静态方法
	static categories: string[] = ['mamal', 'bird'];
	static isAnimal(a) {
		return a instanceof Animal;
	}
	constructor(name: string) {
		this.name = name;
	}
	run() {
		return `${this.name} is running`;
	}
}
console.log(Animal1.categories); // ['mamal', 'bird']
const snake1 = new Animal('lily');
console.log(Animal1.isAnimal(snake1)); // true

/**
 * interface对类的行为进行抽象
 *  （之前讲的是接口对对象的形状进行抽象，现在讲它还能对类的形状进行抽象约束）
 */
// 通过这个interface告诉手机和汽车类你们都要去实现Radio的一些功能
// 完成了逻辑功能的提取和验证
interface Radio {
	// 约定函数是这种写法加括号，约定对象属性写法不用加括号，函数要加括号，结尾都加分号
	switchRadio(triggerl: boolean): void;
}
interface Battery {
	checkBatteryStatus();
}
// 接口之间也可以继承 用extends符号
interface RadioWithBattery extends Radio {
	checkBatteryStatus();
}

// 给类加类型 用implements符号
class Car implements Radio {
	switchRadio() {}
}
// 多个接口可以用逗号隔开
class Cellphone implements Radio, Battery {
	switchRadio() {}
	checkBatteryStatus() {}
}
// class Cellphone implements RadioWithBattery {
// 	switchRadio() {}
// 	checkBatteryStatus() {}
// }
