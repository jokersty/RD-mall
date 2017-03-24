import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import Country from '../../components/Country/Country';
import Page from '../../components/Page/Page';

/**
 * 选择国家地区页面
 * @param tmp
 * @param dispatch
 * @param history
 * @param location
 * @returns {XML}
 * @constructor
 */
function SelectCountry({tmp, dispatch, history, location}) {
  var handleChange = country => {
    dispatch({
      type: 'order/keepTmp',
      payload: {
        country
      }
    });

    history.go(location.query.continentId ? -2 : -1);
  };
  return (
    <Page title="请选择国家地区">
      <Country areas={tmp.area} location={location} history={history} onChange={handleChange}/>
    </Page>
  );
}

SelectCountry.propTypes = {
  tmp: PropTypes.object,
};

export default connect(state=>({
  tmp: state.order.tmp || {},
}))(SelectCountry);
