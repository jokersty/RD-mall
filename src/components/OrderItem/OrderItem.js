import React, {Component,PropTypes} from 'react';
import styles from './OrderItem.less';
import {Button, List, Radio, Flex, Toast, ActivityIndicator, SwipeAction,Modal,Popup} from 'antd-mobile';
import {productsCache, productsIdCache, productCategoryCache} from '../../utils/storage';
import {Link} from 'dva/router';
import OrderProduct from '../OrderProduct/OrderProduct';
import {orderCancel} from '../../services/index';
import DiscountPopup from '../Payment/Payment';

export default class OrderItem extends Component{
  constructor(props){
    super(props);
    const {order}= props;
    var map = productsCache() || {};
    var productId = order.orderdetails[0].productid;
    var starttime = order.orderdetails[0].effect_datetime;
    var endtime = order.orderdetails[0].failure_datetime;
    if (starttime) {
      var start = starttime.split(/\s/g)[0];
    }
    if (endtime) {
      var end = endtime.split(/\s/g)[0];
    }
    var productInfo = map[productId];
    var link = `/order-details/${order.id}`;
    var order_status = order.order_status;
    var evouchers=order.evouchers || [];         // 电子劵列表
    var myevoucher=order.myevoucher || [];              // 订单使用的电子劵
    this.state = {
       order,
       start,
       end,
       link,
       productInfo,
      order_status,
      evouchers,
      myevoucher
    };
  }


