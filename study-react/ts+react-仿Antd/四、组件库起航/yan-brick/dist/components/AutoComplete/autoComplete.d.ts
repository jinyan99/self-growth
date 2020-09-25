import { FC, ReactElement } from 'react';
import { InputProps } from '../Input/input';
/**
 * 写代码一定要循序渐进，遇到复杂组件编写时，先从最基本的核心功能组件开始，然后再慢慢增加功能
 */
interface DataSourceObject {
    value: string;
}
export declare type DataSourceType<T = unknown> = T & DataSourceObject;
export interface AutoCompleteProps extends Omit<InputProps, 'onSelect'> {
    fetchSuggestions: (str: string) => DataSourceType[] | Promise<DataSourceType[]>;
    onSelect?: (item: DataSourceType) => void;
    renderOption?: (item: DataSourceType) => ReactElement;
}
export declare const AutoComplete: FC<AutoCompleteProps>;
export default AutoComplete;
