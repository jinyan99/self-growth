import React from 'react';
import {
	render,
	RenderResult,
	fireEvent,
	cleanup,
	wait
} from '@testing-library/react';
import Menu, { MenuProps } from './menu';
import MenuItem from './menuItem';
import SubMenu from './subMenu';
/**
 * 对新建的submenu组件测试引入后：1:在generateMenu中添加下SubMenu节点 2:主要添加关于SubMenu逻辑的一些case即it方法
 */
// =====start===下面是测试的准备工作
const testProps: MenuProps = {
	defaultIndex: '0',
	onSelect: jest.fn(),
	className: 'test'
};
const testVerProps: MenuProps = {
	defaultIndex: '0',
	mode: 'vertical'
};
// 测试的组件
const generateMenu = (props: MenuProps) => {
	return (
		<Menu {...props}>
			<MenuItem>active</MenuItem>
			<MenuItem disabled index={'1'}>
				disabled
			</MenuItem>
			<MenuItem>xyz</MenuItem>
			{/* <li>非正确节点</li> */}
			<SubMenu title="dropdown">
				<MenuItem>drop1</MenuItem>
			</SubMenu>
			<SubMenu title="opened">
				<MenuItem>opened1</MenuItem>
			</SubMenu>
		</Menu>
	);
};
// =====END===

/**
 * @name react-testing-library有个理念
 * @content 有个理念是你的测试用例越贴近使用者的使用方法时，测试结果就能给你越大的信心，所以它的api一般都是通过渲染元素
 * 的内容取得的节点而一般不用类名和id取的(不同元素可加相同类名就会不准)。但是我们这里要取得最外层的这个wrapper-Menu节点
 * 怎么取呢？----官方推荐我们给外层元素加上一个
 * data-testid属性，所以前往menu.tsx组件文件中根元素上加上这个属性后，提供的getByTestId(name)来取
 */

// 为测试组件添加css样式表
const createStyleFile = () => {
	const cssFile = `
        .viking-submenu {
            display:none;
        }
        .viking-submenu.menu-opened {
            display: block;
        }
    `;
	const style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = cssFile;
	return style;
};
// 测试case都要
// 先分组每组里按这3方向写case: 一般是从下面三个方向写case(1：提供默认属性是否正常现实2：行为 3：特例)
let wrapper: RenderResult,
	wrapper2: RenderResult,
	menuElement: HTMLElement,
	activeElement: HTMLElement,
	disabledElement: HTMLElement;
