import React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import {Upload, UploadFile} from './upload'

const defaultFileList: UploadFile[] = [
    { uid: '123', size: 1234, name: 'hello.md', status: 'uploading', percent: 30 },
    { uid: '122', size: 1234, name: 'xyz.md', status: 'success', percent: 30 },
    { uid: '121', size: 1234, name: 'eyiha.md', status: 'error', percent: 30 }
]
// beforeUpdate的格式检查返bool值
const checkFileSize = (file: File) => {
    if (Math.round(file.size / 1024) > 50) {
        alert('file too big')
        return false
    }
    return true
}
// beforeUpdate的数据转化返Promise（与上面二选一）
const filePromise = (file: File) => {
    // 转化：只做重命名处理，内容一样
    const newFile = new File([file], 'new_name.doc', {type:file.type})
    return Promise.resolve(newFile)
}
const SimpleUpload = () => {
    return (
        <Upload
            action="https://www.mocky.io/v2/5cc8019d30000098a055e76"
            beforeUpload={filePromise}
            onChange={action('changed')}
            onError={action('error')}
            onSuccess={action('success')}
            onProgress={action('progress')}
            defaultFileList={defaultFileList}
            onRemove={action('removed')}
            name="fileName"
            data={{'key': 'value'}}
            headers={{'X-Powered-By': 'vikingship'}}
            accept=".jpg"
            multiple
            drag
        />
    )
}

storiesOf('Upload component', module)
    .add('Upload', SimpleUpload)