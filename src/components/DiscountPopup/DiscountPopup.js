import React, {Component, PropTypes} from 'react';
import {Button, List, Radio, Popup} from 'antd-mobile';
import styles from './DiscountPopup.less';

/**
 * 优惠劵选择弹层组件
 */
export default class DiscountPopup extends Component {
  static propTypes = {
    discounts: PropTypes.array,   // 所有可用优惠劵
    onChange: PropTypes.func,     // 所选择的优惠劵改变的时候回调
    myevoucher: PropTypes.object, // 已经选择的优惠劵
  };

  constructor(props) {
    super(...arguments);
    this.state = {
      check: props.myevoucher || null
    }
  }

  render() {
    var {discounts, onChange} = this.props;
    var {check} = this.state;

    return (
      <section className={styles.discountsPopup}>
        <header>
          <h1>选择优惠</h1>
          <span className={styles.close} onClick={()=>Popup.hide()}/>
        </header>
        <main>
          <h2>全场下单立即免邮</h2>
          <List className={[styles.formItem, 'radio-left'].join(' ')}>
            <Radio.RadioItem key={'discount-notuse'}
                             checked={check == null}
                             onChange={()=>this.setState({check: null})}>
              不使用优惠劵
            </Radio.RadioItem>
            {
              discounts && discounts.length ?
                discounts.map(discount=>
                  <Radio.RadioItem key={'discount-' + discount.id}
                                   checked={check && (check.id == discount.id)}
                                   onChange={()=>this.setState({check: discount})}>
                    {discount.name}
                  </Radio.RadioItem>
                )
                :
                null
            }
          </List>
        </main>
        <footer>
          <Button type="primary" onClick={()=>onChange && onChange(check)}>确 定</Button>
        </footer>
      </section>
    );
  }
}
