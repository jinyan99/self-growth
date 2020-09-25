import React from 'react'
import {storiesOf} from '@storybook/react';

storiesOf('Welcome page', module)
    .add('welcome', () => {
        return (
            <>
                <h1>欢迎来到 <span style={{color: '#0d6efd'}}>yan-brick</span> 组件库</h1>
                <p>yan-brick 仅试用于金岩团队内部组件库，持续基于业务更新</p>
                <br/><br/>
                <h3>安装试试</h3>
                <code>
                    npm install yan-ui --save
                </code>
            </>
        )
    }, {info: {disabled: true}})