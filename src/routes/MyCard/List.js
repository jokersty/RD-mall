import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Button, List, Radio, Flex, Toast, ActivityIndicator, InputItem} from 'antd-mobile';
import AddActionBar from '../../components/AddActionBar/AddActionBar';
import Page from '../../components/Page/Page';
import styles from './List.less';
import {routerRedux} from 'dva/router';

/**
 * 全球卡列表选择页面
 * @param datacards  用户所有的全球卡
 * @param simid      选中的全球卡卡号
 * @param dispatch
 * @returns {XML}
 * @constructor
 */
function DataCardList({datacards, simid, dispatch, history}) {
  /**
   * 处理选择卡
   * @param datacard
   * @param e
   */
  var handleChange = (datacard, e)=> {
    if (e.target.checked) {
      dispatch({
        type: 'order/keepTmp',
        payload: {
          simid: datacard.iccid
        }
      });
      dispatch(routerRedux.goBack());
    }
  };
  var cardImage = require('../Home/images/card.jpg');
  return (
    <Page className={styles.page} title="请选择全球卡">
      <List className={styles.dataCards}>
        {
          datacards && datacards.length ?
            datacards.map(datacard=>
              <Radio.RadioItem key={datacard.iccid} checked={datacard.iccid == simid}
                               className={styles.radioItem}
                               onChange={handleChange.bind(this, datacard)}
              >
                <Flex>
                  <img src={cardImage}/>
                  <Flex.Item>
                    {format(datacard.iccid)}
                  </Flex.Item>
                </Flex>
              </Radio.RadioItem>
            )
            :
            null
        }

      </List>

      <AddActionBar title="新增全球卡" onClick={()=>{
        dispatch(routerRedux.push('/my-card/add'));
      }}/>

    </Page>
  );
}

DataCardList.propTypes = {
  datacards: PropTypes.array,
  simid: PropTypes.string,
};

export default connect(state=>({
  datacards: state.card.datacards || [],
  simid: state.order.tmp.simid
}))(DataCardList);

/**
 * 格式化显示卡号
 * @param simid
 * @returns {*}
 */
function format(simid) {
  if (simid && typeof simid === 'string') {
    var arr = [];
    while (simid.length) {
      arr.push(simid.slice(0, 4));
      simid = simid.slice(4);
    }
    return arr.join(' ');
  }
  return simid;
}
