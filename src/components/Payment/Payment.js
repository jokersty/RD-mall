import React, {Component, PropTypes} from 'react';
import {Button, List, Radio, Popup} from 'antd-mobile';
import styles from './Payment.less';

export default class DiscountPopup extends Component {
  static propTypes = {
    payments: PropTypes.array,
    onChange: PropTypes.func
  };

  constructor() {
    super(...arguments);
    this.state = {
      check: null
    }
  }

  render() {
    var {payments, onChange} = this.props;
    var {check} = this.state;

    return (
      <section className={styles.Payment}>
        <header>
          <h1>选择付款方式</h1>
          <span className={styles.close} onClick={()=>Popup.hide()}/>
        </header>
        <main>
          <h2>需要付款</h2>
          <List className={[styles.formItem, 'radio-left'].join(' ')}>
            {
              payments && payments.length ?
                payments.map(payment=>
                  <Radio.RadioItem key={'payment-' + payment.id}
                                   checked={check == payment}
                                   onChange={()=>onChange && (onChange(), Popup.hide())}>
                    {payment.name}
                  </Radio.RadioItem>
                )
                :
                null
            }
          </List>
        </main>
      </section>
    );
  }
}
