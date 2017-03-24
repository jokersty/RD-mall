import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Button, List, ActivityIndicator} from 'antd-mobile';
import Page from '../../components/Page/Page';

/**
 * 登录页面，APP内不需要此页面
 * @param user
 * @param loading
 * @returns {XML}
 * @constructor
 */
function Login({user, loading}) {
  if(loading){
    return <Page title="正在加载..."><ActivityIndicator size="large" toast text="正在加载"/></Page>;
  }
  return (
    <Page title="登录">
      {
        user ?
          <div>
            <List>
              {
                Object.keys(user).map(k=>
                  <List.Item key={k} extra={user[k]}>{k}</List.Item>
                )
              }
            </List>
            <div style={{padding: 30}}>
              <Link to="/">
                <Button type="primary">前往首页</Button>
              </Link>
            </div>
          </div>
          :
          null
      }
    </Page>
  )
}
Login.propTypes = {
  user: PropTypes.object,
  loading: PropTypes.bool,
};

export default connect(state=>({
  user: state.user.info,
  loading: state.user.loading
}))(Login);