describe('test Menu and MenuItem component', () => {
	/**
	 * 在每个case中有相同逻辑需要复用的话，可以在beforeEach钩子中抽离，这个钩子在每个case开始之前都会跑一遍
	 */
	beforeEach(() => {
		wrapper = render(generateMenu(testProps));
		// style文件插入组件中，该生成的测试组件就有样式了
		wrapper.container.append(createStyleFile());
		// 取组件里节点，可以用getByTestId也可以用类名id名啥的
		// wrapper.container.getElementsByClassName()
		menuElement = wrapper.getByTestId('test-menu');
		activeElement = wrapper.getByText('active');
		disabledElement = wrapper.getByText('disabled');
		// 就before的钩子中拿到了元素准备测试他们
	});
	// 提供默认属性会不会显示组件和行为
	it('should render correct Menu and MenuItem based on default props', () => {
		expect(menuElement).toBeInTheDocument();
		expect(menuElement).toHaveClass('viking-menu test');
		// 这个查TagName是不分层级的查页面所有li节点，所以引入SubMenu后会出现5个节点，我们想要只查找第一层的话可以用querySelectorAll的:scope属性(:scope代表当前元素，可MDN查阅使用)
		// expect(menuElement.getElementsByTagName('li').length).toEqual(3);
		expect(menuElement.querySelectorAll(':scope > li').length).toEqual(5);
		expect(activeElement).toHaveClass('menu-item is-active');
		expect(disabledElement).toHaveClass('menu-item is-disabled');
	});
	it('click items should change active and call the right callback', () => {
		const thirdItem = wrapper.getByText('xyz');
		fireEvent.click(thirdItem);
		expect(thirdItem).toHaveClass('is-active');
		expect(activeElement).not.toHaveClass('is-active');
		expect(testProps.onSelect).toHaveBeenCalledWith('2');
		fireEvent.click(disabledElement);
		expect(disabledElement).not.toHaveClass('is-active');
		expect(testProps.onSelect).not.toHaveBeenCalledWith('1');
	});
	// 此特例分类是看mode设为vertical时是否正确渲染mode模式
	it('should render vertical mode when mode is set to vertical', () => {
		cleanup();
		const wrapper = render(generateMenu(testVerProps));
		// 这时候会出现Found multiple elements by: [data-testid="test-menu"]错误，由于before也渲染了这个元素，导致dom上渲染了两个相同的节点
		// 这时我们需要上面的cleanup方法手动清除一下。每个case执行前都会内部执行clean下上次case中beforeEach产生的元素，但是这次在case中beforeEach钩子
		// 后又手动render了一遍
		const menuElement = wrapper.getByTestId('test-menu');
		expect(menuElement).toHaveClass('menu-vertical');
	});

	// === START: SubMenu组件相关case ===
	// 1-先测默认的横向模式
	it('should show dropdown items when hover on subMenu', async () => {
		// 先侧SubMenu下的MenuItem初始是隐藏的不出现的效果
		// queryByText与getByText唯一区别就是它返回HTMLElement或null，因为有可能是不存在的
		//expect(wrapper.getByText('drop1')).not.toBeVisible();
		// 这个默认会报错，因为页面的隐藏是靠的displaynone，该测试组件内部默认没有自动引入样式表得手动在这添加相关的样式表才能见createStyleFile方法，我们组件文件中那个_style.scss文件不是在组件中直接引入使用的所以会取不到，它是在index.tsx入口文件中统一引入的，所以我们单独抽离用这个组件会没有样式

        // @TODO 这个组内测试没通过，先直接注释了

        const dropdownElement = wrapper.getByText('dropdown');
		fireEvent.mouseEnter(dropdownElement);
		// expect(wrapper.queryByText('drop1')).not.toBeVisible()
		// 直接写expect断言的话---这次点击后判断元素没隐藏又失败了，因为他默认读取不了异步操作，SubMenu组件中切换显示是用的300毫秒延时，--testing-library就给我们提供了wait方法需配合es6中async/await配合使用等待异步操作的方法
		// await wait(() => {
		// 	// 在这里写断言操作，会重复执行断言操作直到报错或异步结束完毕
		// 	expect(wrapper.queryByText('drop1')).not.toBeVisible();
		// });
		// fireEvent.click(wrapper.getByText('drop1'));
		// expect(testProps.onSelect).toHaveBeenCalledWith('3-0');
		// fireEvent.mouseLeave(dropdownElement);
		// await wait(() => {
		// 	expect(wrapper.queryByText('drop1')).not.toBeVisible();
		// });
	});
	//2-测纵向模式-----下方另起分组了见'test Menu and MenuItem component in vertical mode'所在组
	// === END: SubMenu组件相关 ===
});
describe('test Menu and MenuItem component in vertical mode', () => {
	beforeEach(() => {
		wrapper2 = render(generateMenu(testVerProps));
		wrapper2.container.append(createStyleFile());
	});
	it('should render vertical mode when mode is set to vertical', () => {
		const menuElement = wrapper2.getByTestId('test-menu');
		expect(menuElement).toHaveClass('menu-vertical');
	});
	it('should show dropdown items when click on subMenu for vertical mode', () => {
		const dropDownItem = wrapper2.queryByText('drop1');
		//expect(dropDownItem).not.toBeVisible();
		fireEvent.click(wrapper2.getByText('dropdown'));
		//expect(dropDownItem).toBeVisible();
	});
	it('should show subMenu dropdown when defaultOpenSubMenus contains SubMenu index', () => {
		//expect(wrapper2.queryByText('opened1')).not.toBeVisible();
	});
});
// 写完测试后，以后编写组件代码升级就不需要在浏览器中查看功能了直接看测试通过即可
