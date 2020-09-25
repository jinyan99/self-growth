import '@testing-library/jest-dom/extend-expect';
import React from 'react'
import axios from 'axios';
import { RenderResult,render,fireEvent,wait,createEvent } from '@testing-library/react';
import {Upload, UploadProps} from './upload'


// 这块统一把出现的Icon图标转化成文字的形式方便测试验证icon值是否存在dom上
jest.mock('../Icon/icon.tsx', () => {
    return ({icon, onClick}) => {
        return <span onClick={onClick}>{icon}</span>
    }
})
// jest来mock库模拟发送请求--先用jest来接管axios
jest.mock('axios')
// 类型断言，断言后mockedAxios可以使用axios.post方法不然默认axios库没有axios.post方法
const mockedAxios = axios as jest.Mocked<typeof axios>


const testProps: UploadProps = {
    action: "fakeurl.com",
    onSuccess: jest.fn(),
    onChange: jest.fn(),
    onRemove: jest.fn(),
    drag: true
}
//wrapper:最外层render的结果，fileInput：隐藏的input控件，uploadArea：点击触发上传的区域
let wrapper: RenderResult, fileInput: HTMLInputElement, uploadArea: HTMLElement
//用自己创建的file对象来模拟用户上传后的文件
const testFile = new File(['xyz'], 'test.png', {type: 'image/png'})


describe('test upload component', () => {
    beforeEach(() => {
    wrapper = render(<Upload {...testProps}>Click to upload</Upload>)
    fileInput = wrapper.container.querySelector('.viking-file-input')
    uploadArea = wrapper.queryByText('Click to upload')
    })
    it('upload process should works fine', async () => {
        const {queryByText} = wrapper;
        //这样就简单实现了一使用mockedAxiospost方法就模拟返回了一个像axios请求后一样的Promise异步结果回来
        //----- 下面是2种写法，使用简便写法 ---------
        // mockedAxios.post.mockImplementation(() => {
        //     return Promise.resolve({'data': 'cool'})
        // })
        mockedAxios.post.mockResolvedValue({'data': 'cool'})

        expect(uploadArea).toBeInTheDocument()
        expect(fileInput).not.toBeVisible()
        fireEvent.change(fileInput, {target: {files: [testFile]}})
        expect(queryByText('spinner')).toBeInTheDocument()
        //先转圈出现进度条，发起异步请求，等待异步后成功会失败才开始出现test.png文件字样
        await wait(() => {
            expect(queryByText('test.png')).toBeInTheDocument()
        })
        expect(queryByText('check-circle')).toBeInTheDocument()
        // 期望它的事件函数都被调用，并且事件函数接收的实参应该是‘cool’和testFile文件对象，若不是，则测试Failed。
        expect(testProps.onSuccess).toHaveBeenCalledWith('cool', testFile)
        expect(testProps.onChange).toHaveBeenCalledWith(testFile)

        // 准备去测试上传后的文件数据列表的删除操作
        expect(queryByText('times')).toBeInTheDocument()
        fireEvent.click(queryByText('times'))
        //expect(queryByText('test.png')).not.toBeInTheDocumnet()
        // 测这个发现没通过测试，点击事件根本就没触发，因为测试中的icon图标是mock成字符串了，所以根本没有icon元素也触发不了点击事件
        // 我们需要再单独给mock掉的icon文本上加个事件见12行的onClick

        // 接着删除事件测成功了，再测下用户传入的onRemove事件是否能触发，测时还传入的指定属性的对象看onRemove⌚️函数是不是拿到的对应的文件对象给删除的
        // 这里就通过几个属性来判断是不是test.png那个文件对象，如果是的话说明删除事件触发了并没有删错，要不然就和上面那样直接传testFile了
        expect(testProps.onRemove).toHaveBeenCalledWith(expect.objectContaining({
            raw: testFile,
            status: 'success',
            name: 'test.png'
        }))// expect.objectContaining(object)与BeenCalledWith配合使用的，测试remove触发后的事件函数中接受的实参对象是否是包含某些特定的属性的对象，若不是则测试不通过

        // 上传失败的case先不写了有时间写
        // 接下来测试难度的拖拽测试
    })
    it('drag and drop files should works fine', async() => {
        // 刚开始对应的事件触发后测试它的class类名切换就可以了
        fireEvent.dragOver(uploadArea)
        expect(uploadArea).toHaveClass('is-dragover')
        fireEvent.dragLeave(uploadArea)
        expect(uploadArea).not.toHaveClass('is-dragover')

        //fireEvent.drop(uploadArea, {dataTransfer: {files: [testFile]}})
        // 写完这之后报错--因为jsdom底层还不支持e.dataTransfer属性，我们只能扩展一下事件对象了

        // ----- START -- 开始创建
            // 1- 用createEvent创建了一个drop事件的事件实例对象
        const mockDropEvent = createEvent.drop(uploadArea)
            // 2- 然后用defineProperty给该drop事件对象进行属性扩展自定义
        Object.defineProperty(mockDropEvent, 'dataTransfer', {
            value: {
                files: [testFile]
            }
        })  // 3- 这样就模拟得到了真实的原生dropEvent事件对象
            // 4- 然后用fireEvent触发uploadArea的drop事件并把自定义的事件对象传进去
        // --- END -- 创建完成并使用
        fireEvent(uploadArea, mockDropEvent)


        await wait(() => {
            expect(wrapper.queryByText('test.png')).toBeInTheDocument()
        })

        expect(testProps.onSuccess).toHaveBeenCalledWith('cool', testFile)
    })
})