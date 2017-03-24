import request from '../utils/request';
import userRequest from '../utils/userRequest';
import {loginInfoCache} from '../utils/storage';

// var GET_CHECK_CODE = '/uc/services/checkcode_get';

var GETS_ADDRESS = '/uc/services/address_gets';
var SET_ADDRESS = '/uc/services/address_set';
var DELETE_ADDRESS = '/uc/services/address_delete';
var GETS_CITY = '/uc/services/city_gets';

// var GET_TRAFFIC_VOICE = '/uc/services/trafficvoice_get'; //用户当前可用流量语音套餐
// var GET_ALL_TRAFFIC_VOICE = '/uc/services/alltrafficvoice_get';
// var GET_VOICE_AVAILABLE = '/uc/services/voiceavailable_get';

// var GETS_PRODUCT_CATEGORY = '/uc/services/prdcategory_gets'; //产品类目
var GETS_PRODUCT = '/uc/services/product_gets';
// var GETS_PRODUCT_UNIT_PRICE = '/uc/services/prdunitprice_gets';

// var GTES_CART = '/uc/services/cart_gets';
// var SET_CART = '/uc/services/cart_set';
// var DELETE_CART = '/uc/services/cart_delete';

// var GETS_PAYMENT = '/uc/services/payment_gets';

var SUBMIT_ORDET = '/uc/services/order_submit';
var SHIPPING_ORDER = '/uc/services/order_shipping';
var PAYING_ORDER = '/uc/services/order_paying';
// var GETS_ORDER = '/uc/services/order_gets';
// var CANCEL_ORDER = '/uc/services/order_cancel';
var SET_ORDER_DETAIL = '/uc/services/orderdetail_set';

var BIND_DATA_CARD = '/uc/services/datacard_bind';
var GETS_DATA_CARD = '/uc/services/datacard_gets';

var GETS_AVAIL_EVOUCHER = '/uc/services/availevoucher_gets';   //获取优惠券列表
var DISCOUNT_EVOUCHER = '/uc/services/evoucher_discount';      //使用优惠券
var ORDER_CONFIRM = '/uc/services/order_confirm';             // 确认订单

// var GETS_OUTLET = '/uc/services/outlet_gets';

var GETS_HOMEPAGE = '/uc/services/homepage_gets'; //首页配置

var GETS_MY_ORDERLIST = '/uc/services/order_gets';

var ORDER_CANCEL = '/uc/services/order_cancel';

export async function orderCancel(orderid) {
  return userRequest(ORDER_CANCEL,{data:{orderid:orderid}})
}

export async function getMyOrderList({pageIndex = 0, pageSize = 10} = {}) {
  return userRequest(GETS_MY_ORDERLIST, {data: {
    pageindex: pageIndex,
    pagesize: pageSize
  }});
}

export async function getsHomePage() {
  var ua = navigator.userAgent.toLowerCase();
  var inWeixin = /micromessenger\/(\d+\.\d+\.\d+)/.test(ua);
  var type = 2;
  if (inWeixin) {
    type = 3;
  }
  return request(GETS_HOMEPAGE, {data: {type}});
}

/**
 * 登录
 * @param username
 * @param password
 */
export async function login({username, password}) { // 15802775358/123456
  return loginSync({username, password});
}

export function loginSync({username, password}) {
  var LOGIN = '/uc/services/login';
  return request(LOGIN, {data: {username, password}});
}

/**
 * 获取验证码
 * @param phone
 */
// export async function getCheckCode(phone) {
//   return request(GET_CHECK_CODE, {data: {phone}});
// }
/**
 * 获取邮寄地址
 */
export async function getsAddress() {
  return userRequest(GETS_ADDRESS);
}
/**
 * 设置邮寄地址
 * @param data
 */
export async function setAddress(data = {
  /* consignee, country, mobile, zipcode, address, province, city, district, defaultaddr */
}) {
  return userRequest(SET_ADDRESS, {data});
}
/**
 * 删除邮寄地址
 * @param addrid
 */
export async function deleteAddress({addrid}) {
  return userRequest(DELETE_ADDRESS, {data: {addrid}});
}
/**
 * 获取省市区
 * @param pid
 */
export async function getsCity({pid = 1}) {
  return request(GETS_CITY, {data: {pid}, method: 'GET'});
}

// export async function getTrafficVoice() {
//   return request(GET_TRAFFIC_VOICE);
// }

// export async function getAllTrafficVoice() {
//   return request(GET_ALL_TRAFFIC_VOICE);
// }

// export async function getVoiceAvailable() {
//   return request(GET_VOICE_AVAILABLE);
// }
/**
 * 获取产品类目
 */
// export async function getsProductCategory() {
//   return request(GETS_PRODUCT_CATEGORY)
// }
/**
 * 获取产品
 * @param data
 */
