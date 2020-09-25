/**
 * enum 枚举
 *  这个枚举编译成js文件时会有这样的操作：Direction[Direction["Up"] = 0] = "Up"(赋值运算符返回的是赋的值)
 *  即给这个枚举名每个属性做了附加操作：即加了下标属性和字符串属性，[0]是 Up，["Up"]是0
 *  而且当用户定义有指定值时下标值会动态递增。
 *  ts中的枚举类型和普通的js对象本质上没有区别，只是对于开发者来说，相较于直接使用值类型去做判断，枚举类型更易读，能够提升代码的可读性和易维护性。
 *
 * 使用：
 *      1- enum可作为自定义的数据类型来约束(name: Direction)
 */

// 数组枚举：就是给属性数字默认值
enum Direction {
	// 属性的值默认递增从0开始
	Up,
	Down,
	Left,
	Right
}
console.log(Direction.Up); // 输出 0
console.log(Direction[0]); // 输出 ‘Up’
// 当给设值时，后面的值会自动递增，Down是11，12，13
enum Direction1 {
	Up = 10,
	Down,
	Left,
	Right
}
// 字符串枚举：就是给属性字符串默认值
enum Direction2 {
	Up = 'Up',
	Down = 'Down',
	Left = 'Left',
	Right = 'Right'
}
const value = 'Up';
if (value === Direction2.Up) {
	console.log('true'); // 打印成功
}

// 常量枚举：可以提升性能，会内联枚举的用法
// 只有常量值能进行常量枚举，变量值不能进行常量枚举
const enum Direction3 {
	Up = 'Up',
	Down = 'Down',
	Left = 'Left',
	Right = 'Right'
}
const value1 = 'Up';
if (value === Direction2.Up) {
	console.log('true'); // 打印成功
}
//用到常量枚举后，当它编译4成js文件时常量枚举不会被编译到这不就提升效率了，会内联执行返回结果
// 上面写的固定值其实都是常量枚举
