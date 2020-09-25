import React, { FC, useState, ChangeEvent, ReactElement, useEffect, KeyboardEvent, useRef} from 'react';
import classNames from 'classnames';
import Input, { InputProps } from '../Input/input';
import Icon from '../Icon/icon'
import useDebounce from '../../hooks/useDebounce';
import useClickOutside from '../../hooks/useClickOutside';

/**
 * 写代码一定要循序渐进，遇到复杂组件编写时，先从最基本的核心功能组件开始，然后再慢慢增加功能
 */

// 第一步抛出确定props的Interface

interface DataSourceObject {
    //又不能把这个结构写死，不是固定的，想根据用户的使用变成用户想用的数据类型，这时候用泛型
    value: string
}
export type DataSourceType<T = unknown> = T & DataSourceObject
// 复杂类型确定好后，把下面所有原来的string类型都替换成这个DataSourceType

export interface AutoCompleteProps extends Omit<InputProps, 'onSelect'> {
	fetchSuggestions: (str: string) => DataSourceType[] | Promise<DataSourceType[]>;
    onSelect?: (item: DataSourceType) => void;
    renderOption?: (item: DataSourceType) => ReactElement;
}

// 第二步抛出主体组件
export const AutoComplete: FC<AutoCompleteProps> = (props) => {
	const { fetchSuggestions, onSelect, value, renderOption, ...restProps } = props;

	const [inputValue, setInputValue] = useState(value as string);// 将value断言成仅string类型，否则作为fetchSuggestions参数类型不对报错
	const [suggestions, setSuggestions] = useState<DataSourceObject[]>([]);
    const [loading, setLoading] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(-1);
    // 加入防抖自定义hook
    const debouncedValue = useDebounce(inputValue, 500);
    // 来控制enter键后的多余请求的状态变量
    const triggerSearch = useRef(false)
    // 用来实现clickOutSide的useRef,并有范型的使用融入
    const componentRef = useRef<HTMLDivElement>(null)
    // 直接这一行就可以完成这个通用功能
    useClickOutside(componentRef, () => {setSuggestions([])})

    useEffect(() => {
        if (debouncedValue && triggerSearch.current) {
            const results = fetchSuggestions(debouncedValue);
            if (results instanceof Promise) {
                // 加个loading图标
                setLoading(true)
                results.then(data => {
                    setLoading(false)
                    setSuggestions(data)
                })
            } else {
                setSuggestions(results);
            }
		} else {
			setSuggestions([]);
        }
        //每次下拉菜单显示完都给它高亮Index重制为-1
        setHighlightIndex(-1)
    }, [debouncedValue])

    const highlight = (index: number) => {
        if (index < 0) index = 0;
        if (index >= suggestions.length) {
            index = suggestions.length -1
        }
        setHighlightIndex(index)
    }
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        //KeyboardEvent类型是react内置定义的才可接受范型，需要从react中引入,不引入的话也是react中内置类型不过不支持范型
        switch(e.keyCode) {
            case 13://回车
                if (suggestions[highlightIndex]) {
                    handleSelect(suggestions[highlightIndex])
                }
                break;
            case 38://上
                highlight(highlightIndex - 1)
                break;
            case 40://下
                highlight(highlightIndex + 1)
                break;
            case 27://ESC
                setSuggestions([])
                break;
            default:
                break
        }
    }
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.trim();
        setInputValue(value);
        triggerSearch.current = true;
        // //下方代码全搬到useEffect分类专门副作用函数处理了
        // //这里要展示github用户名的列表，我们使用一个github官方的接口来做异步处理的测试
		// if (value) {
        //     const results = fetchSuggestions(value);
        //     if (results instanceof Promise) {
        //         // 加个loading图标
        //         setLoading(true)
        //         results.then(data => {
        //             setLoading(false)
        //             setSuggestions(data)
        //         })
        //     } else {
        //         setSuggestions(results);
        //     }
		// } else {
		// 	setSuggestions([]);
		// }
	};

	const handleSelect = (item: DataSourceObject) => {
		// 这个事件函数要处理三件事
		setInputValue(item.value); // 1- input值更新进去
		setSuggestions([]); // 2- 下拉菜单消失
		if (onSelect) {
			//3- 用户传入onSelect方法被触发
			onSelect(item);
        }
        triggerSearch.current = false;
    };
    const renderTemplate = (item: DataSourceType) => {
        return renderOption ? renderOption(item) : item.value
    }
	const generateDropdown = () => {
		return (
			<ul>
				{suggestions.map((item, index) => {
                    const cnames = classNames('suggestion-item', {
                        'is-active': index === highlightIndex
                    })
					return (
						<li key={index} className={cnames} onClick={() => handleSelect(item)}>
							{renderTemplate(item)}
						</li>
					);
				})}
			</ul>
		);
    };

	return (
		<div className="viking-auto-complete" ref={componentRef}>
			<Input value={inputValue} onChange={handleChange} onKeyDown={handleKeyDown} {...restProps} />
            {/* @TODO 图标不能正常显示，原因待查 */}
            {loading && <ul>加载中...<Icon icon="spinner" spin /></ul>}
			{suggestions.length && generateDropdown()}
		</div>
	);
};
export default AutoComplete;
