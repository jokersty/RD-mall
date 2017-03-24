import React, {Component, PropTypes} from 'react';
import {Button, Flex} from 'antd-mobile';
import {money} from  '../../utils/function';
import styles from './PayAction.less';

/**
 * 立即支付组件
 * @param amount 总价
 * @param submit 提交事件处理
 * @param orderLoading 加载状态
 * @param disabled 禁用
 * @returns {XML} React.Element
 * @constructor
 */
export default function PayAction({amount, submit, orderLoading, disabled}) {
  var amountArray = money(amount);
  return (
    <Flex className={styles.component}>
      <Flex.Item className={styles.amount}>
        <span>需要付款：</span>
        <strong>{amountArray[0]}<sub>{'.' + amountArray[1]}</sub></strong>
      </Flex.Item>
      <Flex.Item>
        <Button className={styles.btnPay} disabled={disabled} onClick={submit}>
          {
            orderLoading ? '正在创建订单...' : '立即支付'
          }
        </Button>
      </Flex.Item>
    </Flex>
  );
}


PayAction.propTypes = {
  amount: PropTypes.number,
  submit: PropTypes.func,
  orderLoading: PropTypes.bool,
  disabled: PropTypes.bool,
};

