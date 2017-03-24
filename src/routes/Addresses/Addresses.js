import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Button, List, Radio, Flex, Toast, ActivityIndicator, SwipeAction} from 'antd-mobile';
import Address from '../../components/Address/Address';
import AddActionBar from '../../components/AddActionBar/AddActionBar';
import Page from '../../components/Page/Page';
import styles from './Addresses.less';

/**
 * 地址列表页面
 * @param list      // 地址列表
 * @param loading   // 加载状态
 * @param dispatch
 * @param history
 * @param selectid  // 选中的地址
 * @returns {XML}
 * @constructor
 */
function Addresses({list, loading, dispatch, history, location:{query:{selectid}}}) {

  // 如果地址列表不存在或正在加载
  if (loading && !list) {
    return (<ActivityIndicator size="large" toast text="正在加载"/>)
  }

  // 重新排序，将默认地址放到第一条
  list && list.length && list.sort((b, c)=>c.defaultaddr ? 1 : -1);

  // 获取已经选中的地址ID
  var checkedId = selectid || (list && list.length && list[0] && list[0].defaultaddr && list[0].id);

  // 选中地址改变处理
  var handleChange =  (shipping_address, e)=> {
    e.stopPropagation();
    if (e.target.checked) {
      dispatch({
        type: 'order/keepTmp',
        payload: {
          shipping_address
        }
      });
      history.go(-1);
    }
  };
  // 创建左滑操作
  var createSwipeActionOptions = ad => {
    return [{
      text: '编辑',
      style: {backgroundColor: '#0bd38a', color: 'white'},
      onPress: () => {
        history.push('/addresses/' + ad.id);
      }
    },{
      text: '删除',
      onPress: () => {
        dispatch({
          type: 'address/remove',
          payload: {
            addrid: ad.id
          }
        })
      },
      style: {backgroundColor: '#F4333C', color: 'white'},
    }];
  };


  return (
    <Page className={styles.page} title="请选择收件地址">
      {
        list && list.length ?
          <div>
            <List>
              {
                list.map((ad)=>
                  <SwipeAction key={'address-' + ad.id} autoClose
                               className={ad.defaultaddr ? ' default-address' : ''}
                               right={createSwipeActionOptions(ad)}
                  >
                    <Radio.RadioItem checked={ad.id == checkedId}
                                     className={
                                       styles.radioItem +
                                       (ad.id == checkedId ? ' address' : '')
                                     }
                                     onChange={handleChange.bind(this, ad.id)}
                    >
                      <Address address={ad}/>
                    </Radio.RadioItem>
                  </SwipeAction>
                )
              }
            </List>
            <Link to="/addresses/add">
              <AddActionBar title="新增收件地址"/>
            </Link>
          </div>
          :
          <div className={styles.null}>
            <img src={require('./images/location.png')}/>
            <p>暂未添加任何收货地址</p>
            <Link className={styles.create} to="/addresses/add">立即新增</Link>
          </div>
      }
    </Page>
  );
}

Addresses.propTypes = {
  list: PropTypes.array, // 地址列表
  loading: PropTypes.bool,
};

export default connect(state=>({
  list: state.address.addresses,
  loading: state.address.loading,
  tmp: state.order.tmp || {},
}))(Addresses);

