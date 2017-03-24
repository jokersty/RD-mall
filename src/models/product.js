import {
  getsProduct,
  getsProductByCategoryId,
  getsProductById,
  // getsProductCategory,
  // getsProductUnitPrice
} from '../services';
import pinyin from '../utils/pinyin';
import {Toast} from 'antd-mobile';
import COUNTRYS, {CONTINENTS} from '../utils/countrys';
import {imageSrcTransform} from '../utils/urlTransform';
import effect, {loading, failed} from './effect'; //默认的effect要放在最前面

import {productsCache, productsIdCache, productCategoryCache} from '../utils/storage';


export default {

  namespace: 'product',

  state: {
    loading: false,
    map: productsCache() || {},
    newOrder: {}
  },

  subscriptions: {
    setup({dispatch, history}) {
      history.listen(location => {
        var type = 'fetchProducts';
        if (location.pathname === '/') {
          //首页加载所有产品
          setTimeout(()=> {
            dispatch({
              type,
              payload: {}
            });
          });
        } else {
          // 产品页面只查询指定的产品
          var match = location.pathname.match(/^\/products\/?([\d]*)?\/?([\d]*)?/);
          if (match && match.length) {
            dispatch({
              type,
              payload: {
                productids: match[2],
                categoryid: match[1]
              }
            });
            dispatch({type: 'fetchProductsCache'});
          }
        }
      });
    },
  },

  effects: {
    /**
     * 加载产品
     * @param payload
     * @param call
     * @param put
     * @param select
     */
    *fetchProducts({payload}, {call, put, select}) {
      try {
        yield put({type: 'loading'});
        var map = yield select(state=>state.product.map);
        var data, err;
        if (!payload.categoryid && !payload.productids) {
          //加载所有产品
          // var ids = Object.keys(map).join(',');
          // var cache_ids = productsIdCache();
          // if (ids && ids != cache_ids) {
            var {data, err} = yield call(getsProduct, payload);
            // console.error('load all product');
          // }
        } else if (payload.categoryid && !payload.productids) {
          //加载指定类目下的产品
          var ids = Object.keys(map).reduce((ids, id)=> {
            if (map[id].categoryid == payload.categoryid) {
              ids.push(id);
            }
            return ids;
          }, []).join(',');
          var cache_ids = (productCategoryCache() || {})[payload.categoryid];
          if (!ids || !cache_ids || ids != cache_ids) {
            var {data, err} = yield call(getsProductByCategoryId, payload.categoryid);
          }
        } else if (payload.productids) {
          //内存级别的缓存, 如果已经有某个产品，就不再加载此产品数据
          var ids = payload.productids.split(',').reduce((ids, id)=> {
            if (!map[id]) {
              ids.push(id);
            }
            return ids;
          }, []).join(',');
          if (ids) {
            var {data, err} = yield call(getsProductById, ids);
          }
        }
        if (err) {
          throw err;
        } else {
          yield put({
            type: 'fetchProductsSuccess',
            result: data || {},
          });
        }
      } catch (ex) {
        console.error(ex);
        Toast.fail(ex.message || '失败');
        yield put({
          type: 'failed',
          err: ex
        })
      }
    },
  },

  reducers: {
    /**
     * 加载状态
     * @param state
     * @returns {{loading: boolean}}
     */
    loading,
    /**
     * 失败
     * @param state
     * @param action
     * @returns {{loading: boolean, err: (*|Error)}}
     */
    failed,
    /**
     * 获取产品成功
     * @param state
     * @param action
     * @returns {{map: {}, loading: boolean}}
     */
    fetchProductsSuccess(state, action) {
      const {products} = action.result;
      const map = state.map || {};
      const categoryMap = {};
      if (products && products.length) {
        for (let el of products) {
          const input = {};
          if (Array.isArray(el.prdattrs) && el.prdattrs.length) {
            const all = {};
            const amap = {};
            const continents = Object.keys(CONTINENTS);
            let areas = [];
            let dateTime = 0;
            el.prdattrs.forEach(pa=> {
              switch (pa.attr.varname) {
                case 'areaname':
                  const ci = continents.indexOf(pa.value);
                  if (ci != -1) {
                    const c = CONTINENTS[pa.value];
                    pa.img = c && c.img || '';
                    pa.isContinent = true;
                    continents[ci] = pa;
                  } else {
                    if (typeof pa.value === 'string' && pa.value.length) {
                      const py = pinyin(pa.value);
                      if (Array.isArray(py) && py.length) {
                        pa.pinyin = py[0];
                      }
                    }
                    pa.pinyin = pa.pinyin || '#';
                    const c = COUNTRYS[pa.value];
                    pa.img = c && c.img || '';
                    pa.continent = c && c.continent || '';
                    areas.push(pa);
                  }
                  pa.price = el.unit_price + ( Number(pa.price) || 0);
                  all[pa.id] = pa;
                  break;
                case 'effect_datetime':
                  dateTime++;
                  break;
                case 'failure_datetime':
                  dateTime++;
                  break;
              }
            });

            //根据拼音排序
            areas.sort((a, b)=> a.pinyin > b.pinyin ? 1 : -1);
            //根据拼音首字母分组
            areas.forEach(area=> {
              const index = area.pinyin[0] || '#';
              const arr = amap[index] || [];
              arr.push(area);
              amap[index] = arr;
            });
            if (areas.length) {
              el.area = {
                countrys: areas,
                pinyinMap: amap,
                continents: continents,
                all
              };
              input.area = true;
            }

          }
          // if (el.image) {
          //   el.image = imageSrcTransform(el.image);
          // }
          switch (el.id) {
            case 6:
              input.dateTime = true;
              break;
            case 3:
              input.duration = true;
              el.durationOptions = [60, 120, 200, 500];
              break;
            case 2:
              input.dateTime = true;
              input.package = true;
              break;
            case 1:
              //ID为1, 全球络漫卡
              input.quantity = true;
              input.address = true;
              break;
            case 10:
              input.dateTime = true;
              input.quantity = true;
              input.address = true;
              break;
            case 11:
              input.quantity = true;
              input.address = true;
              break;
          }
          el.input = input;
          map[el.id] = el;
          var cmap = categoryMap[el.categoryid] || {};
          cmap[el.id] = el.id;
          categoryMap[el.categoryid] = cmap;
        }

        setTimeout(()=> { //本地存储级缓存
          productsCache(map, 0, true);
          var ids = Object.keys(map).join(',');
          ids && productsIdCache(ids);
          Object.keys(categoryMap).forEach(cid=> {
            categoryMap[cid] = Object.keys(categoryMap[cid]).join(',');
          });
          productCategoryCache(categoryMap);
        });
      }
      return {...state, map: {...map}, loading: false};
    }
  },
}
