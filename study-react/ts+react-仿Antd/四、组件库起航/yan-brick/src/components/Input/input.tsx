// import React, { ReactElement, InputHTMLAttributes,FC } from 'react';
// import { IconProp} from '@fortawesome/fontawesome-svg-core';


// type InputSize = 'lg' | 'sm';
// // 第一步：抛出组件props接口类型---(使用ts中的Omit就把size忽略掉了否则当前同名属性size与传入的input原生范型中的size属性同名属性类型冲突了就会报错，下面是忽略掉范型中的number类型以当前string类型为准)
// export interface InputProps extends Omit<InputHTMLAttributes<HTMLElement>, 'size'>{
//     disabled?: boolean;
//     //使用Omit<T,k>来移除忽略InputHTMLAttributes中的size属性，2个参数，第一个参数是传入的泛型，第二个是将传入的范性里面的属性类型给忽略掉，以当前定义的同名属性为准
//     size?: InputSize;
//     icon?: IconProp;
//     prepand?: string | ReactElement;
//     append?: string | ReactElement;
// }

// // 第二步：抛出主组件编写
// export const Input: FC<InputProps> = (props) => {
//     // 1- 取出各种属性

//     // 2- 根据属性计算不同的className预设，用来添加样式

//     return (
//         // 根据属性判断是否要添加特定的节点
//         <>
//         </>
//     )
// }
//========== 上面是组件流程开发思路结构 ===========
//========== 下面是正式组件开发代码文件 ===========

import React, { FC, ReactElement, InputHTMLAttributes, ChangeEvent } from 'react'
import classNames from 'classnames'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import Icon from '../Icon/icon'

type InputSize = 'lg' | 'sm'
export interface InputProps extends Omit<InputHTMLAttributes<HTMLElement>, 'size' > {
  /**是否禁用 Input */
  disabled?: boolean;
  /**设置 input 大小，支持 lg 或者是 sm */
  size?: InputSize;
  /**添加图标，在右侧悬浮添加一个图标，用于提示 */
  icon?: IconProp;
  /**添加前缀 用于配置一些固定组合 */
  prepend?: string | ReactElement;
  /**添加后缀 用于配置一些固定组合 */
  append?: string | ReactElement;
  // ChangeEvent为 react内置change事件类型，传入指定的泛型是inputelement，即input元素的事件函数类型
  onChange? : (e: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Input 输入框 通过鼠标或键盘输入内容，是最基础的表单域的包装。
 *
 * ~~~js
 * // 这样引用
 * import { Input } from 'yan.ui'
 * ~~~
 * 支持 HTMLInput 的所有基本属性
 */
export const Input: FC<InputProps> = (props) => {
  const {
    disabled,
    size,
    icon,
    prepend,
    append,
    style,
    ...restProps
  } = props
  const cnames = classNames('viking-input-wrapper', {
    [`input-size-${size}`]: size,
    'is-disabled': disabled,
    'input-group': prepend || append,
    'input-group-append': !!append,
    'input-group-prepend': !!prepend
  })

  const fixControlledValue = (value: any) => {
    if (typeof value === 'undefined' || value === null) {
      return ''
    }
    return value
  }
  // 由于表单组件的受控组件和非受控组件defautValue不能同时存在，会报错，在这里做个判断
  if('value' in props) {
    // 如果value属性在props中，就delete下restProp中defaultValue以value为主
    delete restProps.defaultValue
    // 当在故事文件中写受控组件的case中，若useState()默认什么都不填undefiend时，这时候受控的话，在一个组件中react不允许非受控组件转为受控组件，就会报错
    // 所以加了下面的赋值函数，在组件内部中规避这种错误发生
    restProps.value = fixControlledValue(props.value)
  }

  return (
    <div className={cnames} style={style}>
      {prepend && <div className="viking-input-group-prepend">{prepend}</div>}
      {icon && <div className="icon-wrapper"><Icon icon={icon} title={`title-${icon}`}/></div>}
      <input
        className="viking-input-inner"
        disabled={disabled}
        {...restProps}
      />
      {append && <div className="viking-input-group-append">{append}</div>}
    </div>
  )
}

export default Input;