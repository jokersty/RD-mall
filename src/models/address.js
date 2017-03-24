import {
  getsAddress,
  getsCity,
  setAddress,
  deleteAddress
} from '../services';
import {Toast} from 'antd-mobile';
import {addressCache, citiesCache} from '../utils/storage';
import effect, {loading, failed} from './effect';
import {ArrayRemoveIndex} from '../utils/function';

export default {

  namespace: 'address',

  state: {
    loading: false,
    addresses: addressCache(), //读取地址缓存
  },

  subscriptions: {
    setup({dispatch, history}) {
      history.listen(location => {
        /**
         * 获取用户所有收件地址
         */
        var fetchAddresses = ()=>{
          dispatch({
            type: 'fetch',
            payload: {}
          });
        };
        switch (location.pathname) {
          case '/addresses/add':
            if (location.query.pid && location.query.type) {
              // 获取省市区
              dispatch({
                type: 'fetchCities',
                payload: {
                  pid: location.query.pid,
                  type: location.query.type
                }
              });
            }
            break;
          case '/':               // 进商城的时候就去获取我的收获地址
          case '/addresses':
          case '/products/1/1':
          case '/products/2/2':
          case '/products/6/11':
            fetchAddresses();
            break;
          default:
            if (/\/addresses\/[\d]+$/gi.test(location.pathname)) {
              fetchAddresses();
            }
            break;
        }
      });
    },
  },

  effects: {
    /**
     * 获取用户所有收件地址，带缓存
     */
    fetch: effect(getsAddress, 'fetchSuccess', ()=>{
      var cache = addressCache();
      if(cache && cache.length){
        return cache;
      }
      return null;
    }, 'addresses'),
    /**
     * 获取省市区，带缓存
     */
    fetchCities: effect(getsCity, 'fetchCitiesSuccess', ({payload})=>{
      var cities = (citiesCache() || []).filter(p=>p.pid == payload.pid);
      if (cities && cities.length) {
        return cities;
      }
      return null;
    }, 'cities'),
    /**
     * 添加地址
     */
    add: effect(setAddress, 'addSuccess'),
    /**
     * 更新地址
     */
    update: effect(setAddress, 'updateSuccess'),
    /**
     * 删除地址
     */
    remove: effect(deleteAddress, 'removeSuccess')
  },

  reducers: {
    /**
     * 加载中的状态
     * @param state
     * @returns {{loading: boolean}}
     */
    loading,
    /**
     * 失败的状态
     * @param state
     * @param action
     * @returns {{loading: boolean, err: (*|Error)}}
     */
    failed,
    /**
     * 获取用户地址成功
     * @param state
     * @param action
     * @returns {{addresses: *, loading: boolean}}
     */
    fetchSuccess(state, action) {
      var {noCache, result:{addresses}} = action;
      !noCache && addresses && addresses.length && addressCache(addresses);
      return {...state, addresses, loading: false};
    },
    /**
     * 获取省市区成功
     * @param state
     * @param action
     * @returns {{cities: *, loading: boolean}}
     */
    fetchCitiesSuccess(state, action){
      var {noCache, result:{cities}} = action;
      !noCache && cities && cities.length && citiesCache(cities.concat(citiesCache() || []));
      delete state.newAddr;
      return {...state, cities, loading: false};
    },
    /**
     * 添加成功
     * @param state
     * @param action
     * @returns {{addresses: (*|Array), newAddr: *, loading: boolean}}
     */
    addSuccess(state, action){
      var addresses = state.addresses || [];
      var addr = action.result.addr;

      if (addr.defaultaddr) {
        for (var a of addresses) {
          if (a.defaultaddr) {
            a.defaultaddr = false;
            break;
          }
        }
      }
      addresses.unshift(addr);
      addressCache(addresses);
      return {...state, addresses, newAddr: addr, loading: false};
    },
    /**
     * 更新成功
     * @param state
     * @param action
     * @returns {{addresses: Array, newAddr: Array}}
     */
    updateSuccess(state, action){
      var addresses = state.addresses || [];
      var addr = action.result.addr;
      var ds = [];
      for (var i = 0, len = addresses.length; i < len; i++) {
        var ad = addresses[i];
        if (addr.defaultaddr && ad.defaultaddr) {
          ad.defaultaddr = false;
        }
        ds.push(ad.id == addr.id ? addr : ad);
      }
      addressCache(ds);

      return {...state, addresses: ds, newAddr: ds};
    },
    /**
     * 删除成功
     * @param state
     * @param action
     * @returns {{addresses: (*|Array), loading: boolean}}
     */
    removeSuccess(state, action){
      var addresses = state.addresses || [];
      var i = 0, len = addresses.length;
      for (; i < len; i++) {
        if (addresses[i].id == action.payload.addrid) {
          addresses = ArrayRemoveIndex(addresses, i);
          break;
        }
      }
      addressCache(addresses);
      return {...state, addresses, loading: false};
    }
  },

}


