import React from 'react';
import styles from './OrderProduct.less';
import {productsCache, productsIdCache, productCategoryCache} from '../../utils/storage';

function OrderProduct({order}) {
  var map = productsCache() || {};
  var productId = order.orderdetails[0].productid;
  var starttime = order.orderdetails[0].effect_datetime;
  var endtime = order.orderdetails[0].failure_datetime;
  if(starttime) {
    var start = starttime.split(/\s/g)[0];
  }
  if(endtime){
    var end = endtime.split(/\s/g)[0];
  }
  var productInfo = map[productId];
  if ( productInfo && productInfo.categoryid == 4) { //年套餐，月套餐, 自定义套餐
    return (
      <section className={styles.product_content}>
        <img src={productInfo.image}/>
        <span className={styles.product_name}>{productInfo.name}</span>
        <span className={styles.product_time}>{start}至{end}</span>
        <span className={styles.product_price}>{order.payable_amount}元</span>
        <span className={styles.product_number}>×{order.orderdetails.length}</span>
      </section>
    );
  }
  if ( productInfo && productInfo.categoryid == 5) { //多国单次卡
    return(
      <section className={styles.product_content}>
      <img src={productInfo.image} className={styles.card}/>
      <span className={styles.product_name}>{productInfo.name}({order.orderdetails[0].areaname})</span>
      <span className={styles.product_time}>{start}至{end}</span>
      <span className={styles.product_price}>{order.payable_amount}元</span>
      <span className={styles.product_number}>×{order.orderdetails.length}</span>
    </section>
    )
  }
  if ( productInfo && productInfo.categoryid == 1) { //络漫全球芯
    return(
      <section className={styles.product_content}>
      <img src={productInfo.image} className={styles.card}/>
      <span className={styles.product_name2}>{productInfo.name}</span>
      <span className={styles.product_price}>{order.payable_amount}元</span>
      <span className={styles.product_number}>×{order.orderdetails.length}</span>
    </section>
    )
  }
  if ( productInfo && productInfo.categoryid == 3 ) { //全球通话时长
    return(
      <section className={styles.product_content}>
      <img src={productInfo.image}/>
      <span className={styles.product_name}>{productInfo.name}</span>
      <span className={styles.product_time}>{order.orderdetails[0].call_duration}分钟</span>
      <span className={styles.product_price}>{order.payable_amount}元</span>
      <span className={styles.product_number}>×{order.orderdetails.length}</span>
    </section>
    )
  }
  if ( productInfo && productInfo.categoryid == 6 ) { //络漫宝
    return(
      <section className={styles.product_content}>
      <img src={productInfo.image} className={styles.card2}/>
      <span className={styles.product_name2}>{productInfo.name}</span>
      <span className={styles.product_price}>{order.payable_amount}元</span>
      <span className={styles.product_number}>×{order.orderdetails.length}</span>
    </section>
    )
  }
  if ( productInfo && productInfo.categoryid == 2 ) { //全球上网流量
    if ( order.orderdetails[0].productid ==5 ) {
      return (
        <section className={styles.product_content}>
          <img src={productInfo.image}/>
          <span className={styles.product_name3}>{order.orderdetails[0].areaname}上网流量套餐</span>
          <span className={styles.product_time2}>{start}至{end}</span>
          <span className={styles.product_method}>新卡</span>
          <span className={styles.product_price}>{order.payable_amount}元</span>
          <span className={styles.product_number}>×{order.orderdetails.length}</span>
        </section>
      )
    }if ( order.orderdetails[0].odprdattrs[2].varname == "genevoucher" && order.orderdetails[0].odprdattrs[2].value == "true") {
      return (
        <section className={styles.product_content}>
          <img src={productInfo.image}/>
          <span className={styles.product_name3}>{order.orderdetails[0].areaname}上网流量套餐</span>
          <span className={styles.product_time2}>{start}至{end}</span>
          <span className={styles.product_method}>{order.orderdetails[0].odprdattrs[2].name}</span>
          <span className={styles.product_price}>{order.payable_amount}元</span>
          <span className={styles.product_number}>×{order.orderdetails.length}</span>
        </section>
      )
    }if ( order.orderdetails[0].odprdattrs[3].varname == "genevoucher" && order.orderdetails[0].odprdattrs[3].value == "true") {
      return (
        <section className={styles.product_content}>
          <img src={productInfo.image}/>
          <span className={styles.product_name3}>{order.orderdetails[0].areaname}上网流量套餐</span>
          <span className={styles.product_time2}>{start}至{end}</span>
          <span className={styles.product_method}>{order.orderdetails[0].odprdattrs[3].name}</span>
          <span className={styles.product_price}>{order.payable_amount}元</span>
          <span className={styles.product_number}>×{order.orderdetails.length}</span>
        </section>
      )
    }if ( order.orderdetails[0].simids[0] ) {
      return (
        <section className={styles.product_content}>
          <img src={productInfo.image}/>
          <span className={styles.product_name3}>{order.orderdetails[0].areaname}上网流量套餐</span>
          <span className={styles.product_time2}>{start}至{end}</span>
          <span className={styles.product_method}>卡号：{order.orderdetails[0].simids[0]}</span>
          <span className={styles.product_price}>{order.payable_amount}元</span>
          <span className={styles.product_number}>×{order.orderdetails.length}</span>
        </section>
      )
    }else {
      return (
        <section className={styles.product_content}>
          <img src={productInfo.image}/>
          <span className={styles.product_name3}>{order.orderdetails[0].areaname}上网流量套餐</span>
          <span className={styles.product_time2}>{start}至{end}</span>
          <span className={styles.product_method}>未知</span>
          <span className={styles.product_price}>{order.payable_amount}元</span>
          <span className={styles.product_number}>×{order.orderdetails.length}</span>
        </section>
      )
    }
  }
  else{
    console.log(传入了未知的订单)
  }
}

export default OrderProduct;
