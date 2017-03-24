import React from 'react';
import Page from '../../components/Page/Page';
import { connect } from 'dva';
import styles from './OrderDetails.less';
import {productsCache, productsIdCache, productCategoryCache, addressCache} from '../../utils/storage';
import {Button, List, Radio, Flex, Toast, ActivityIndicator, SwipeAction} from 'antd-mobile';
import OrderProduct from '../../components/OrderProduct/OrderProduct';
import {orderCancel} from '../../services/index';

function OrderDetails({order}) {
  var map = productsCache() || {};
  var address = addressCache()|| {};
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
  if(address.length) {
    for (var i = 0; i < address.length; i++) {
      if(address[i].id == order.ship_address) {
        var product_address = address[i];
        break
      }
    }
  }
  if(product_address){
    var product_address_details = product_address.cities[0].name + product_address.cities[1].name + product_address.cities[2].name + product_address.address;
  }
  // var alert = Modal.alert;
  var orderid=order.id;
  // var handleClick = (order)=>{
  //   alert('您确定要取消该订单吗', '', [{
  //     text: '点错了', style: 'default'},
  //     { text: '确定', style: 'default' ,
  //       onPress: () => orderCancel(order.id).then(data=> {
  //
  //       })
  //     }]);
  // }
  var renderOrderDetail = ()=> {
    if(order.order_status == 2){
      if (productInfo && productInfo.categoryid == 4) { //年套餐，月套餐, 自定义套餐
        return (
          <div className={styles.normal}>
            <header>
              <span className={styles.order_id}>订单号:{orderid}</span>
              <span className={styles.pay_status}>已取消</span>
            </header>
            <div className={styles.content}>
              <OrderProduct order={order}/>
              <section className={styles.product_text}>
                <span className={styles.product_pricekey}>商品总额</span>
                <span className={styles.product_pricevalue}>{order.payable_amount}元</span>
              </section>
              <section className={styles.product_pricetime}>
                <p className={styles.product_realprice}>实付款：{order.payable_amount}元</p>
                <p className={styles.product_starttime}>下单时间：{order.createtime}</p>
              </section>
              <aside className={styles.aside_bg}>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
              </aside>
            </div>
            <footer>
              <Button className={styles.contact}>联系客服</Button>
            </footer>
          </div>
        );
      }
      if (productInfo && productInfo.categoryid == 1) { //络漫全球芯
        return (
          <div className={styles.normal}>
            <header>
              <span className={styles.order_id}>订单号:{orderid}</span>
              <span className={styles.pay_status}>已取消</span>
            </header>
            <section className={styles.address}>
              <img src="src/routes/Product/images/location.png" className={styles.address_icon}/>
              <span className={styles.userinfo_consignee}>{product_address?product_address.consignee:""}</span>
              <span className={styles.userinfo_mobile}>{product_address?product_address.mobile:""}</span>
              <span className={styles.userinfo_addressdetails}>{product_address_details?product_address_details:""}</span>
            </section>
            <div className={styles.content}>
              <OrderProduct order={order}/>
              <section className={styles.product_text}>
                <span className={styles.product_pricekey}>商品总额</span>
                <span className={styles.product_pricevalue}>{order.payable_amount}元</span>
              </section>
              <section className={styles.product_pricetime}>
                <p className={styles.product_realprice}>实付款：{order.payable_amount}元</p>
                <p className={styles.product_starttime}>下单时间：{order.paytime}</p>
              </section>
              <aside className={styles.aside_bg}>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
              </aside>
            </div>
            <footer>
              <Button className={styles.contact}>联系客服</Button>
            </footer>
          </div>
        );
      }
      if (productInfo && productInfo.categoryid == 6) { //络漫宝
        return (
          <div className={styles.normal}>
            <header>
              <span className={styles.order_id}>订单号:{orderid}</span>
              <span className={styles.pay_status}>已取消</span>
            </header>
            <section className={styles.address}>
              <img src="src/routes/Product/images/location.png" className={styles.address_icon}/>
              <span className={styles.userinfo_consignee}>{product_address?product_address.consignee:""}</span>
              <span className={styles.userinfo_mobile}>{product_address?product_address.mobile:""}</span>
              <span className={styles.userinfo_addressdetails}>{product_address_details?product_address_details:""}</span>
            </section>
            <div className={styles.content}>
              <OrderProduct order={order}/>
              <section className={styles.product_text}>
                <span className={styles.product_pricekey}>商品总额</span>
                <span className={styles.product_pricevalue}>{order.payable_amount}元</span>
              </section>
              <section className={styles.product_pricetime}>
                <p className={styles.product_realprice}>实付款：{order.payable_amount}元</p>
                <p className={styles.product_starttime}>下单时间：{order.paytime}</p>
              </section>
              <aside className={styles.aside_bg}>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
              </aside>
            </div>
            <footer>
              <Button className={styles.contact}>联系客服</Button>
            </footer>
          </div>
        );
      }
      if (productInfo && productInfo.categoryid == 3) { //全球通话时长
        return (
          <div className={styles.normal}>
            <header>
              <span className={styles.order_id}>订单号:{orderid}</span>
              <span className={styles.pay_status}>已取消</span>
            </header>
            <div className={styles.content}>
              <OrderProduct order={order}/>
              <section className={styles.product_text}>
                <span className={styles.product_pricekey}>商品总额</span>
                <span className={styles.product_pricevalue}>{order.payable_amount}元</span>
              </section>
              <section className={styles.product_pricetime}>
                <p className={styles.product_realprice}>实付款：{order.payable_amount}元</p>
                <p className={styles.product_starttime}>下单时间：{order.paytime}</p>
              </section>
              <aside className={styles.aside_bg}>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
              </aside>
            </div>
            <footer>
              <Button className={styles.contact}>联系客服</Button>
            </footer>
          </div>
        );
      }
      if (productInfo && productInfo.categoryid == 5) { //多国单次卡
        return (
          <div className={styles.normal}>
            <header>
              <span className={styles.order_id}>订单号:{orderid}</span>
              <span className={styles.pay_status}>已取消</span>
            </header>
            <section className={styles.address}>
              <img src="src/routes/Product/images/location.png" className={styles.address_icon}/>
              <span className={styles.userinfo_consignee}>{product_address?product_address.consignee:""}</span>
              <span className={styles.userinfo_mobile}>{product_address?product_address.mobile:""}</span>
              <span className={styles.userinfo_addressdetails}>{product_address_details?product_address_details:""}</span>
            </section>
            <div className={styles.content}>
              <OrderProduct order={order}/>
              <section className={styles.product_text}>
                <span className={styles.product_pricekey}>商品总额</span>
                <span className={styles.product_pricevalue}>{order.payable_amount}元</span>
              </section>
              <section className={styles.product_pricetime}>
                <p className={styles.product_realprice}>实付款：{order.payable_amount}元</p>
                <p className={styles.product_starttime}>下单时间：{order.paytime}</p>
              </section>
              <aside className={styles.aside_bg}>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
              </aside>
            </div>
            <footer>
              <Button className={styles.contact}>联系客服</Button>
            </footer>
          </div>
        );
      }
      if (productInfo && productInfo.categoryid == 2) { //全球上网流量
        return (
          <div className={styles.normal}>
            <header>
              <span className={styles.order_id}>订单号:{orderid}</span>
              <span className={styles.pay_status}>已取消</span>
            </header>
            <div className={styles.content}>
              <OrderProduct order={order}/>
              <section className={styles.product_text}>
                <span className={styles.product_pricekey}>商品总额</span>
                <span className={styles.product_pricevalue}>{order.payable_amount}元</span>
              </section>
              <section className={styles.product_pricetime}>
                <p className={styles.product_realprice}>实付款：{order.payable_amount}元</p>
                <p className={styles.product_starttime}>下单时间：{order.paytime}</p>
              </section>
              <aside className={styles.aside_bg}>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
              </aside>
            </div>
            <footer>
              <Button className={styles.contact}>联系客服</Button>
            </footer>
          </div>
        )
      }
    }
    if(order.pay_status == 2){
      if (productInfo && productInfo.categoryid == 4) { //年套餐，月套餐, 自定义套餐
        return (
          <div className={styles.normal}>
            <header>
              <span className={styles.order_id}>订单号:{orderid}</span>
              <span className={styles.pay_status}>交易完成</span>
            </header>
            <div className={styles.content}>
              <OrderProduct order={order}/>
              <section className={styles.product_text}>
                <span className={styles.product_pricekey}>商品总额</span>
                <span className={styles.product_pricevalue}>{order.payable_amount}元</span>
              </section>
              <section className={styles.product_pricetime}>
                <p className={styles.product_realprice}>实付款：{order.payable_amount}元</p>
                <p className={styles.product_starttime}>下单时间：{order.createtime}</p>
              </section>
              <aside className={styles.aside_bg}>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
              </aside>
            </div>
            <footer>
              <Button className={styles.contact}>联系客服</Button>
            </footer>
          </div>
        );
      }
      if (productInfo && productInfo.categoryid == 1) { //络漫全球芯
        return (
          <div className={styles.normal}>
            <header>
              <span className={styles.order_id}>订单号:{orderid}</span>
              <span className={styles.pay_status}>交易完成</span>
            </header>
            <section className={styles.address}>
              <img src="src/routes/Product/images/location.png" className={styles.address_icon}/>
              <span className={styles.userinfo_consignee}>{product_address?product_address.consignee:""}</span>
              <span className={styles.userinfo_mobile}>{product_address?product_address.mobile:""}</span>
              <span className={styles.userinfo_addressdetails}>{product_address_details?product_address_details:""}</span>
            </section>
            <div className={styles.content}>
              <OrderProduct order={order}/>
              <section className={styles.product_text}>
                <span className={styles.product_pricekey}>商品总额</span>
                <span className={styles.product_pricevalue}>{order.payable_amount}元</span>
              </section>
              <section className={styles.product_pricetime}>
                <p className={styles.product_realprice}>实付款：{order.payable_amount}元</p>
                <p className={styles.product_starttime}>下单时间：{order.paytime}</p>
              </section>
              <aside className={styles.aside_bg}>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
              </aside>
            </div>
            <footer>
              <Button className={styles.contact}>联系客服</Button>
            </footer>
          </div>
        );
      }
      if (productInfo && productInfo.categoryid == 6) { //络漫宝
        return (
          <div className={styles.normal}>
            <header>
              <span className={styles.order_id}>订单号:{orderid}</span>
              <span className={styles.pay_status}>交易完成</span>
            </header>
            <section className={styles.address}>
              <img src="src/routes/Product/images/location.png" className={styles.address_icon}/>
              <span className={styles.userinfo_consignee}>{product_address?product_address.consignee:""}</span>
              <span className={styles.userinfo_mobile}>{product_address?product_address.mobile:""}</span>
              <span className={styles.userinfo_addressdetails}>{product_address_details?product_address_details:""}</span>
            </section>
            <div className={styles.content}>
              <OrderProduct order={order}/>
              <section className={styles.product_text}>
                <span className={styles.product_pricekey}>商品总额</span>
                <span className={styles.product_pricevalue}>{order.payable_amount}元</span>
              </section>
              <section className={styles.product_pricetime}>
                <p className={styles.product_realprice}>实付款：{order.payable_amount}元</p>
                <p className={styles.product_starttime}>下单时间：{order.paytime}</p>
              </section>
              <aside className={styles.aside_bg}>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
              </aside>
            </div>
            <footer>
              <Button className={styles.contact}>联系客服</Button>
            </footer>
          </div>
        );
      }
      if (productInfo && productInfo.categoryid == 3) { //全球通话时长
        return (
          <div className={styles.normal}>
            <header>
              <span className={styles.order_id}>订单号:{orderid}</span>
              <span className={styles.pay_status}>交易完成</span>
            </header>
            <div className={styles.content}>
              <OrderProduct order={order}/>
              <section className={styles.product_text}>
                <span className={styles.product_pricekey}>商品总额</span>
                <span className={styles.product_pricevalue}>{order.payable_amount}元</span>
              </section>
              <section className={styles.product_pricetime}>
                <p className={styles.product_realprice}>实付款：{order.payable_amount}元</p>
                <p className={styles.product_starttime}>下单时间：{order.paytime}</p>
              </section>
              <aside className={styles.aside_bg}>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
              </aside>
            </div>
            <footer>
              <Button className={styles.contact}>联系客服</Button>
            </footer>
          </div>
        );
      }
      if (productInfo && productInfo.categoryid == 5) { //多国单次卡
        return (
          <div className={styles.normal}>
            <header>
              <span className={styles.order_id}>订单号:{orderid}</span>
              <span className={styles.pay_status}>交易完成</span>
            </header>
            <section className={styles.address}>
              <img src="src/routes/Product/images/location.png" className={styles.address_icon}/>
              <span className={styles.userinfo_consignee}>{product_address?product_address.consignee:""}</span>
              <span className={styles.userinfo_mobile}>{product_address?product_address.mobile:""}</span>
              <span className={styles.userinfo_addressdetails}>{product_address_details?product_address_details:""}</span>
            </section>
            <div className={styles.content}>
              <OrderProduct order={order}/>
              <section className={styles.product_text}>
                <span className={styles.product_pricekey}>商品总额</span>
                <span className={styles.product_pricevalue}>{order.payable_amount}元</span>
              </section>
              <section className={styles.product_pricetime}>
                <p className={styles.product_realprice}>实付款：{order.payable_amount}元</p>
                <p className={styles.product_starttime}>下单时间：{order.paytime}</p>
              </section>
              <aside className={styles.aside_bg}>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
              </aside>
            </div>
            <footer>
              <Button className={styles.contact}>联系客服</Button>
            </footer>
          </div>
        );
      }
      if (productInfo && productInfo.categoryid == 2) { //全球上网流量
        return (
          <div className={styles.normal}>
            <header>
              <span className={styles.order_id}>订单号:{orderid}</span>
              <span className={styles.pay_status}>交易完成</span>
            </header>
            <div className={styles.content}>
              <OrderProduct order={order}/>
              <section className={styles.product_text}>
                <span className={styles.product_pricekey}>商品总额</span>
                <span className={styles.product_pricevalue}>{order.payable_amount}元</span>
              </section>
              <section className={styles.product_pricetime}>
                <p className={styles.product_realprice}>实付款：{order.payable_amount}元</p>
                <p className={styles.product_starttime}>下单时间：{order.paytime}</p>
              </section>
              <aside className={styles.aside_bg}>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
              </aside>
            </div>
            <footer>
              <Button className={styles.contact}>联系客服</Button>
            </footer>
          </div>
        )
      }
    }
    else {
      if (productInfo && productInfo.categoryid == 4) { //年套餐，月套餐, 自定义套餐
        return (
          <div className={styles.normal}>
            <header>
              <span className={styles.order_id}>订单号:{orderid}</span>
              <span className={styles.pay_status}>未支付</span>
            </header>
            <div className={styles.content}>
              <OrderProduct order={order}/>
              <section className={styles.product_text}>
                <span className={styles.product_pricekey}>商品总额</span>
                <span className={styles.product_pricevalue}>{order.payable_amount}元</span>
              </section>
              <section className={styles.product_pricetime}>
                <p className={styles.product_realprice}>实付款：{order.payable_amount}元</p>
                <p className={styles.product_starttime}>下单时间：{order.createtime}</p>
              </section>
              <aside className={styles.aside_bg}>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
              </aside>
            </div>
            <footer>
              <Button className={styles.contact}>联系客服</Button>
              <Button className={styles.ordercancel}>取消订单</Button>
              <Button className={styles.orderpayment}>去支付</Button>
            </footer>
          </div>
        );
      }
      if (productInfo && productInfo.categoryid == 1) { //络漫全球芯
        return (
          <div className={styles.normal}>
            <header>
              <span className={styles.order_id}>订单号:{orderid}</span>
              <span className={styles.pay_status}>未支付</span>
            </header>
            <section className={styles.address}>
              <img src="src/routes/Product/images/location.png" className={styles.address_icon}/>
              <span className={styles.userinfo_consignee}>{product_address?product_address.consignee:""}</span>
              <span className={styles.userinfo_mobile}>{product_address?product_address.mobile:""}</span>
              <span className={styles.userinfo_addressdetails}>{product_address_details?product_address_details:""}</span>
            </section>
            <div className={styles.content}>
              <OrderProduct order={order}/>
              <section className={styles.product_text}>
                <span className={styles.product_pricekey}>商品总额</span>
                <span className={styles.product_pricevalue}>{order.payable_amount}元</span>
              </section>
              <section className={styles.product_pricetime}>
                <p className={styles.product_realprice}>实付款：{order.payable_amount}元</p>
                <p className={styles.product_starttime}>下单时间：{order.paytime}</p>
              </section>
              <aside className={styles.aside_bg}>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
              </aside>
            </div>
            <footer>
              <Button className={styles.contact}>联系客服</Button>
              <Button className={styles.ordercancel}>取消订单</Button>
              <Button className={styles.orderpayment}>去支付</Button>
            </footer>
          </div>
        );
      }
      if (productInfo && productInfo.categoryid == 6) { //络漫宝
        return (
          <div className={styles.normal}>
            <header>
              <span className={styles.order_id}>订单号:{orderid}</span>
              <span className={styles.pay_status}>未支付</span>
            </header>
            <section className={styles.address}>
              <img src="src/routes/Product/images/location.png" className={styles.address_icon}/>
              <span className={styles.userinfo_consignee}>{product_address?product_address.consignee:""}</span>
              <span className={styles.userinfo_mobile}>{product_address?product_address.mobile:""}</span>
              <span className={styles.userinfo_addressdetails}>{product_address_details?product_address_details:""}</span>
            </section>
            <div className={styles.content}>
              <OrderProduct order={order}/>
              <section className={styles.product_text}>
                <span className={styles.product_pricekey}>商品总额</span>
                <span className={styles.product_pricevalue}>{order.payable_amount}元</span>
              </section>
              <section className={styles.product_pricetime}>
                <p className={styles.product_realprice}>实付款：{order.payable_amount}元</p>
                <p className={styles.product_starttime}>下单时间：{order.paytime}</p>
              </section>
              <aside className={styles.aside_bg}>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
              </aside>
            </div>
            <footer>
              <Button className={styles.contact}>联系客服</Button>
              <Button className={styles.ordercancel}>取消订单</Button>
              <Button className={styles.orderpayment}>去支付</Button>
            </footer>
          </div>
        );
      }
      if (productInfo && productInfo.categoryid == 3) { //全球通话时长
        return (
          <div className={styles.normal}>
            <header>
              <span className={styles.order_id}>订单号:{orderid}</span>
              <span className={styles.pay_status}>未支付</span>
            </header>
            <div className={styles.content}>
              <OrderProduct order={order}/>
              <section className={styles.product_text}>
                <span className={styles.product_pricekey}>商品总额</span>
                <span className={styles.product_pricevalue}>{order.payable_amount}元</span>
              </section>
              <section className={styles.product_pricetime}>
                <p className={styles.product_realprice}>实付款：{order.payable_amount}元</p>
                <p className={styles.product_starttime}>下单时间：{order.paytime}</p>
              </section>
              <aside className={styles.aside_bg}>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
              </aside>
            </div>
            <footer>
              <Button className={styles.contact}>联系客服</Button>
              <Button className={styles.ordercancel}>取消订单</Button>
              <Button className={styles.orderpayment}>去支付</Button>
            </footer>
          </div>
        );
      }
      if (productInfo && productInfo.categoryid == 5) { //多国单次卡
        return (
          <div className={styles.normal}>
            <header>
              <span className={styles.order_id}>订单号:{orderid}</span>
              <span className={styles.pay_status}>未支付</span>
            </header>
            <section className={styles.address}>
              <img src="src/routes/Product/images/location.png" className={styles.address_icon}/>
              <span className={styles.userinfo_consignee}>{product_address?product_address.consignee:""}</span>
              <span className={styles.userinfo_mobile}>{product_address?product_address.mobile:""}</span>
              <span className={styles.userinfo_addressdetails}>{product_address_details?product_address_details:""}</span>
            </section>
            <div className={styles.content}>
              <OrderProduct order={order}/>
              <section className={styles.product_text}>
                <span className={styles.product_pricekey}>商品总额</span>
                <span className={styles.product_pricevalue}>{order.payable_amount}元</span>
              </section>
              <section className={styles.product_pricetime}>
                <p className={styles.product_realprice}>实付款：{order.payable_amount}元</p>
                <p className={styles.product_starttime}>下单时间：{order.paytime}</p>
              </section>
              <aside className={styles.aside_bg}>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
              </aside>
            </div>
            <footer>
              <Button className={styles.contact}>联系客服</Button>
              <Button className={styles.ordercancel}>取消订单</Button>
              <Button className={styles.orderpayment}>去支付</Button>
            </footer>
          </div>
        );
      }
      if (productInfo && productInfo.categoryid == 2) { //全球上网流量
        return (
          <div className={styles.normal}>
            <header>
              <span className={styles.order_id}>订单号:{orderid}</span>
              <span className={styles.pay_status}>未支付</span>
            </header>
            <div className={styles.content}>
              <OrderProduct order={order}/>
              <section className={styles.product_text}>
                <span className={styles.product_pricekey}>商品总额</span>
                <span className={styles.product_pricevalue}>{order.payable_amount}元</span>
              </section>
              <section className={styles.product_pricetime}>
                <p className={styles.product_realprice}>实付款：{order.payable_amount}元</p>
                <p className={styles.product_starttime}>下单时间：{order.paytime}</p>
              </section>
              <aside className={styles.aside_bg}>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
                <i className={styles.circle}></i>
              </aside>
            </div>
            <footer>
              <Button className={styles.contact}>联系客服</Button>
              <Button className={styles.ordercancel}>取消订单</Button>
              <Button className={styles.orderpayment}>去支付</Button>
            </footer>
          </div>
        )
      }
    }
  };
  return (
    <Page className={styles.page} title="订单详情">
      {
        !order ?
          <ActivityIndicator size="large" toast text="正在加载"/>
          :
          renderOrderDetail()
      }
    </Page>
  );
}

function mapStateToProps(state, {params:{orderid}}) {
  if(state.order.orders) {
    for (var i = 0; i < state.order.orders.length; i++) {
      if (state.order.orders[i].id == orderid) {
        return {
          order: state.order.orders[i]
        }
      }
    }
  }
  // return {
  //   order: state.order.map[orderid]
  // };
}

export default connect(mapStateToProps)(OrderDetails);