export async function getsProduct(data = {
  //productids || categoryid || null
}) {
  return request(GETS_PRODUCT, {data, method: 'GET'});
}
/**
 * 根据产品ID获取产品
 * @param productids
 */
export async function getsProductById(productids) {
  return request(GETS_PRODUCT, {data: {productids}, method: 'GET'});
}
/**
 * 根据产品类目ID获取产品
 * @param categoryid
 */
export async function getsProductByCategoryId(categoryid) {
  return request(GETS_PRODUCT, {data: {categoryid}, method: 'GET'});
}
/**
 * 获取产品单价
 * @param productid
 */
// export async function getsProductUnitPrice(productid = 1) {
//   return request(GETS_PRODUCT_UNIT_PRICE, {data: {productid}});
// }
/**
 * 获取购物车
 */
// export async function getsCart() {
//   return request(GTES_CART);
// }
/**
 * 设置购物车
 * @param data
 */
// export async function setCart(data = {
//   /* productid, quantity, effect_datetime, failure_datetime, simid, areaname, genevoucher, call_duration*/
// }) {
//   return request(SET_CART, {data});
// }
/**
 * 删除购物车
 * @param cartids
 */
// export async function deleteCart(cartids) {
//   return request(DELETE_CART, {data: {cartids}});
// }
/**
 * 获取支付方式
 */
// export async function getsPayment() {
//   return request(GETS_PAYMENT);
// }
/**
 * 提交订单
 * @param data
 */
export async function submitOrder(data = {
  /*productid, quantity, effect_datetime, failure_datetime, call_duration*/
  /*cart*/
  /*cartids*/
}) {
  return userRequest(SUBMIT_ORDET, {data});
}
/**
 * 根据购物车提交订单
 * @param cart
 */
// export async function submitOrderByCart(cart) {
//   return request(SUBMIT_ORDET, {data: {cart}});
// }
/**
 * 根据部分购物车数据提交订单
 * @param cartids
 */
// export async function submitOrderByCartIds(cartids) {
//   return request(SUBMIT_ORDET, {data: {cartids}});
// }

/**
 * 设置订单的收件地址
 * @param data
 * @returns {*}
 */
export async function shippingOrder(data = {
  /*orderid, shipping_address, shipping_id, obtainvoucher, outletid, obtaintime*/
  /*orderid, shipping_address, shipping_id, obtainvoucher*/
}) {
  return userRequest(SHIPPING_ORDER, {data});
}
/**
 * 支付订单，[已过时，由APP提供接口]
 * @param orderid
 * @param payid
 */
// export async function payingOrder({orderid, payid}) {
//   return request(PAYING_ORDER, {data: {orderid, payid}});
// }
/**
 * 获取订单
 */
// export async function getsOrder() {
//   return request(GETS_ORDER);
// }
/**
 * 取消订单
 * @param orderid
 * @param is_delete
 */
// export async function cancelOrder({orderid, is_delete = true}) {
//   return request(CANCEL_ORDER, {data: {orderid, is_delete}});
// }
/**
 * 设置订单详情
 * @param data
 */
export async function setOrderDetail(data = {
  /*orderdetailid, productid, quantity, areaname, effect_datetime, failure_datetime, genevoucher*/
}) {
  return userRequest(SET_ORDER_DETAIL, {data});
}
/**
 * 绑定数据卡
 * @param datacardid
 */
export async function bindDataCard({datacardid}) {

  return userRequest(BIND_DATA_CARD, {data: {datacardid}});
}
/**
 * 获取数据卡
 */
export async function getsDataCard() {
  return userRequest(GETS_DATA_CARD);
}
/**
 * 获取优惠劵
 * @param orderid
 * @returns {Object}
 */
export async function getsAvailEvoucher(orderid) {
  return userRequest(GETS_AVAIL_EVOUCHER, {data: {orderid}});
}
/**
 * 使用优惠劵
 * @param orderid
 * @param evoucherid
 * @returns {Object}
 */
export async function discountEvoucher({orderid, evoucherid}) {
  return userRequest(DISCOUNT_EVOUCHER, {data: {orderid, evoucherid}});
}

export  async function orderConfirm({orderid}) {
  return userRequest(ORDER_CONFIRM, {data: {orderid}});
}
/**
 * 获取网点
 */
// export async function getsOutlet() {
//   return request(GETS_OUTLET);
// }

// 公众号登录
export function loginWithWxmp({code, state}) {
  var WXMP_LOGIN = '/uc/services/wxmp/token';
  return request(WXMP_LOGIN, {data: {code, state}});
}

export function orderPayingInWxmp(orderId) {
  return userRequest(PAYING_ORDER, {data: {
    orderid: orderId,
    payid: 5,
    trade_type: "JSAPI",
    openid: loginInfoCache().openid
  }});
}

export async function orderPayInSDK({orderid}) {
  return userRequest(PAYING_ORDER, {data: {
    orderid: orderid,
    payid: 4,
    trade_type: "SDK"
  }});
}
