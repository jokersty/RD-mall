import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import Calendar from '../../components/Calendar/Calendar';
import Page from '../../components/Page/Page';
import styles from './SelectCalendar.less';

/**
 * 选择开始日期与结束日期页面
 * @param tmp       临时数据
 * @param dispatch
 * @param history
 * @returns {XML}
 * @constructor
 */
function SelectCalendar({tmp, dispatch, history}) {
  var handleChange = ({start, end})=> {
    dispatch({
      type: 'order/keepTmp',
      payload: {
        start,
        end
      }
    });
    history.go(-1);
  };

  return (
    <Page title="请选择使用时间">
      <div className={styles.tips}>建议起止日期以来回机票为准</div>
      <Calendar start={tmp.start} end={tmp.end} onChange={handleChange}/>
    </Page>
  );
}

SelectCalendar.propTypes = {
  tmp: PropTypes.object,
  order: PropTypes.object,
};

export default connect(state=>({
  tmp: state.order.tmp || {},
}))(SelectCalendar);
