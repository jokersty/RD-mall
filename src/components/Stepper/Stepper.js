import React, {Component, PropTypes} from 'react';
import {Flex} from 'antd-mobile';
import './Stepper.less';

/**
 * 步进器组件，由于antd-mobile/stepper组件在点击"+-"时总是会触发键盘，所以自己实现此组件
 */
export default class Stepper extends Component {

  static propTypes = {
    step: PropTypes.number,
    onChange: PropTypes.func,
    min: PropTypes.number,
    max: PropTypes.number,
    showNumber: PropTypes.bool,
    value: PropTypes.number
  };

  constructor(props) {
    super(...arguments);
    this.state = {
      value: props.defaultValue || 1 //步进器的初始值
    };
  }

  componentDidMount(){
    // console.log('componentDidMount', this.props.defaultValue);
    this.setState({value: this.props.defaultValue || 1});
  }

  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.defaultValue != 'undefined') {
      // console.log('componentWillReceiveProps', nextProps.defaultValue);
      this.setState({value: nextProps.defaultValue})
    }
  }

  /**
   * 渲染组件
   **/
  render() {
    var {step = 1, onChange, min, max, showNumber} = this.props;
    var value = this.state.value;
    var handleClick = (a, e)=> {
      if (!e.disabled) {
        value += a * step;
        value = Math.max(min, Math.min(value, max));
        this.setState({value});
        onChange && onChange(value, this);
      }
    };
    var disabledUp = value == max;
    var disabledDown = value == min;
    var upClassName = ['am-stepper-handler', 'am-stepper-handler-up'];
    var downClassName = ['am-stepper-handler am-stepper-handler-down'];
    if (disabledUp) {
      upClassName.push('am-stepper-handler-up-disabled');
    }
    if (disabledDown) {
      downClassName.push('am-stepper-handler-down-disabled');
    }
    return (
      <div className={"am-stepper " + (showNumber ? 'showNumber' : '')}>
        <div className="am-stepper-handler-wrap">
          <span disabled={disabledUp} unselectable="unselectable" className={upClassName.join(' ')}
                onClick={handleClick.bind(this, 1)}>
            <span disabled={disabledUp} unselectable="unselectable" className="am-stepper-handler-up-inner"/>
          </span>
          <span disabled={disabledDown} unselectable="unselectable" className={downClassName.join(' ')}
                onClick={handleClick.bind(this, -1)}>
            <span disabled={disabledDown} unselectable="unselectable" className="am-stepper-handler-down-inner"/>
          </span>
        </div>
        <div className="am-stepper-input-wrap">
          <span className="am-stepper-input">{value}</span>
          {/*<input step="1" min="1" max="999" className="am-stepper-input" autocomplete="off" value="1"/>*/}
        </div>
      </div>
    );
  }
}
