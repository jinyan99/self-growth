import React, {useState,useCallback,useMemo,memo,useEffect} from 'react'
import PropTypes from 'prop-types'
import "./CitySelector.css"
import classnames from 'classnames';
//渲染城市列表，视觉分析有三个组件：最小粒度城市条目组件+字母序列组件+城市大列表组件
 //最小粒度城市条目组件
const CityItem = memo(function CityItem(props) {
    const { name, onSelect} = props;
    return (
        <li className="city-li" onClick={()=> onSelect(name)}>
            {name}
        </li>
    )
})
CityItem.propTypes = {
    name: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
};
//同个首字母的城市集合组件
const CitySection = memo(function CitySection(props) {
    const {title, cities=[],onSelect} = props;
    return(
        <ul className="city-ul">
            <li className="city-li" key="title" data-cate={title}>
                {title}
            </li>
            {
                cities.map(city => {
                    return (
                        <CityItem
                            key={city.name}
                            name={city.name}
                            onSelect={onSelect}
                        ></CityItem>
                    )
                })
            }
        </ul>
    )
})
CitySection.propTypes = {
    title: PropTypes.string.isRequired,
    cities: PropTypes.array,
    onSelect: PropTypes.func.isRequired,
};
const alphabet = Array.from(new Array(26), (ele,index) => {
    return String.fromCharCode(65 + index)
})
//用于字母快速定位的字母最小粒度组件--
const AlphaIndex = memo(function AlphaIndex(props) {
    const {alpha,onClick} = props;
    return (
        <i className="city-index-item" onClick={()=> onClick(alpha)}>
            {alpha}
        </i>
    )
})
AlphaIndex.propTypes = {
    alpha: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};
//最大粒度组件总城市列表的
const CityList = memo(function CityList(props) {
    const {toAlpha,onSelect,sections} = props;
    //这个toAlpha方法主组件传过来的，方法在主组件中定义的
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
                    )
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
                    )
                })}
            </div>
        </div>
    )
})

//最小粒度化组件li
const SuggestItem = memo(function SuggestItem(props) {
    const {name,onClick} = props
    return (
        <li className="city-suggest-li" onClick={() => onClick(name)}>
            {name}
        </li>
    )
})
//这个组件是要显示数据，需要网络请求获取数据的，必须得借助useEffect
const Suggest = memo(function Suggest(props) {
    const {searchKey, onSelect} = props;
    const [result, setResult] = useState([])
    useEffect(() => {
        fetch('/rest/search?key=' + encodeURIComponent(searchKey))
            .then(res => res.json())
            .then(data => {
                const {result,searchKey: sKey } = data;
                if(sKey === searchKey) {
                    setResult(result)
                }
            })
    }, [searchKey])
    const fallBackResult = useMemo(() => {
        if(!result.length) {
            return [
                {
                    display: searchKey,
                }
            ]
        }
        return result

    }, [result,searchKey
    ])
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
                    )
                })}
            </ul>
        </div>
    )
})

//主组件
function CitySelector(props) {
    const {
        show,
        onBack,
        onSelect,
        isLoading,
        fetchCityData, //用于获取city数据的
        cityData,
    } = props;
    //内部状态逻辑，只在本组件里有用
    const [searchKey, setSearchKey] = useState('')
    const key = useMemo(() => searchKey.trim(), [searchKey])
    useEffect(() => {
        if(!show || cityData || isLoading) {
            return
        }
        fetchCityData()
    },[show,cityData,isLoading,fetchCityData])
    const toAlpha = useCallback((alpha) => {
        document.querySelector(`[data-cate=${alpha}]`).scrollIntoView()
    })
//只要编写组件时，设计到异步请求数据的组件挂在组件时就得考虑到loading状态的显示和数据正常显示和数据请求错误的error显示，至少3种情况
    const outputCitySections =() => {
        if(isLoading) {return <div>loading</div>}
        if(cityData) {
            return (
                <CityList
                    sections={cityData.cityList}
                    onSelect={onSelect}
                    toAlpha={toAlpha}
                />
            )
        }
        return <div>error</div>
    }
    return (
        <div className={classnames('city-selector',{hidden:!show})}>
            <div className="city-search">
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
                    <input  //受控组件
                        type="text"
                        value={searchKey}
                        className="search-input"
                        placeholder="城市、车站的中文或拼音"
                        onChange={e => setSearchKey(e.target.value)}
                    />
                </div>
                <i
                    onClick={() => setSearchKey('')}
                    className={classnames('search-clean', {
                        hidden: key.length === 0,
                    })}
                >
                    &#xf063;
                </i>
            </div>
            {Boolean(key) && (
                <Suggest
                    searchKey={key}
                    onSelect={key => onSelect(key)}
                />
            )}
            {outputCitySections()}
        </div>
    )
}
export default CitySelector