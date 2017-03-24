import React, {Component, PropTypes} from 'react';
import {Link} from 'dva/router';
import {Button} from 'antd-mobile';
import styles from './PayResult.less';
import Page from '../../components/Page/Page';
import native from '../../services/native';

/**
 * 支付结果页面
 * @param result  支付结果：success, cancel, failed
 * @param query   需要跳转的页面， 控制按钮跳转到订单列表页面或电子劵列表页面
 * @returns {XML}
 * @constructor
 */
export default function PayResult({params:{result}, location:{query}, history}) {
  var icon, title, action, failed;
  if (result === 'success') {
    icon = require('./images/pay-success.png');
    title = '支付成功';
    action = '查看订单';
    failed = false;
  } else {
    icon = require('./images/pay-failed.png');
    title = '支付失败';
    action = '重新支付';
    failed = true;
  }
  var handleClick = ()=> {
    if (failed && query.amount && query.orderId) {
      // alert('要调用APP接口，goPayOrder'+query.orderId+'，'+query.amount);
      native.goPayOrder(Number(query.orderId), Number(query.amount), (response)=> {
        // alert('支付结果' + JSON.stringify(response));
        console.log(response);
        if (!response.error_no) {
          if (query.genevoucher) {
            history.push('/pay/success?go=coupon');
          } else {
            history.push('/pay/success');
          }
        } else {
          history.push('/pay/failed?amount=' + query.amount + '&orderId=' + query.orderId + (query.genevoucher ? '&genevoucher=true' : ''));
        }
      });
    } else {
      if (query.go) {
        native.go(query.go);
      } else {
        native.go('myOrder');
      }
    }

  };
  var ua = navigator.userAgent.toLowerCase();
  var inWeixin = /micromessenger\/(\d+.\d+.\d+)/.test(ua);
  if (inWeixin) {
    return (
      <Page className={styles.page} title={title}>
        <img src={icon}/>
        <div className={styles.actions}>
          <Link to="/">
            <Button inline>返回首页</Button>
          </Link>
        </div>
      </Page>
    );
  } else {
    return (
      <Page className={styles.page} title={title}>
        <img src={icon}/>
        <div className={styles.actions}>
          <Link to="/">
            <Button inline>返回首页</Button>
          </Link>
          <Button inline onClick={handleClick}>
            { query.go == 'coupon' ? '查看电子劵' : action }
          </Button>
        </div>
      </Page>
    );
  }
}

