import {
  getsHomePage
} from '../services';
import effect, {loading, failed} from './effect';
import {routerRedux} from 'dva/router';
import {homePagesCache} from '../utils/storage';

export default {

  namespace: 'home',

  state: {
    loading: false,
    homepages: {},
  },

  subscriptions: {
    setup({dispatch, history}) {
      history.listen(location => {
        if (location.pathname === '/') {
          dispatch({
            type: 'fetch'
          })
        }
      });
    }
  },

  effects: {
    fetch: effect(getsHomePage, 'fetchSuccess', ()=>{
      var data = homePagesCache();
      return data && data.length && data;
    }, 'homepages')
  },

  reducers: {
    /**
     * 加载状态
     * @param state
     * @returns {{loading: boolean}}
     */
    loading,
    /**
     * 失败状态
     * @param state
     * @param action
     * @returns {{loading: boolean, err: (*|Error)}}
     */
    failed,
    /**
     * 获取首页配置成功处理
     * @param state
     * @param action
     * @returns {{}}
     */
    fetchSuccess(state, action){
      var data = action.result && action.result.homepages;
      var ua = navigator.userAgent.toLowerCase();
      var inWeixin = /micromessenger\/(\d+.\d+.\d+)/.test(ua);
      if (inWeixin) {
        // 过滤微信中的可够商品
        var weixinProds = [];
        data.forEach(d=> {
          weixinProds.push(d);
        });
      }
      var homepages = {};
      if (data && data.length) {
        if(!action.noCache) {
          homePagesCache(data);
        }
        data.forEach(d=> {
          var s = homepages[d.location] || [];
          s.push(d);
          homepages[d.location] = s;
        });
      }
      return {...state, homepages, loading: false};
    }
  },
}



