// 每个用例都叫一个 case，每个 case 一般都会测一个独立的功能点，细节见该文件。
// 如下面写的test函数，一参是case的名称，二参是回调。
test('test common matcher', () => {
	// 期望等于4
	expect(2 + 2).toBe(4);
	// 期望不等于5
	expect(2 + 2).not.toBe(5);
});

// 写第二个case bool类型
test('test to be true or false', () => {
	expect(1).toBeTruthy();
	expect(0).toBeFalsy();
});

// 第3个
test('test number', () => {
	expect(4).toBeGreaterThan(3);
	expect(2).toBeLessThan(3);
});

// 第4个
test('test object', () => {
	// toBe是对象值和引用完全相同
	expect({ name: 'viking' }).toBe({ name: 'viking' });
	// toEqual是仅判断值相同
	expect({ name: 'viking' }).toEqual({ name: 'viking' });
});
