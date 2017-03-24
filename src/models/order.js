import {
  submitOrder,
  setOrderDetail,
  shippingOrder,
  getsAvailEvoucher,
  discountEvoucher,
  orderConfirm,
  orderPayInSDK,
  getMyOrderList
} from '../services';

import {Toast} from 'antd-mobile';
import {format} from '../utils/date';
import effect, {loading, failed} from './effect';


export default {

  namespace: 'order',

  state: {
    loading: true,    // 加载状态
    tmp: {},          // 临时数据存储
    recent: {},       // 最近的订单， 进入产品详情页面时会创建一个新的订单
    myevoucher: null, // 订单使用的优惠劵
    evouchers: null,   // 用户拥有的所有优惠劵
    confirmed: false,  // 使用代金券后支付成功
    map: {},           // 订单详情缓存
  },

  subscriptions: {
    setup({dispatch, history}) {
      history.listen(location => {
        if (location.pathname === '/') {
          dispatch({
            type: 'clear'
          });
        } else if (location.pathname === '/order-list') {
          dispatch({type: 'fetchOrderList'})
        }
      });
    }
  },

  effects: {
    /**
     * 存储临时数据，当数据满足一定条件时创建订单或修改订单详情
     * @param payload 当前传递的数据
     * @param saga saga对象
     */
      *tmp({payload}, saga) {
      var sendData, err, result;
      var state = yield saga.select(state=>state.order);
      var order = state.recent;
      var tmp = state.tmp;
      var myevoucher = state.myevoucher;
      var evouchers = state.evouchers;
      var detail = order && order.orderdetails && order.orderdetails[0] || {};

      // if(payload.productid && tmp.productid && payload.productid != tmp.productid){
      //   // 如果更换了商品ID
      //   tmp = {...payload};
      // }else {
      // 合并原有临时数据与当前的数据
      tmp = {...tmp, ...payload};
      // }

      /**
       * 更新订单的收件信息
       */
      function* updateShippingAddress() {
        // 如果产品ID为1(全球上网卡)5(上网流量+全球上网卡)
        // 且 有临时的收件地址ID
        // 且 临时地址ID与订单的收件地址ID
        if ((tmp.productid == 1 || tmp.productid == 5 || tmp.productid == 10 || tmp.productid == 11) && tmp.shipping_address && (tmp.shipping_address != order.ship_address)) {
          result = yield saga.call(shippingOrder, {
            orderid: order.id, // 订单ID
            shipping_address: tmp.shipping_address, // 收件地址ID
            shipping_id: 1     // 1为顺丰快递
          });
          if (result.data && result.data.order) {
            //合并订单信息
            order = {...order, ...result.data.order};
          } else {
            err = result.err;
            err && Toast.fail(err.message || '失败'); // 显示错误信息
          }
        }
      }

      /**
       * 获取所有可用的电子优惠劵
       */
      function* fetchAvailEvoucher() {
        result = yield saga.call(getsAvailEvoucher, order.id);
        if (result.data && result.data.evouchers) {
          evouchers = result.data.evouchers;
        } else {
          evouchers = null;
          err = result.err;
          err && Toast.fail(err.message || '失败');   // 显示错误信息
        }
      }

      /**
       * 修改订单详情
       */
      function* updateDetail() {
        var updateFlag = 0;  // 检查更新项项目标志
        sendData = {
          productid: detail.productid,
          orderdetailid: detail.id,
          quantity: detail.quantity,
          call_duration: detail.call_duration,
          areaname: detail.areaname,
          effect_datetime: detail.effect_datetime,
          failure_datetime: detail.failure_datetime,
          genevoucher: (()=> {
            var attr = detail.odprdattrs && detail.odprdattrs.find(attr=>attr.varname == 'genevoucher');
            return attr && attr.value === 'true' || undefined;
          })(),
          simid: detail.simids[0],
        };
        var productid = tmp.productid;
        // 产品ID=1，5，（2 && 生成电子劵），10，11，支持修改数量
        // 由于后台修改订单详情接口未返回端口数量，所以每次重置数量
        if ((productid == 1 || productid == 5 || (productid == 2 && tmp.genevoucher) || productid == 10 || productid == 11) && (payload.quantity != sendData.quantity)) {
          sendData.quantity = payload.quantity || 1;
          updateFlag++;
        }
        // 产品3 支持修改时长
        if (productid == 3 && payload.call_duration != sendData.call_duration) {
          sendData.call_duration = payload.call_duration;
          updateFlag++;
        }
        // 产品2，5，10 支持修改国家地区
        if ((productid == 2 || productid == 5 || productid == 10) && payload.country) {
          if (payload.country.value != sendData.areaname) {
            sendData.areaname = payload.country.value;
            updateFlag++;
          }
        }
        // 产品2，5，6，10支持修改使用时间
        if ((productid == 2 || productid == 5 || productid == 6 || productid == 10) && payload.start && payload.end) {
          var {effect_datetime, failure_datetime} = useDateToEffectFailure(payload);
          if (effect_datetime != sendData.effect_datetime || failure_datetime != sendData.failure_datetime) {
            sendData.effect_datetime = effect_datetime;
            sendData.failure_datetime = failure_datetime;
            updateFlag++;
          }
        }
        // 产品2支持是否生成电子劵
        if (productid == 2 && (typeof payload.genevoucher !== 'undefined')) { //&& (payload.genevoucher != sendData.genevoucher)
          sendData.genevoucher = payload.genevoucher;
          if(sendData.genevoucher){ //如果是电子劵，则删除卡号
            delete sendData.simid;
          }
          updateFlag++;
        }
        // 产品2支持修改simid
        if (productid == 2 && !sendData.genevoucher) {
          if(tmp.simid){
            if(tmp.simid != sendData.simid){
              sendData.simid = tmp.simid;
              updateFlag++;
            }
          }else{
            updateFlag = false;
          }
        }
        if (updateFlag) {
          // 更新订单详情
          result = yield saga.call(setOrderDetail, sendData);
          if (result.data && result.data.order) {
            // 赋值新的订单信息
            order = result.data.order;
            if (order && order.id) {
              // 获取优惠券
              yield saga.call(fetchAvailEvoucher);
              // 重置已经使用的优惠劵
              myevoucher = null;
            }
          } else {
            err = result.err;
            err && (Toast.fail(err.message || '失败'), console.error(err));  // 显示错误信息
          }
        }
        //是否需要设置收货地址
        yield saga.call(updateShippingAddress);
      }

      function* createOrder() {
        //根据不同产品ID，创建订单的必要条件是不一样的
        var {effect_datetime, failure_datetime} = useDateToEffectFailure(tmp);
        var {country, genevoucher, quantity = 1, simid} = tmp;
        var areaname = country && country.value;
        var start = new Date();
        var end;
        switch (tmp.productid + '') {
          case '1': // 全球上网卡
            sendData = {
              productid: 1,
              quantity: tmp.quantity || 1,
            };
            break;
          case '2': // 上网流量
            //起始时间，结束时间，国家地区，电子劵或卡号
            if (effect_datetime && failure_datetime && areaname && (genevoucher || simid)) {
              sendData = {
                effect_datetime,
                failure_datetime,
                quantity: (genevoucher ? quantity : 1),
                areaname,
                genevoucher,
                simid: (genevoucher ? '' : simid),
                productid: 2,
              };
            }
            break;
          case '3': // 通话时长
            sendData = {
              productid: 3,
              quantity: 1,
              call_duration: tmp.call_duration || 60
            };
            break;
          case '5': // 上网流量 + 全球上网卡
            //起始时间，结束时间，国家地区，电子劵或卡号
            if (effect_datetime && failure_datetime && areaname) {
              sendData = {
                effect_datetime,
                failure_datetime,
                quantity,
                areaname,
                productid: 5,
              };
            }
            break;
          case '6': // 专属卡号-自定义套餐
            if (effect_datetime && failure_datetime) {
              sendData = {
                productid: 6,
                quantity: 1,
                effect_datetime,
                failure_datetime
              }
            }
            break;
          case '8': // 专属卡号-月套餐
            end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 29, 23, 59, 59);
            sendData = {
              productid: 8,
              quantity: 1,
              effect_datetime: format(start, true),
              failure_datetime: format(end, true)
            };
            break;
          case '9': // 专属卡号-年套餐
            end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 364, 23, 59, 59);
            sendData = {
              productid: 9,
              quantity: 1,
              effect_datetime: format(start, true),
              failure_datetime: format(end, true)
            };
            break;
          case '10':    // 单次上网卡
            if (effect_datetime && failure_datetime && areaname) {
              sendData = {
                productid:10,
                areaname,
                effect_datetime,
                failure_datetime,
                quantity,
              };
            }
            break;
          case '11': // 络漫宝
            sendData = {
              productid: 11,
              quantity,
            };
            break;
        }
        if (sendData) {
          yield saga.put({type: 'loading'});
          result = yield saga.call(submitOrder, sendData);
          if (result.data && result.data.order) {
            order = result.data && result.data.order;
            if (order && order.id) {
              //订单创建成功
              //获取优惠券
              yield saga.call(fetchAvailEvoucher);
              myevoucher = null;
              //是否需要设置收货地址
              yield saga.call(updateShippingAddress);
            }
          } else {
            err = result.err;
            err && (Toast.fail(err.message || '失败'), console.error(err));
          }
        } else {
          order = null;
          evouchers = null;
          myevoucher = null;
        }
      }

      // 如果存在订单，存在订单详情，
      // 且订单详情与临时数据中的产品ID一致
      // 则修改订单详情
      if (order && order.id && detail && detail.productid == tmp.productid) {
        yield saga.call(updateDetail);
      } else {
        //创建订单
        yield  saga.call(createOrder);
      }
      //将最终状态put到state中
      yield saga.put({
        type: 'result',
        payload: {
          tmp,
          recent: order,
          evouchers,
          myevoucher
        }
      });
    },
    /**
     * 使用优惠劵
     */
    discountEvoucher: effect(discountEvoucher, 'discountEvoucherSuccess'),

    orderConfirm: effect(orderConfirm, 'orderConfirmSuccess'),

    fetchOrderList: effect(getMyOrderList, 'fetchOrderListSuccess'),
    payInSDK: effect(orderPayInSDK, 'getSDKPayParamsSuccess'),
  },

  reducers: {
    /**
     * 清理状态
     * @param state
     * @returns {{tmp: {}, recent: {}, myevoucher: null, evouchers: null}}
     */
    clear(state){
      return {...state, tmp: {}, recent: {}, products: {}, myevoucher: null, evouchers: null, confirmed: false};
    },
    /**
     * 加载状态
     * @param state
     * @returns {{loading: boolean}}
     */
    loading,
    /**
     * 失败状态处理
     * @param state
     * @param action
     * @returns {{loading: boolean, err: (*|Error)}}
     */
    failed(state, action){
      if (action.err.code == 1304) {
        //数据卡已绑定该时间段的套餐
        delete state.tmp.start;
        delete state.tmp.end;
        state.tmp = {...state.tmp};
      }
      return {...state, loading: false, err: action.err};
    },
    /**
     * tmp后的最终结果状态
     * @param state
     * @param action
     * @returns {{loading: boolean}}
     */
    result(state, action){
      return {...state, ...action.payload, loading: false};
    },
    /**
     * 使用优惠劵成功的状态
     * @param state
     * @param action
     * @returns {{recent: {}, myevoucher: *, loading: boolean}}
     */
    discountEvoucherSuccess(state, action){
      return {
        ...state,
        recent: {...state.recent, ...action.result.order},
        myevoucher: (action.payload.evoucherid == 0 && state.evouchers && state.evouchers.length) ? null : state.evouchers.find(e=>e.id == action.payload.evoucherid), // action.result.myevoucher,
        loading: false
      };
    },
    orderConfirmSuccess(state, action) {
      return {
        ...state,
        confirmed: true
      };
    },
    /**
     * 直接保存临时数据，不触发修改订单或创建订单
     * @param state
     * @param action
     * @returns {{tmp: {}}}
     */
    keepTmp(state, action){
      return {...state, tmp: {...state.tmp, ...action.payload}};
    },
    /**
     * 获取SDK的支付方式成功后回调
     * @param state
     * @param action
     * @returns {{}}
     */
    getSDKPayParamsSuccess(state, action) {
      document.write(action.result.payparams);
      return {...state};
    },

  fetchOrderListSuccess(state, action){
      var map = state.map;
      var orders = action.result.orders;
      for (var i = 0; i < orders.length; i++) {
        var order = orders[i];
        map[order.id] = order;
      }
      return {...state, map, orders};
    },
  },
}

/**
 * 将开始时间结束时间转换成生效时间与失效时间
 * @param start
 * @param end
 * @returns {{}}
 */
function useDateToEffectFailure({start, end}) {
  const ret = {};
  if (start) {
    ret.effect_datetime = format(start, true);
  }
  if (end) {
    ret.failure_datetime = format(new Date(end.getTime() + 86399999), true);
  }
  return ret;
}
