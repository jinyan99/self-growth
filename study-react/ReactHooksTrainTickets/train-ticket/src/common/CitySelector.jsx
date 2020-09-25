import React, { useState, useCallback, useEffect, useMemo, memo } from 'react';
//classnames插件的使用
import classnames from 'classnames';
import PropTypes from 'prop-types';
import './CitySelector.css';

//最小粒度的城市条目组件
const CityItem = memo(function CityItem(props) {
    const { name, onSelect } = props;//城市的名字，点击后的响应函数
    //所有复用函数组件的编写原则：点击执行函数应该由调用者来决定，所以下面的onclick直接就是调用onSelect函数
    return (
        <li className="city-li" onClick={() => onSelect(name)}>
            {name}
        </li>
    );
});

CityItem.propTypes = {
    name: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
};


//同一个首字母的城市集合组件
const CitySection = memo(function CitySection(props) {
   //函数组件写时先观察会用到什么参数，是否式属于调用者传给我的，可知标题 data都应由调用者穿的
   //为什么要传cities数据？ 因为后端城市列表数据，有title属性值是字母值，对应的title的对象里的name属性就是该字母开头的城市名，
   //直接按后端给的接口字母标示数据渲染遍历即可
   const { title, cities = [], onSelect } = props;
    //data-cate片段标记符，给它赋给title值就是那26个英文字母之一
    return (
        <ul className="city-ul">
            <li className="city-li" key="title" data-cate={title}>
                {title}{/* 字母值，下面是字母值对应的城市列表 */}
            </li>
            {cities.map(city => {
                return (
                    <CityItem
                        key={city.name} /* 每个遍历都需要在组件上标记key */
                        name={city.name}
                        onSelect={onSelect}
                    />
                );
            })}
        </ul>
    );
});

CitySection.propTypes = {
    title: PropTypes.string.isRequired,
    cities: PropTypes.array,
    onSelect: PropTypes.func.isRequired,
};



//用于字母快速定位的组件---这个组件只负责对某个字母的显示以及点击响应
const AlphaIndex = memo(function AlphaIndex(props) {
    //都由调用者来决定的原则，传入的对应字符串来表示对应的字母
    const { alpha, onClick } = props;
    //在点击事件中我们会把字母当作参数回传回去
    return (
        <i className="city-index-item" onClick={() => onClick(alpha)}>
            {alpha}
        </i>
    );
});

AlphaIndex.propTypes = {
    alpha: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};
    //arrayfrom的2参是一个回掉函数，ele是数组的每项值，index数组的每个下标
const alphabet = Array.from(new Array(26), (ele, index) => {
    //我们知道26个英文字母在ascii码上是连续的，大写字母A从65开始
    //String.fromCharCode() 可接受一个指定的 Unicode 值，然后返回一个字符串。
    return String.fromCharCode(65 + index);//循环遍历获得26个字母的字符串表示
});//最终返回的数组是字母表



//最大粒度组件，总城市列表，由memo做层优化的
const CityList = memo(function CityList(props) {
   //先想这个组件能取出什么数据呢，上面的section必须这取到，以及事件，依然透传
    const { sections, toAlpha, onSelect } = props;

    return (
        <div className="city-list">
            <div className="city-cate">
                {sections.map(section => {
                    return (
                        <CitySection
                            key={section.title}
                            title={section.title}
                            cities={section.citys}
                            onSelect={onSelect}
                        />
                    );
                })}
            </div>
            <div className="city-index">
                {alphabet.map(alpha => {
                    return (
                        <AlphaIndex
                            key={alpha}
                            alpha={alpha}
                            onClick={toAlpha}
                        />
                    );
                })}
            </div>
        </div>
    );
});

CityList.propTypes = {
    sections: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    toAlpha: PropTypes.func.isRequired,
};



// 搜索条目的组件
const SuggestItem = memo(function SuggestItem(props) {
    //写函数组件前，先想应该从props中取什么数据，首先城市的名字是必不可少的。其次就是点击之后的响应事件
    const { name, onClick } = props;

    return (
        <li className="city-suggest-li" onClick={() => onClick(name)}>
            {name}
        </li>
    );
});

