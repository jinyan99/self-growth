// Interface接口：一种规范和契约，约定一个对象长成什么形状的。
// --对对象的形状(shape)进行描述
// --对类(class)进行抽象
// --DuckTyping(鸭子类型)

// 接口的命名一般首字母是大写,里面用的是分号分割不是逗号
interface Person {
	name: string;
	age: number;
	// 可选属性
	lla?: boolean;
	// 只读属性 : 与const有点相似，const用在变量上的，readonly用在属性上的
	readonly id: number;
}
let viking: Person = {
	id: 3,
	name: 'kji',
	age: 20
};
viking.id = 33; // 只读不能赋值

// 接口中函数写法
interface Radio {
	// 约定函数是这种写法加括号，约定对象属性写法不用加括号，函数要加括号，结尾都加分号
	switchRadio(triggerl: boolean): void;
}
interface Battery {
	checkBatteryStatus();
}
// 接口之间也可以继承
interface RadioWithBattery extends Radio {
	checkBatteryStatus();
}
