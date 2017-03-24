/**
 * Created by gaopeng on 17/2/27.
 */
import React, {Component, PropTypes} from 'react';
import Page from '../../components/Page/Page';
import {orderPayingInWxmp} from '../../services/index';

export default function Wxpay({location:{query}, history}) {
  var orderId = query.orderId;

  // 向后台请求公众号支付需要的参数，然后发起公众号支付
  orderPayingInWxmp(orderId).then(({data, err})=>{
    if (data) {
      var result = JSON.parse(data.payparams);
      var payParam = {
        appId     : result.appId,
        timeStamp : result.timeStamp,
        nonceStr  : result.nonceStr,
        package   : result.package,
        signType  : result.signType,
        paySign   : result.sign
      };
      WeixinJSBridge.invoke('getBrandWCPayRequest', payParam, function(res){
          console.info(res);
          if(res.err_msg == "get_brand_wcpay_request:ok" ) {
            history.push('/pay/success');
          } else {
            history.push('/pay/failed?orderId=' + orderId);
          }
        }
      );
    }
  });

  return (
    <Page title="支付中...">
    </Page>
  );
}