  render(){
    const alert = Modal.alert;
    var handleClick = (order)=>{
      alert('您确定要取消该订单吗', '', [{
          text: '点错了', style: 'default'},
          { text: '确定', style: 'default' ,
          onPress: () => orderCancel(order.id).then(data=> {
            this.setState({order_status: data.data.order.order_status})
          })
        }]);
    }
    const {order, start, end, link, productInfo,order_status,evouchers,myevoucher} = this.state;
    var discountEvoucher = evouchers => {
      // console.log(evoucher);
      if (evouchers) {
        dispatch({
          type: 'order/discountEvoucher',
          payload: {
            orderid: evouchers.orderid || order.id,
            evoucherid: evouchers.id
          }
        });
      } else {
        dispatch({
          type: 'order/discountEvoucher',
          payload: {
            orderid: order.id,
            evoucherid: 0 //电子劵ID为0时取消订单的电子劵
          }
        });
      }
      Popup.hide();
    };
    var orderJudgeSuccess = function (){
      if ( productInfo && productInfo.categoryid == 4) { //年套餐，月套餐, 自定义套餐
        return (
          <div className={styles.normal}>
            <div className={styles.normal1}></div>
            <Link to={link}>
              <div className={styles.normal2}>
                <header>
                  <span className={styles.order_id}>订单号:{order.id}</span>
                  <span className={styles.pay_status}>交易完成</span>
                </header>
                <OrderProduct order={order}/>
                <section className={styles.product_text}>共{order.orderdetails.length}件商品，实付款:<span className={styles.price_style}>{order.payable_amount}元</span>
                </section>
                <footer className={styles.orderbutton}>
                </footer>
                <aside className={styles.aside_bg}>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                </aside>
              </div>
            </Link>
          </div>

        )
      }if ( productInfo && productInfo.categoryid == 5) { //多国单次卡
        return (
          <div className={styles.normal}>
            <div className={styles.normal1}></div>
            <Link to={link}>
              <div className={styles.normal2}>
                <header>
                  <span className={styles.order_id}>订单号:{order.id}</span>
                  <span className={styles.pay_status}>交易完成</span>
                </header>
                <OrderProduct order={order}/>
                <section className={styles.product_text}>共{order.orderdetails.length}件商品，实付款:<span className={styles.price_style}>{order.payable_amount}元</span>
                </section>
                <footer className={styles.orderbutton}>

                </footer>
                <aside className={styles.aside_bg}>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                </aside>
              </div>
            </Link>
          </div>

        )
      }if ( productInfo && productInfo.categoryid == 1) { //络漫全球芯
        return (
          <div className={styles.normal}>
            <div className={styles.normal1}></div>
            <Link to={link}>
              <div className={styles.normal2}>
                <header>
                  <span className={styles.order_id}>订单号:{order.id}</span>
                  <span className={styles.pay_status}>交易完成</span>
                </header>
                <OrderProduct order={order}/>
                <section className={styles.product_text}>共{order.orderdetails.length}件商品，实付款:<span className={styles.price_style}>{order.payable_amount}元</span>
                </section>
                <footer className={styles.orderbutton}>
                </footer>
                <aside className={styles.aside_bg}>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                </aside>
              </div>
            </Link>
          </div>

        )
      }if ( productInfo && productInfo.categoryid == 3 ) { //全球通话时长
        return (
          <div className={styles.normal}>
            <div className={styles.normal1}></div>
            <Link to={link}>
              <div className={styles.normal2}>
                <header>
                  <span className={styles.order_id}>订单号:{order.id}</span>
                  <span className={styles.pay_status}>交易完成</span>
                </header>
                <OrderProduct order={order}/>
                <section className={styles.product_text}>共{order.orderdetails.length}件商品，实付款:<span className={styles.price_style}>{order.payable_amount}元</span>
                </section>
                <footer className={styles.orderbutton}>
                </footer>
                <aside className={styles.aside_bg}>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                </aside>
              </div>
            </Link>
          </div>

        )
      }if ( productInfo && productInfo.categoryid == 6 ) { //络漫宝
        return (
          <div className={styles.normal}>
            <div className={styles.normal1}></div>
            <Link to={link}>
              <div className={styles.normal2}>
                <header>
                  <span className={styles.order_id}>订单号:{order.id}</span>
                  <span className={styles.pay_status}>交易完成</span>
                </header>
                <OrderProduct order={order}/>
                <section className={styles.product_text}>共{order.orderdetails.length}件商品，实付款:<span className={styles.price_style}>{order.payable_amount}元</span>
                </section>
                <footer className={styles.orderbutton}>
                </footer>
                <aside className={styles.aside_bg}>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                </aside>
              </div>
            </Link>
          </div>
        )
      }if ( productInfo && productInfo.categoryid == 2 ) { //全球上网流量
        return (
          <div className={styles.normal}>
            <div className={styles.normal1}></div>
            <Link to={link}>
              <div className={styles.normal2}>
                <header>
                  <span className={styles.order_id}>订单号:{order.id}</span>
                  <span className={styles.pay_status}>交易完成</span>
                </header>
                <OrderProduct order={order}/>
                <section className={styles.product_text}>共{order.orderdetails.length}件商品，实付款:<span className={styles.price_style}>{order.payable_amount}元</span>
                </section>
                <footer className={styles.orderbutton}>
                </footer>
                <aside className={styles.aside_bg}>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                </aside>
              </div>
            </Link>
          </div>
        )
      }
    };
    var orderJudgeFail = function (){
      if ( productInfo && productInfo.categoryid == 4) { //年套餐，月套餐, 自定义套餐
        return (
          <div className={styles.normal}>
            <div className={styles.normal1}></div>
            <Link to={link}>
              <div className={styles.normal2}>
                <header>
                  <span className={styles.order_id}>订单号:{order.id}</span>
                  <span className={styles.pay_status}>未支付</span>
                </header>
                <OrderProduct order={order}/>
                <section className={styles.product_text}>共{order.orderdetails.length}件商品，实付款:<span className={styles.price_style}>{order.payable_amount}元</span>
                </section>
                <footer className={styles.orderbutton}>
                </footer>
                <aside className={styles.aside_bg}>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                </aside>
              </div>
            </Link>
            <Button className={styles.orderpayment} onClick={()=>{Popup.show(<DiscountPopup  myevoucher={myevoucher} discounts={evouchers} onChange={discountEvoucher}/>, {animationType: 'slide-up'})}}>去支付</Button>
            <Button className={styles.ordercancel} onClick={handleClick.bind(this,order)}>取消订单</Button>
          </div>
        )
      }
      if ( productInfo && productInfo.categoryid == 5) { //多国单次卡
        return (
          <div className={styles.normal}>
            <div className={styles.normal1}></div>
            <Link to={link}>
              <div className={styles.normal2}>
                <header>
                  <span className={styles.order_id}>订单号:{order.id}</span>
                  <span className={styles.pay_status}>未支付</span>
                </header>
                <OrderProduct order={order}/>
                <section className={styles.product_text}>共{order.orderdetails.length}件商品，实付款:<span className={styles.price_style}>{order.payable_amount}元</span>
                </section>
                <footer className={styles.orderbutton}>
                </footer>
                <aside className={styles.aside_bg}>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                </aside>
              </div>
            </Link>
            <Button className={styles.orderpayment}>去支付</Button>
            <Button className={styles.ordercancel} onClick={handleClick.bind(this,order)}>取消订单</Button>
          </div>

        )
      }
      if ( productInfo && productInfo.categoryid == 1) { //络漫全球芯
        return (
          <div className={styles.normal}>
            <div className={styles.normal1}></div>
            <Link to={link}>
              <div className={styles.normal2}>
                <header>
                  <span className={styles.order_id}>订单号:{order.id}</span>
                  <span className={styles.pay_status}>未支付</span>
                </header>
                <OrderProduct order={order}/>
                <section className={styles.product_text}>共{order.orderdetails.length}件商品，实付款:<span className={styles.price_style}>{order.payable_amount}元</span>
                </section>
                <footer className={styles.orderbutton}>
                </footer>
                <aside className={styles.aside_bg}>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                </aside>
              </div>
            </Link>
            <Button className={styles.orderpayment}>去支付</Button>
            <Button className={styles.ordercancel} onClick={handleClick.bind(this,order)}>取消订单</Button>
          </div>

        )
      }
      if ( productInfo && productInfo.categoryid == 3 ) { //全球通话时长
        return (
          <div className={styles.normal}>
            <div className={styles.normal1}></div>
            <Link to={link}>
              <div className={styles.normal2}>
                <header>
                  <span className={styles.order_id}>订单号:{order.id}</span>
                  <span className={styles.pay_status}>未支付</span>
                </header>
                <OrderProduct order={order}/>
                <section className={styles.product_text}>共{order.orderdetails.length}件商品，实付款:<span className={styles.price_style}>{order.payable_amount}元</span>
                </section>
                <footer className={styles.orderbutton}>
                </footer>
                <aside className={styles.aside_bg}>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                </aside>
              </div>
            </Link>
            <Button className={styles.orderpayment} onClick={()=>{Popup.show(<DiscountPopup />)}}>去支付</Button>
            <Button className={styles.ordercancel} onClick={handleClick.bind(this,order)}>取消订单</Button>
          </div>

        )
      }
      if ( productInfo && productInfo.categoryid == 6 ) { //络漫宝
        return (
          <div className={styles.normal}>
            <div className={styles.normal1}></div>
            <Link to={link}>
              <div className={styles.normal2}>
                <header>
                  <span className={styles.order_id}>订单号:{order.id}</span>
                  <span className={styles.pay_status}>未支付</span>
                </header>
                <OrderProduct order={order}/>
                <section className={styles.product_text}>共{order.orderdetails.length}件商品，实付款:<span className={styles.price_style}>{order.payable_amount}元</span>
                </section>
                <footer className={styles.orderbutton}>
                </footer>
                <aside className={styles.aside_bg}>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                </aside>
              </div>
            </Link>
            <Button className={styles.orderpayment} onClick={()=>{Popup.show(<DiscountPopup />), {animationType: 'slide-up'}}}>去支付</Button>
            <Button className={styles.ordercancel} onClick={handleClick.bind(this,order)}>取消订单</Button>
          </div>
        )
      }
      if ( productInfo && productInfo.categoryid == 2 ) { //全球上网流量
        return (
          <div className={styles.normal}>
            <div className={styles.normal1}></div>
            <Link to={link}>
              <div className={styles.normal2}>
                <header>
                  <span className={styles.order_id}>订单号:{order.id}</span>
                  <span className={styles.pay_status}>未支付</span>
                </header>
                <OrderProduct order={order}/>
                <section className={styles.product_text}>共{order.orderdetails.length}件商品，实付款:<span className={styles.price_style}>{order.payable_amount}元</span>
                </section>
                <footer className={styles.orderbutton}>
                </footer>
                <aside className={styles.aside_bg}>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                </aside>
              </div>
            </Link>
            <Button className={styles.orderpayment}>去支付</Button>
            <Button className={styles.ordercancel} onClick={handleClick.bind(this,order)}>取消订单</Button>
          </div>
        )
      }
    };
    var orderJudgeCancel =function (){
      if ( productInfo && productInfo.categoryid == 4) { //年套餐，月套餐, 自定义套餐
        return (
          <div className={styles.normal}>
            <div className={styles.normal1}></div>
            <Link to={link}>
              <div className={styles.normal2}>
                <header>
                  <span className={styles.order_id}>订单号:{order.id}</span>
                  <span className={styles.pay_status}>已取消</span>
                </header>
                <OrderProduct order={order}/>
                <section className={styles.product_text}>共{order.orderdetails.length}件商品，实付款:<span className={styles.price_style}>{order.payable_amount}元</span>
                </section>
                <footer className={styles.orderbutton}>
                </footer>
                <aside className={styles.aside_bg}>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                </aside>
              </div>
            </Link>
          </div>
        )
      }
      if ( productInfo && productInfo.categoryid == 5) { //多国单次卡
        return (
          <div className={styles.normal}>
            <div className={styles.normal1}></div>
            <Link to={link}>
              <div className={styles.normal2}>
                <header>
                  <span className={styles.order_id}>订单号:{order.id}</span>
                  <span className={styles.pay_status}>已取消</span>
                </header>
                <OrderProduct order={order}/>
                <section className={styles.product_text}>共{order.orderdetails.length}件商品，实付款:<span className={styles.price_style}>{order.payable_amount}元</span>
                </section>
                <footer className={styles.orderbutton}>
                </footer>
                <aside className={styles.aside_bg}>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                </aside>
              </div>
            </Link>
          </div>

        )
      }
      if ( productInfo && productInfo.categoryid == 1) { //络漫全球芯
        return (
          <div className={styles.normal}>
            <div className={styles.normal1}></div>
            <Link to={link}>
              <div className={styles.normal2}>
                <header>
                  <span className={styles.order_id}>订单号:{order.id}</span>
                  <span className={styles.pay_status}>已取消</span>
                </header>
                <OrderProduct order={order}/>
                <section className={styles.product_text}>共{order.orderdetails.length}件商品，实付款:<span className={styles.price_style}>{order.payable_amount}元</span>
                </section>
                <footer className={styles.orderbutton}>
                </footer>
                <aside className={styles.aside_bg}>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                </aside>
              </div>
            </Link>
          </div>

        )
      }
      if ( productInfo && productInfo.categoryid == 3 ) { //全球通话时长
        return (
          <div className={styles.normal}>
            <div className={styles.normal1}></div>
            <Link to={link}>
              <div className={styles.normal2}>
                <header>
                  <span className={styles.order_id}>订单号:{order.id}</span>
                  <span className={styles.pay_status}>已取消</span>
                </header>
                <OrderProduct order={order}/>
                <section className={styles.product_text}>共{order.orderdetails.length}件商品，实付款:<span className={styles.price_style}>{order.payable_amount}元</span>
                </section>
                <footer className={styles.orderbutton}>
                </footer>
                <aside className={styles.aside_bg}>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                </aside>
              </div>
            </Link>
          </div>

        )
      }
      if ( productInfo && productInfo.categoryid == 6 ) { //络漫宝
        return (
          <div className={styles.normal}>
            <div className={styles.normal1}></div>
            <Link to={link}>
              <div className={styles.normal2}>
                <header>
                  <span className={styles.order_id}>订单号:{order.id}</span>
                  <span className={styles.pay_status}>已取消</span>
                </header>
                <OrderProduct order={order}/>
                <section className={styles.product_text}>共{order.orderdetails.length}件商品，实付款:<span className={styles.price_style}>{order.payable_amount}元</span>
                </section>
                <footer className={styles.orderbutton}>
                </footer>
                <aside className={styles.aside_bg}>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                </aside>
              </div>
            </Link>
          </div>
        )
      }
      if ( productInfo && productInfo.categoryid == 2 ) { //全球上网流量
        return (
          <div className={styles.normal}>
            <div className={styles.normal1}></div>
            <Link to={link}>
              <div className={styles.normal2}>
                <header>
                  <span className={styles.order_id}>订单号:{order.id}</span>
                  <span className={styles.pay_status}>已取消</span>
                </header>
                <OrderProduct order={order}/>
                <section className={styles.product_text}>共{order.orderdetails.length}件商品，实付款:<span className={styles.price_style}>{order.payable_amount}元</span>
                </section>
                <footer className={styles.orderbutton}>
                </footer>
                <aside className={styles.aside_bg}>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                  <i className={styles.circle}></i>
                </aside>
              </div>
            </Link>
          </div>
        )
      }
    };
    if(order_status == 2){
      return orderJudgeCancel();
    }
    if(order.pay_status == 2) {//已付款
      return orderJudgeSuccess();
    }
    else {  //未付款
      return orderJudgeFail();
    }
  }
}

