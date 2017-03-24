import {login} from '../services';
import {Toast} from 'antd-mobile';
import {loginInfoCache} from '../utils/storage';
import effetc, {loading, failed} from './effect';

export default {

  namespace: 'user',

  state: {
    loading: false
  },

  subscriptions: {
    setup({dispatch, history}) { //如果是APP上的， 直接去除这段
      history.listen(location => {
        switch (location.pathname) {
          case '/login':
            dispatch({
              type: 'login',
              payload: {
                username: '15802775358',
                password: '123456'
              }
            });
            break;
          case '/':
            // 如果APP在用户退出的时候不删除localStorage 那么前端只能在这里清除用户信息
            // loginInfoCache.clear();
            // dispatch({
            //   type: 'login'
            // });
        }

      });
    },
  },

  effects: {
    /**
     * 登录
     */
    login: effetc(login, 'loginSuccess')
  },

  reducers: {
    /**
     * 加载状态
     */
    loading,
    /**
     * 失败状态
     */
    failed,
    /**
     * 登录成功状态
     * @param state
     * @param action
     * @returns {{info: (result|{datacards}|*|{order, myevoucher}|reducers.result|{evouchers}), loading: boolean}}
     */
    loginSuccess(state, action) {
      var data = action.result;
      loginInfoCache({sessionid: data.sessionid, userid: data.userid});
      return {...state, info: action.result, loading: false};
    },

  },

}


