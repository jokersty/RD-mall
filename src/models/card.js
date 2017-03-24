import {
  bindDataCard,
  getsDataCard
} from '../services';

import {Toast} from 'antd-mobile';

import {datacardsCache} from '../utils/storage';

import effect, {loading, failed} from './effect';
import {routerRedux} from 'dva/router';
export default {

  namespace: 'card',

  state: {
    loading: false,
    datacards: datacardsCache() || [],
  },

  subscriptions: {
    setup({dispatch, history}) {
      history.listen(location => {
        switch (location.pathname) {
          case '/my-card':
          case '/products/2/2':
            dispatch({
              type: 'gets',
              payload: {}
            });
        }
      });
    }
  },

  effects: {
    /**
     * 绑定卡，在UI中表现为添加卡
     */
    *bind(action, saga){
      var data = yield saga.call(effect(bindDataCard, 'bindDataCardSuccess'), action, saga);
      console.log(data);
      if(data && data.datacard && data.datacard.iccid){
        Toast.success('添加络漫卡成功');
         yield saga.put(routerRedux.goBack());
      }
    },
    /**
     * 获取用户所有绑定和卡
     */
    gets: effect(getsDataCard, 'getsDataCardSuccess', ()=> {
      var datacards = datacardsCache();
      if (datacards && datacardsCache.length) {
        return datacards;
      }
      return null;
    }, 'datacards'),
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
     * 绑定卡成功
     * @param state
     * @param action
     * @returns {{loading: boolean}}
     */
    bindDataCardSuccess(state, action){
      // 绑上成功后清空数据卡缓存，以便重新获取
      datacardsCache.clear();
      return {...state, loading: false};
    },
    /**
     * 获取用户所有绑定的卡成功
     * @param state
     * @param action
     * @returns {{datacards: (Array|*), loading: boolean}}
     */
    getsDataCardSuccess(state, action){
      var {datacards} = action.result;
      if (!action.noCache) {
        datacards && datacardsCache(datacards);
      }
      return {...state, datacards, loading: false};
    }
  },
}



