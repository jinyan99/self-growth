import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Button, { ButtonProps } from './button';
const defaultProps = {
	onClick: jest.fn()
};

const testProps: ButtonProps = {
	btnType: 'primary',
	size: 'lg',
	className: 'klass'
};

const disabledProps: ButtonProps = {
	disabled: true,
	onClick: jest.fn()
};

// 描述写的长一点详细一点更易理解
test('our first react test case', () => {
	const wrapper = render(<Button>Nice</Button>);
	// 找Nice这个文本节点，假如有就说明成功render添加上去了，若找apple我们根本就没写就会找不到就会Fail不会Pass
	const element = wrapper.queryByText('Nice');
	expect(element).toBeTruthy();
	// jest-dom扩展提供的断言方法
	expect(element).toBeInTheDocument(); // 判断组件是否在文档中
});
// 开始分类编写,下面大体的分类就写完了，然后一个一个填充它
describe('test Button component', () => {
	// 写it或test函数都可以
	it('should render the correct default button', () => {
		const wrapper = render(<Button {...defaultProps}>Nice</Button>);
		// const element = wrapper.queryByText('Nice');
		// 得用getByText方法了，因为它返回的一定是个HtmlElement类型，但queryByText返回的有可能是HTMLElement或null或uniontype类型
		// 所以下面类型不确定不能直接调用element.tagName方法，所以用getByText方法还得断言成button元素才能用44行的disabled属性
		// const element = wrapper.getByText('Nice');
		const element = wrapper.getByText('Nice') as HTMLButtonElement;
		// jest-dom扩展提供的断言方法
		expect(element).toBeInTheDocument(); // 判断组件是否在文档中
		// 然后判断它是否是个正确的button元素
		expect(element.tagName).toEqual('BUTTON'); // 注意都是大写
		expect(element).toHaveClass('btn btn-default');
		expect(element.disabled).toBeFalsy();
		fireEvent.click(element);
		expect(defaultProps.onClick).toHaveBeenCalled();
	});
	it('should render the correct component based on different props', () => {
		const wrapper = render(<Button {...testProps}>Nice</Button>);
		const element = wrapper.getByText('Nice');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass('btn-primary btn-lg klass');
	});
	it('should render a link when btnType equals link and href is provided', () => {
		const wrapper = render(
			<Button btnType="link" href="http://dummyurl">
				Link
			</Button>
		);
		const element = wrapper.getByText('Link');
		expect(element).toBeInTheDocument();
		expect(element.tagName).toEqual('A');
		expect(element).toHaveClass('btn btn-link');
	});
	it('should render disabled button when disabled set to true', () => {
		const wrapper = render(<Button {...disabledProps}>Nice</Button>);
		const element = wrapper.getByText('Nice') as HTMLButtonElement;
		expect(element).toBeInTheDocument();
		expect(element.disabled).toBeTruthy();
		fireEvent.click(element);
		expect(disabledProps.onClick).not.toHaveBeenCalled();
	});
});
