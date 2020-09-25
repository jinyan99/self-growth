import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './HighSpeed.css';

export default function HighSpeed(props) {
    const { highSpeed, toggle } = props;
//这个组件重点是jsx中靠类名的切换对高铁动车的切换效果
    return (
        <div className="high-speed">
            <div className="high-speed-label">只看高铁/动车</div>
            <div className="high-speed-switch" onClick={() => toggle()}>
                <input type="hidden" name="highSpeed" value={highSpeed} />
                {/* 隐藏域数据把高铁动车状态form表单自动收集传到后端接口 */}
                <div
                    className={classnames('high-speed-track', {
                        checked: highSpeed,
                    })}
                >
                    <span
                        className={classnames('high-speed-handle', {
                            checked: highSpeed,
                        })}
                    ></span>
                </div>
            </div>
        </div>
    );
}

HighSpeed.propTypes = {
    highSpeed: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
};
