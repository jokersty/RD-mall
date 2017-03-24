import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Button, List, Radio, Flex, ActivityIndicator, Popup, Toast, Tabs, Modal, WhiteSpace, WingBlank} from 'antd-mobile';
import PayAction from '../../components/PayAction/PayAction';
import Instructions from '../../components/Instructions/Instructions';
import DiscountPopup from  '../../components/DiscountPopup/DiscountPopup';
import Stepper from '../../components/Stepper/Stepper';
import {money} from '../../utils/function';
import Address from '../../components/Address/Address';
import {format} from '../../utils/date';
import Page from '../../components/Page/Page';
import native from '../../services/native';
import styles from './Item.less';
import {orderPayingInWxmp} from '../../services/index';
import {routerRedux} from 'dva/router';

@connect((state, {params})=> {
  var tmp = state.order.tmp || {};
  var address = (()=> {
    var {addresses} = state.address;
    var selectId = tmp.shipping_address;
    if (addresses && addresses.length) {
      return addresses.find(ad=>ad.id == selectId) || addresses.find(ad=>ad.defaultaddr) || addresses[0];
    }
  })();
  return {
    loading: state.product.loading,                  // 加载状态
    item: state.product.map[params.productid] || {}, // 产品
    order: state.order.recent || {},                 // 最近的订单
    tmp,                                             // 临时数据
    address,                                         // 收件地址
    datacards: state.card.datacards || [],           // 全球卡
    orderLoading: state.order.loading,               // 订单的加载状态
    evouchers: state.order.evouchers || [],          // 电子劵列表
    myevoucher: state.order.myevoucher,               // 订单使用的电子劵
    confirmed: state.order.confirmed                  // 订单使用代金券已确认
  }
})
export default class Item extends Component {

  static propTypes = {
    loading: PropTypes.bool,
    orderLoading: PropTypes.bool,
    products: PropTypes.object,   //产品
    address: PropTypes.object,    //收货地址
    order: PropTypes.object,      //订单
    tmp: PropTypes.object,        //订单临时数据
    datacards: PropTypes.array,   //数据卡
    evouchers: PropTypes.array,   //优惠劵
    myevoucher: PropTypes.object, //订单使用的优惠劵
  };

  /**
   * 组件的挂载后设置临时数据
   */
  componentWillMount() {
    var {item, tmp, address, datacards, params, location:{query}} = this.props;
    var productid = params.productid;
    if (params.productid == 2) {
      productid = tmp.package == 2 ? 5 : params.productid
    }
    // 仅允许支持数量的商品使用数量
    var quantity = ((productid == 1 || productid == 5 || (productid == 2 && tmp.genevoucher)) ? tmp.quantity : 1) || 1;
    if (tmp.productid && productid != tmp.productid) {
      quantity = 1;
      // console.log('由于产品ID不相同了，所以数量重置成1');
    }
    this.saveTmp({
      productid,
      quantity, //tmp.quantity || 1,
      shipping_address: address && address.id,
      simid: tmp.simid || (datacards[0] && datacards[0].iccid || ''),
      call_duration: tmp.call_duration || 60,
      area: item.area,
      start: tmp.start,
      end: tmp.end,
      country: tmp.country
    }, query.hidePay ? true : false);
  }

  /**
   * 保存临时数据
   **/
  saveTmp(payload, keep) {
    this.props.dispatch({
      type: keep ? 'order/keepTmp' : 'order/tmp',
      payload
    });
  }

