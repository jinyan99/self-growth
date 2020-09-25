import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
//import {withInfo} from '@storybook/addon-info';
import Button from './button'

// 装饰器
/**
 * 添加decorator一种是在下方的storiesOf().ddDecorator添加，另一种是全局添加(在config.ts中配置)，所有组件都被装饰
 */
//const styles: React.CSSProperties = {
//    textAlign: 'center'
//}
//const CenterDecorator = (storyFn: any) => <div style={styles}>{storyFn()}</div>

const defaultButton = () => (
    <Button onClick={action('clicked')}>default button</Button>
)
const buttonWithSize = () => (
    <>
        <Button size="lg">large button</Button>
        <Button size="sm">small button</Button>
    </>
)
const buttonWithType = () => (
    <>
        <Button btnType="primary">primary button</Button>
        <Button btnType="danger">danger button</Button>
        <Button btnType="link" href="https://baidu.com" target="blank">link button</Button>
    </>
)
storiesOf('Button Component', module)
    //.addDecorator(CenterDecorator) // 添加storybook的装饰器
    //.addDecorator(withInfo)
    // 展示给addon配置属性----是在StoriesOf级别上配置
    //.addParameters({
    //    info: {
            //text: 'this is a very nice component',// 该story下全局文本信息，支持md语法,md语法要在模版字符串里写(代码就不能用模版字符串包裹了用3个波浪线包裹)
            // text: `
            //     this is a very nice component
            //     ## this is a header
            //     ~~~js
            //     const a = 'hello'
            //     ~~~
            // `,
            //inline: true// 直接默认展示info信息，没有按钮点击显示了
    //    }
    //})
    .add('Button', defaultButton) // 这个回调函数最钟要返回你的component，我们不直接在这写函数体，用变量名摘出去吧，优雅点。
    .add('不同尺寸的Button', buttonWithSize, {
        info: {
            inline: false
        }
    })
    .add('不同类型的Button', buttonWithType)