SuggestItem.propTypes = {
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};
//搜索条目组件的上级组件
const Suggest = memo(function Suggest(props) {
    //想下他需要props中取什么数据呢？首先搜索栏中的内容应该取到，第二个就是选中某个搜索建议的回掉函数
    const { searchKey, onSelect } = props;

    const [result, setResult] = useState([]);
    //写这个副作用，因为有请求的发起。
    useEffect(() => {
        fetch('/rest/search?key=' + encodeURIComponent(searchKey))
            .then(res => res.json())
            .then(data => {
                const { result, searchKey: sKey } = data;
                //写这个判断：因为我们可能有多个带有不同参数的请求在同时进行。
                //谁先返回谁后返回，没有办法保证，我们要避免旧的搜索结果显示出来和当前的搜索关键词不匹配。
                //所以下面加判断，如果匹配的化，我们就借助内部状态数据的更新操作
                if (sKey === searchKey) {
                    setResult(result);
                }
            });
            //接下来就编写jsx把result渲染出来
    }, [searchKey]);

    const fallBackResult = useMemo(() => {
        if (!result.length) {
            //如果他为空时，就返回自定义的数据
            return [
                {
                    display: searchKey,
                },
            ];
        }
        //不为空，就返原数据
        return result;
    }, [result, searchKey]);

    return (
        <div className="city-suggest">
            <ul className="city-suggest-ul">
                {fallBackResult.map(item => {
                    return (
                        <SuggestItem
                            key={item.display}
                            name={item.display}
                            onClick={onSelect}
                        />
                    );
                })}
            </ul>
        </div>
    );
});

Suggest.propTypes = {
    searchKey: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
};




//这是主组件。。
const CitySelector = memo(function CitySelector(props) {
    const {
        show,//当他等于真的时候，就显示整个城市浮层
        cityData,
        isLoading,
        onBack,
        fetchCityData,
        onSelect,//作为城市列表的顶层组件的选中执行函数希望从上级传递过来，
        //点击城市后我们需要做的就是将城市的名字回填到始发站终到站中--这块的逻辑已经封装成了setselectedcity一个actioncreatore中了。
    } = props;
    //只在本组件有用 所以写内部state状态数据，作为存储搜索框内容，以便后面让小叉子点击统一删掉他们。
    const [searchKey, setSearchKey] = useState('');
    //注意写内部状态数据和全局状态数据和props的使用各自场景。
    const key = useMemo(() => searchKey.trim(), [searchKey]);
   // key是用来过滤掉首尾空白字符的。这属于是优化的部分，对以后实时搜索有很大意义
   //这块是usememo和trim的使用 一块做了2次优化

    useEffect(() => {
        if (!show || cityData || isLoading) {
            return;
        }

        fetchCityData();
    }, [show, cityData, isLoading]);

    //指定字母的字符串表示，通过这个字母，我们可以找到对应的citySection的DOm，怎么找用querySelector找
    const toAlpha = useCallback(alpha => {
        //就是方便的找到带标示符的元素，直接让他们制定
        document.querySelector(`[data-cate='${alpha}']`).scrollIntoView();
        //找到dom后直接调用dom元素的scrollIntoView()方法。
    }, []);

    //函数判断下状态
    //  只要编写组件时，设计到异步请求数据的组件挂在组件时就得考虑到loading状态的显示和数据正常显示和数据请求错误的error显示，至少3种情况
    const outputCitySections = () => {
        if (isLoading) { //看函数是否正在加载
            return <div>loading</div>;
        }

        if (cityData) { //如果cityData存在的化在使用CityList组件。
            return (
                <CityList
                    sections={cityData.cityList}
                    onSelect={onSelect}
                    toAlpha={toAlpha}
                />
            );
        }
        //否则显示error状态
        return <div>error</div>;
    };

    return (
        <div className={classnames('city-selector', { hidden: !show })}>
            <div className="city-search">{/* 搜索栏左侧返回按钮 */}
                <div className="search-back" onClick={() => onBack()}>
                    <svg width="42" height="42">
                        <polyline
                            points="25,13 16,21 25,29"
                            stroke="#fff"
                            strokeWidth="2"
                            fill="none"
                        />
                    </svg>
                </div>
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        value={searchKey}
                        className="search-input"
                        placeholder="城市、车站的中文或拼音"
                        onChange={e => setSearchKey(e.target.value)}
                    />
                </div>
                {/* 小叉子的，点击能清除框内容 没用图像表示，用的转义字符实体表示*/}
                <i
                    onClick={() => setSearchKey('')}
                    className={classnames('search-clean', {
                        hidden: key.length === 0,
                    })}
                >
                    &#xf063;
                </i>
            </div>
            {/* 要先判断下经过处理的key是否合法，如果合法再渲染搜索建议 */}
            {Boolean(key) && (
                <Suggest searchKey={key} onSelect={key => onSelect(key)} />
            )}
            {outputCitySections()}
        </div>
    );
});

CitySelector.propTypes = {
    show: PropTypes.bool.isRequired,
    cityData: PropTypes.object,  //这个不一定存在，所以不写isrequired
    isLoading: PropTypes.bool.isRequired,
    onBack: PropTypes.func.isRequired,
    fetchCityData: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
};

export default CitySelector;