  /**
   * 渲染组件
   **/
  render() {
    var {loading, item, order, tmp, address, datacards, evouchers, myevoucher, dispatch, history, confirmed} = this.props;

    // 如果产品为空，显示正在加载
    if (!item) {
      return (<Page title="正在加载..."><ActivityIndicator size="large" toast text="正在加载"/></Page>)
    }

    if (confirmed) {
      var detail = order && order.orderdetails && order.orderdetails[0] || {};
      var attr = detail.odprdattrs && detail.odprdattrs.find(attr=>attr.varname == 'genevoucher');
      var genevoucher = attr && attr.value === 'true';
      if (genevoucher) {
        history.push('/pay/success?go=coupon');
      } else {
        history.push('/pay/success');
      }
      // 支付成功后清理临时数据
      dispatch({
        type: 'order/clear'
      });
    }

    // 提交唤起APP支付
    var handleSubmit = ()=> {
      console.log(order);
      if(item && (item.is_real || tmp.package==2) && order && !order.ship_address) {
        Toast.fail('请填写收件地址！');
        return;
      }
      if (order.payable_amount > 0) {
        var ua = navigator.userAgent.toLowerCase();
        var inWeixin = /micromessenger\/(\d+.\d+.\d+)/.test(ua);
        var inSDK = /roamphonesdk\/(\S+\b)/.test(ua);
        if (inSDK) {
          dispatch({
            type: 'order/payInSDK',
            payload: {
              orderid: order.id,
            }
          })
        } else if (inWeixin) {
          history.push('/wxpay?orderId='+order.id);
        } else {
          native.goPayOrder(order.id, order.payable_amount, (response)=> {
            var detail = order && order.orderdetails && order.orderdetails[0] || {};
            var attr = detail.odprdattrs && detail.odprdattrs.find(attr=>attr.varname == 'genevoucher');
            var genevoucher = attr && attr.value === 'true';
            if (!response.error_no) {
              if (genevoucher) {
                history.push('/pay/success?go=coupon');
              } else {
                history.push('/pay/success');
              }
              // 支付成功后清理临时数据
              dispatch({
                type: 'order/clear'
              });
            } else {
              history.push('/pay/failed?amount=' + order.payable_amount + '&orderId=' + order.id + (genevoucher ? '&genevoucher=true' : ''));
              // 支付失败与取消支付后清理临时数据
              dispatch({
                type: 'order/clear'
              });
            }
          });
        }
      } else {
        const alert = Modal.alert;
        alert("确认", "确定要使用该代金券吗？", [
          {text: "取消", onPress:()=>{}, style: 'default'},
          {text: "确定", onPress:()=>{
            dispatch({
              type: 'order/orderConfirm',
              payload: {
                orderid: order.id,
              }
            });
          }, style: {fontWeight : 'bold'}},
        ]);

      }
    };

    // 渲染时长
    var renderDuration = ()=> {
      var {durationOptions} = item;
      return (
        durationOptions && durationOptions.length ?
          <List className={[styles.formItem, 'radio-left'].join(' ')}>
            {
              durationOptions.map(duration=>
                <Radio.RadioItem key={'duration-' + duration}
                                 checked={tmp.call_duration == duration}
                                 onChange={e=> {
                                   e.target.checked && this.saveTmp({
                                     call_duration: duration
                                   })
                                 }}>
                  <Flex>
                    <Flex.Item>{duration + '分钟'}</Flex.Item>
                    <Flex.Item className={styles.duration}
                               style={{textAlign: 'right'}}>{money(duration * item.unit_price * 100).join('.') + '元'}</Flex.Item>
                  </Flex>
                </Radio.RadioItem>
              )
            }
          </List>
          :
          null
      );
    };

    // 渲染选择国家地区
    var renderCountry = ()=> {
      var {country} = tmp;
      var handleClick = ()=> {
        dispatch({
          type: 'order/keepTmp',
          payload: {
            area: item.area
          }
        });
        history.push('/select-country')
      };
      return ( <Country onClick={handleClick} country={country}/>);
    };

    // 渲染产品使用时间
    var renderUseDate = ()=> {
      var {start, end} = tmp;
      return ( <UseDate start={start} end={end} history={history}/>);
    };

    // 渲染产品购买数量
    var renderQuantity = ()=> {
      var handleQuantiyChange = quantity => {
        clearTimeout(this.__setOrderDetail_sid);
        this.__setOrderDetail_sid = setTimeout(()=> {
          this.saveTmp({quantity});
        }, 300); // 使用延时处理，防止连续点击时出现连续调用
      };
      return (
        <List className={styles.formItem}>
          <List.Item extra={
            <Stepper showNumber size="small" max={999} min={1} defaultValue={tmp.quantity || 1}
                     onChange={handleQuantiyChange}/>
          }>购买数量</List.Item>
        </List>
      );
    };

    // 渲染收件地址
    var renderAddress = ()=> {
      return (
        <List className={styles.formItem}>
          <List.Item
            className={styles.address + ' address'}
            thumb={require('./images/location.png')}
            arrow="horizontal"
            onClick={()=>history.push(address ? ('/addresses?selectid=' + address.id) : '/addresses/add')}>
            <Address address={address}/>
          </List.Item>
        </List>
      );
    };

    var renderInstrAndDetailTab = () => {
      if (item.instructions && item.detail_image) {
        const TabPane = Tabs.TabPane;
        return (
          <Tabs animated={false}>
            <TabPane tab="使用说明" key="1">
              <div className={styles.instruction}>
                <div dangerouslySetInnerHTML={{__html: item.instructions}}/>
                {
                  (()=> {
                    switch (item.id + '') {
                      case '1':
                        return (<a onClick={()=> {
                          clearTimeout(this.__setApn_timeout);
                          this.__setApn_timeout = setTimeout(()=> {
                            native.setApn();
                          }, 500);
                        }}>[ 立即设置 ]</a>);
                      case '6':
                      case '8':
                      case '9':
                        return (<a onClick={()=>{
                          clearTimeout(this.__setApn_timeout);
                          this.__setApn_timeout = setTimeout(()=>{
                            native.setCallTransfer();
                          });
                        }}>[ 立即设置 ]</a> )
                    }
                  })()
                }
              </div>
            </TabPane>
            <TabPane tab="产品详情" key="2">
              {
                item.detail_image ?
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img style={{width: '100%'}} src={item.detail_image}/>
                  </div>
                  :
                  "暂无详情"
              }
            </TabPane>
          </Tabs>
        );
      } else if (item.instructions) {
        return (
          <Instructions>
            <div dangerouslySetInnerHTML={{__html: item.instructions}}/>
            {
              (()=> {
                switch (item.id + '') {
                  case '1':
                    return (<a onClick={()=> {
                      clearTimeout(this.__setApn_timeout);
                      this.__setApn_timeout = setTimeout(()=> {
                        native.setApn();
                      }, 500);
                    }}>[ 立即设置 ]</a>);
                  case '6':
                  case '8':
                  case '9':
                    return (<a onClick={()=>{
                      clearTimeout(this.__setApn_timeout);
                      this.__setApn_timeout = setTimeout(()=>{
                        native.setCallTransfer();
                      });
                    }}>[ 立即设置 ]</a> )
                }
              })()
            }
          </Instructions>
        );
      } else {
        return null;
      }
    };

    // 渲染套餐
    var renderPackage = ()=> {
      var handlePackageChange = index => {
        switch (index) {
          case 1:
            if (typeof tmp.package === 'undefined') {
              this.saveTmp({
                productid: 2,
                genevoucher: false,
                package: 1,
              });
              history.push('/my-card' + (datacards.length ? '' : '/add'));
            } else if (tmp.package != 1) {
              this.saveTmp({
                productid: 2,
                genevoucher: false,
                package: 1,
              });
            } else {
              //有卡进到我的全球卡页面
              //没有卡直接进添加卡页面
              history.push('/my-card' + (datacards.length ? '' : '/add'));
            }
            break;
          case 2:
            this.saveTmp({
              productid: 5,
              genevoucher: false,
              package: 2,
            });
            break;
          case 3:
            this.saveTmp({
              productid: 2,
              genevoucher: true,
              package: 3,
            });
            break;
        }
      };
      var simid = tmp.simid || (datacards && datacards[0] && datacards[0].iccid);
      return (
        <Package onChange={handlePackageChange} iccid={simid} check={tmp.package}/>
      );
    };

    // 使用或取消优惠劵
    var discountEvoucher = evoucher => {
      // console.log(evoucher);
      if (evoucher) {
        dispatch({
          type: 'order/discountEvoucher',
          payload: {
            orderid: evoucher.orderid || order.id,
            evoucherid: evoucher.id
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

    // 控制产品应该显示哪些组件
    var {input = {}} = item;

    return (
      <Page className={[styles.page, 'item-' + item.id].join(' ')} title={item.name}>
        <div className="item-icon">
          <img src={item.image}/>
        </div>

        <Flex className="item-info">
          <Flex.Item className="item-title">{item.name}</Flex.Item>
          <div className="item-price">{item.subname}</div>
        </Flex>
        <div className="item-desc">
          {item.description}
        </div>
        { input.duration && renderDuration() /* 通话时长 */ }
        {
          input.area || input.dateTime ?
            <List className={styles.formItem}>
              { input.area && renderCountry() /* 国家地区 */ }
              { input.dateTime && renderUseDate() /* 使用时间 */ }
            </List>
            :
            null
        }
        { input.package && renderPackage() /* 套餐 */ }
        { (input.quantity || (tmp.productid == 5 || tmp.productid == 1) || (tmp.productid == 2 && tmp.genevoucher)) && renderQuantity() /* 购买数量 */ }
        { (input.address || tmp.productid == 5 || tmp.productid == 1) && renderAddress() /* 收货地址 */ }
        { evouchers && evouchers.length ?
          <Discount discounts={evouchers} myevoucher={myevoucher} onChange={discountEvoucher}/>
          :
          null
        }
        {
          renderInstrAndDetailTab()
        }
        {
          this.props.location.query.hidePay ?
            null
            :
            <footer className={styles.footer}>
              <PayAction amount={order && order.payable_amount * 100 || 0} submit={handleSubmit}
                         orderLoading={this.props.orderLoading}
                         disabled={!order.id || this.props.orderLoading || (tmp.package == 1 && !datacards.length)}/>
            </footer>
        }
        {
          loading ?
            <ActivityIndicator size="large" toast text="正在加载"/>
            :
            null
        }
      </Page>
    );
  }
}

/**
 * 套餐组件
 */
@connect(state=>({
  cardUnitPrice: (()=> {
    var prod = state.product.map[1];
    return money((prod && prod.unit_price || 99) * 100).join('.') + '元';
  })(),
  disabled: state.order.loading,

}))
class Package extends Component {
  static propTypes = {
    onChange: PropTypes.func,  // 套餐改变时回调
    iccid: PropTypes.string,   // 卡号
    check: PropTypes.number,   // 已经选中的套餐
    disabled: PropTypes.bool,   // 订单操作如果正在加载中，禁止操作套餐
  };

  constructor(props) {
    super(...arguments);
    this.state = {
      check: props.check || 1
    };
  }

  render() {
    var {onChange, iccid, cardUnitPrice, disabled} = this.props;
    /**
     * 处理套餐改变
     * @param id
     * @param e
     */
    var handleChange = (id, e) => {
      if (e.target.checked) {
        // 加一个300延时， 防止快速重复点击时出现 "订单不存在， 订单详情不存在， 服务端错误"
        clearTimeout(this.__handleChange_timeout);
        this.__handleChange_timeout = setTimeout(()=>{
          this.setState({
            check: id
          });
          onChange && onChange(id);
        },300);
      }
    };
    return (
      <List className={[styles.formItem, 'radio-left'].join(' ')}>
        <Radio.RadioItem disabled={disabled} checked={this.state.check == 1} onChange={handleChange.bind(this, 1)}>
          <Flex>
            <label>现有全球芯</label>
            <Flex.Item className={styles.inputCard}>
              {
                iccid || '请输入您的络漫全球芯卡号'
              }
            </Flex.Item>
            <Arrow/>
          </Flex>
        </Radio.RadioItem>
        <Radio.RadioItem disabled={disabled} checked={this.state.check == 2} onChange={handleChange.bind(this, 2)}
                         className={styles.buyNewCard}>
          <Flex>
            <label>另购全球芯</label>
            <Flex.Item><Link to="/products/1/1?hidePay=1" className="see-detail">[查看详情]</Link></Flex.Item>
            <div><a>{cardUnitPrice}</a></div>
          </Flex>
        </Radio.RadioItem>
        <Radio.RadioItem disabled={disabled} checked={this.state.check == 3} onChange={handleChange.bind(this, 3)}>
          生成电子券
        </Radio.RadioItem>
      </List>
    );
  }
}

/**
 * 右箭头组件
 * @returns {XML}
 * @constructor
 */
function Arrow() {
  return <div className="am-list-arrow am-list-arrow-horizontal"/>
}

/**
 * 优惠劵组件
 * @param discounts   所有可用优惠劵
 * @param myevoucher  订单使用的优惠劵
 * @param onChange    使用优惠劵改变时回调
 * @returns {XML}
 * @constructor
 */
function Discount({discounts, myevoucher, onChange}) {
  var extra = myevoucher ? myevoucher.name : (discounts && discounts.length ? '有' + discounts.length + '条优惠可用' : '无可用优惠');
  return (
    <List className={styles.formItem}>
      <List.Item
        extra={extra}
        arrow="horizontal"
        onClick={() => {
          if (discounts && discounts.length) {
            Popup.show(<DiscountPopup myevoucher={myevoucher} discounts={discounts}
                                      onChange={onChange}/>, {animationType: 'slide-up'});
          }
        }}
      >
        我的优惠
      </List.Item>
    </List>
  );
}
Discount.propTypes = {
  discounts: PropTypes.array,       // 所有可用优惠劵
  myevoucher: PropTypes.object,     // 订单使用的优惠劵
  onChange: PropTypes.func          // 使用优惠劵改变时回调
};

/**
 * 国家地区组件
 * @param onClick
 * @param country
 * @returns {XML}
 * @constructor
 */
function Country({onClick, country}) {
  return (
    <List.Item onClick={onClick}>
      <Flex>
        <label>国家地区</label>
        {
          country ?
            <Flex.Item className={styles.country}>
              <img src={country.img}/>
              <span style={{
                position: 'relative',
                bottom: '-4px'
              }}>{country.value + (country.isContinent ? '通用' : '')}</span>
            </Flex.Item>
            :
            <Flex.Item className={[styles.country, 'desc-text'].join(' ')}>
              请选择国家/地区
            </Flex.Item>
        }
        {
          country ?
            <div className="desc-text">{country.price + '元/天'}</div>
            :
            null
        }
        <Arrow/>
      </Flex>
    </List.Item>
  );
}
Country.propTypes = {
  country: PropTypes.object,
  onClick: PropTypes.func
};

/**
 * 使用时间组件
 * @param start
 * @param end
 * @param history
 * @returns {XML}
 * @constructor
 */
function UseDate({start, end, history}) {
  return (
    <List.Item onClick={()=>history.push('/select-calendar')}>
      <Flex>
        <label>使用日期</label>
        <Flex.Item>
          {
            start && end ?
              (format(start) + ' 至 ' + format(end))
              :
              <span className="desc-text">开始时间 - 结束时间</span>
          }
        </Flex.Item>
        <Arrow/>
      </Flex>
    </List.Item>
  );
}
UseDate.propTypes = {
  start: PropTypes.object,
  end: PropTypes.object,
  history: PropTypes.object
};