// export default class OrderItem extends Component{ //有default,默认导出，不用再引用时加{}
//   constructor(props) {
//     super(props);
//     const {order}= props;
//     var map = productsCache() || {};
//     var productId = order.orderdetails[0].productid;
//     var starttime = order.orderdetails[0].effect_datetime;
//     var endtime = order.orderdetails[0].failure_datetime;
//     if(starttime || endtime) {
//       var start = starttime.split(/\s/g)[0];
//       var end = endtime.split(/\s/g)[0];
//     }
//     var productInfo = map[productId];
//     var link = `/order-details/${order.id}`;
//     this.state = {
//       order,
//       start,
//       end,
//       link,
//       productInfo
//     };
//     this.__scrollLoadId = null;
//   }
//
//   componentDidMount() {
//     if (!this._scrollLoad) {
//       this._scrollLoad = ()=> {
//         this.__scrollLoadId && clearTimeout(this.__scrollLoadId);
//         this.__scrollLoadId = setTimeout(()=> {
//           if (this.refs.element && window.scrollY + window.innerHeight * 1.5> this.refs.element.clientHeight * 10) {
//             // yield call(getMyOrderList, {pageIndex : 1, pageSize : 10} )
//             getMyOrderList({pageIndex : 1, pageSize : 10}).then(data=>{
//               console.log(data);
//               for (let i = 0; i < 10; i++) {
//                 var map = productsCache() || {};
//                 var order = data.data.orders[i];
//                 var productId = order.orderdetails[0].productid;
//                 var starttime = order.orderdetails[0].effect_datetime;
//                 var endtime = order.orderdetails[0].failure_datetime;
//                 if(starttime || endtime) {
//                   var start = starttime.split(/\s/g)[0];
//                   var end = endtime.split(/\s/g)[0];
//                 }
//                 var productInfo = map[productId];
//                 var link = `/order-details/${order.id}`;
//                 this.state = {
//                   order,
//                   start,
//                   end,
//                   link,
//                   productInfo
//                 };
//                 this.__scrollLoadId = null;
//                 this.setState({order: this.state.order});
//                 if(i==9){
//                   break;
//                 }
//               }
//             });
//           }
//         }, 300);
//       };
//       window.addEventListener('scroll', this._scrollLoad);
//     }
//   }
//
//   componentWillUnmount() {
//     this._scrollLoad && window.removeEventListener('scroll', this._scrollLoad);
//     delete this._scrollLoad;
//   }
//
//   render() {
//     const {order, start, end, link, productInfo} = this.state;
//     var orderJudgeSuccess = function (){
//       if ( productInfo && productInfo.categoryid == 4) { //年套餐，月套餐, 自定义套餐
//         return (
//           <div className={styles.normal}>
//             <div className={styles.normal1}></div>
//             <Link to={link}>
//               <div className={styles.normal2}>
//                 <header>
//                   <span className={styles.order_id}>订单号:{order.id}</span>
//                   <span className={styles.pay_status}>交易完成</span>
//                 </header>
//                 <OrderProduct order={order}/>
//                 <section className={styles.product_text}>共{order.orderdetails.length}件商品，实付款:<span className={styles.price_style}>{order.payable_amount}元</span>
//                 </section>
//                 <footer className={styles.orderbutton}>
//                 </footer>
//                 <aside className={styles.aside_bg}>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                 </aside>
//               </div>
//             </Link>
//           </div>
//
//         )
//       }if ( productInfo && productInfo.categoryid == 5) { //多国单次卡
//         return (
//           <div className={styles.normal}>
//             <div className={styles.normal1}></div>
//             <Link to={link}>
//               <div className={styles.normal2}>
//                 <header>
//                   <span className={styles.order_id}>订单号:{order.id}</span>
//                   <span className={styles.pay_status}>交易完成</span>
//                 </header>
//                 <OrderProduct order={order}/>
//                 <section className={styles.product_text}>共{order.orderdetails.length}件商品，实付款:<span className={styles.price_style}>{order.payable_amount}元</span>
//                 </section>
//                 <footer className={styles.orderbutton}>
//
//                 </footer>
//                 <aside className={styles.aside_bg}>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                 </aside>
//               </div>
//             </Link>
//           </div>
//
//         )
//       }if ( productInfo && productInfo.categoryid == 1) { //络漫全球芯
//         return (
//           <div className={styles.normal}>
//             <div className={styles.normal1}></div>
//             <Link to={link}>
//               <div className={styles.normal2}>
//                 <header>
//                   <span className={styles.order_id}>订单号:{order.id}</span>
//                   <span className={styles.pay_status}>交易完成</span>
//                 </header>
//                 <OrderProduct order={order}/>
//                 <section className={styles.product_text}>共{order.orderdetails.length}件商品，实付款:<span className={styles.price_style}>{order.payable_amount}元</span>
//                 </section>
//                 <footer className={styles.orderbutton}>
//                 </footer>
//                 <aside className={styles.aside_bg}>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                 </aside>
//               </div>
//             </Link>
//           </div>
//
//         )
//       }if ( productInfo && productInfo.categoryid == 3 ) { //全球通话时长
//         return (
//           <div className={styles.normal}>
//             <div className={styles.normal1}></div>
//             <Link to={link}>
//               <div className={styles.normal2}>
//                 <header>
//                   <span className={styles.order_id}>订单号:{order.id}</span>
//                   <span className={styles.pay_status}>交易完成</span>
//                 </header>
//                 <OrderProduct order={order}/>
//                 <section className={styles.product_text}>共{order.orderdetails.length}件商品，实付款:<span className={styles.price_style}>{order.payable_amount}元</span>
//                 </section>
//                 <footer className={styles.orderbutton}>
//                 </footer>
//                 <aside className={styles.aside_bg}>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                 </aside>
//               </div>
//             </Link>
//           </div>
//
//         )
//       }if ( productInfo && productInfo.categoryid == 6 ) { //络漫宝
//         return (
//           <div className={styles.normal}>
//             <div className={styles.normal1}></div>
//             <Link to={link}>
//               <div className={styles.normal2}>
//                 <header>
//                   <span className={styles.order_id}>订单号:{order.id}</span>
//                   <span className={styles.pay_status}>交易完成</span>
//                 </header>
//                 <OrderProduct order={order}/>
//                 <section className={styles.product_text}>共{order.orderdetails.length}件商品，实付款:<span className={styles.price_style}>{order.payable_amount}元</span>
//                 </section>
//                 <footer className={styles.orderbutton}>
//                 </footer>
//                 <aside className={styles.aside_bg}>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                 </aside>
//               </div>
//             </Link>
//           </div>
//         )
//       }if ( productInfo && productInfo.categoryid == 2 ) { //全球上网流量
//         return (
//           <div className={styles.normal}>
//             <div className={styles.normal1}></div>
//             <Link to={link}>
//               <div className={styles.normal2}>
//                 <header>
//                   <span className={styles.order_id}>订单号:{order.id}</span>
//                   <span className={styles.pay_status}>交易完成</span>
//                 </header>
//                 <OrderProduct order={order}/>
//                 <section className={styles.product_text}>共{order.orderdetails.length}件商品，实付款:<span className={styles.price_style}>{order.payable_amount}元</span>
//                 </section>
//                 <footer className={styles.orderbutton}>
//                 </footer>
//                 <aside className={styles.aside_bg}>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                 </aside>
//               </div>
//             </Link>
//           </div>
//         )
//       }
//     };
//     var orderJudgeFail = function (){
//       if ( productInfo && productInfo.categoryid == 4) { //年套餐，月套餐, 自定义套餐
//         return (
//           <div className={styles.normal}  ref="element">
//             <div className={styles.normal1}></div>
//             <Link to={link}>
//               <div className={styles.normal2}>
//                 <header>
//                   <span className={styles.order_id}>订单号:{order.id}</span>
//                   <span className={styles.pay_status}>未支付</span>
//                 </header>
//                 <OrderProduct order={order}/>
//                 <section className={styles.product_text}>共{order.orderdetails.length}件商品，实付款:<span className={styles.price_style}>{order.payable_amount}元</span>
//                 </section>
//                 <footer className={styles.orderbutton}>
//                 </footer>
//                 <aside className={styles.aside_bg}>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                 </aside>
//               </div>
//             </Link>
//             <Button className={styles.orderpayment}>去支付</Button>
//             <Button className={styles.ordercancel} id="ordercancel">取消订单</Button>
//           </div>
//
//         )
//       }
//       if ( productInfo && productInfo.categoryid == 5) { //多国单次卡
//         return (
//           <div className={styles.normal}  ref="element">
//             <div className={styles.normal1}></div>
//             <Link to={link}>
//               <div className={styles.normal2}>
//                 <header>
//                   <span className={styles.order_id}>订单号:{order.id}</span>
//                   <span className={styles.pay_status}>未支付</span>
//                 </header>
//                 <OrderProduct order={order}/>
//                 <section className={styles.product_text}>共{order.orderdetails.length}件商品，实付款:<span className={styles.price_style}>{order.payable_amount}元</span>
//                 </section>
//                 <footer className={styles.orderbutton}>
//                 </footer>
//                 <aside className={styles.aside_bg}>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                 </aside>
//               </div>
//             </Link>
//             <Button className={styles.orderpayment}>去支付</Button>
//             <Button className={styles.ordercancel}>取消订单</Button>
//           </div>
//
//         )
//       }
//       if ( productInfo && productInfo.categoryid == 1) { //络漫全球芯
//         return (
//           <div className={styles.normal}  ref="element">
//             <div className={styles.normal1}></div>
//             <Link to={link}>
//               <div className={styles.normal2}>
//                 <header>
//                   <span className={styles.order_id}>订单号:{order.id}</span>
//                   <span className={styles.pay_status}>未支付</span>
//                 </header>
//                 <OrderProduct order={order}/>
//                 <section className={styles.product_text}>共{order.orderdetails.length}件商品，实付款:<span className={styles.price_style}>{order.payable_amount}元</span>
//                 </section>
//                 <footer className={styles.orderbutton}>
//                 </footer>
//                 <aside className={styles.aside_bg}>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                 </aside>
//               </div>
//             </Link>
//             <Button className={styles.orderpayment}>去支付</Button>
//             <Button className={styles.ordercancel}>取消订单</Button>
//           </div>
//
//         )
//       }
//       if ( productInfo && productInfo.categoryid == 3 ) { //全球通话时长
//         return (
//           <div className={styles.normal}  ref="element">
//             <div className={styles.normal1}></div>
//             <Link to={link}>
//               <div className={styles.normal2}>
//                 <header>
//                   <span className={styles.order_id}>订单号:{order.id}</span>
//                   <span className={styles.pay_status}>未支付</span>
//                 </header>
//                 <OrderProduct order={order}/>
//                 <section className={styles.product_text}>共{order.orderdetails.length}件商品，实付款:<span className={styles.price_style}>{order.payable_amount}元</span>
//                 </section>
//                 <footer className={styles.orderbutton}>
//                 </footer>
//                 <aside className={styles.aside_bg}>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                 </aside>
//               </div>
//             </Link>
//             <Button className={styles.orderpayment}>去支付</Button>
//             <Button className={styles.ordercancel}>取消订单</Button>
//           </div>
//
//         )
//       }
//       if ( productInfo && productInfo.categoryid == 6 ) { //络漫宝
//         return (
//           <div className={styles.normal}  ref="element">
//             <div className={styles.normal1}></div>
//             <Link to={link}>
//               <div className={styles.normal2}>
//                 <header>
//                   <span className={styles.order_id}>订单号:{order.id}</span>
//                   <span className={styles.pay_status}>未支付</span>
//                 </header>
//                 <OrderProduct order={order}/>
//                 <section className={styles.product_text}>共{order.orderdetails.length}件商品，实付款:<span className={styles.price_style}>{order.payable_amount}元</span>
//                 </section>
//                 <footer className={styles.orderbutton}>
//                 </footer>
//                 <aside className={styles.aside_bg}>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                 </aside>
//               </div>
//             </Link>
//             <Button className={styles.orderpayment}>去支付</Button>
//             <Button className={styles.ordercancel}>取消订单</Button>
//           </div>
//         )
//       }
//       if ( productInfo && productInfo.categoryid == 2 ) { //全球上网流量
//         return (
//           <div className={styles.normal}  ref="element">
//             <div className={styles.normal1}></div>
//             <Link to={link}>
//               <div className={styles.normal2}>
//                 <header>
//                   <span className={styles.order_id}>订单号:{order.id}</span>
//                   <span className={styles.pay_status}>未支付</span>
//                 </header>
//                 <OrderProduct order={order}/>
//                 <section className={styles.product_text}>共{order.orderdetails.length}件商品，实付款:<span className={styles.price_style}>{order.payable_amount}元</span>
//                 </section>
//                 <footer className={styles.orderbutton}>
//                 </footer>
//                 <aside className={styles.aside_bg}>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                   <i className={styles.circle}></i>
//                 </aside>
//               </div>
//             </Link>
//             <Button className={styles.orderpayment}>去支付</Button>
//             <Button className={styles.ordercancel}>取消订单</Button>
//           </div>
//         )
//       }
//     };
//     if(order.pay_status == 2) {//已付款
//       return orderJudgeSuccess();
//     }
//     else {  //未付款
//       return orderJudgeFail();
//     }
//   }
// }




