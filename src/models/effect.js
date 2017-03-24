import {Toast} from 'antd-mobile';

/**
 * 修建Effect方法
 * @param api       服务方法
 * @param success   成功时reducers
 * @param cache     可选，缓存判断方法
 * @param name      可选，缓存取出后放到result的字段名
 * @returns {Function}
 */
export default function effect(api, success, cache, name) {
  return (
    function*(action, saga) {
      // console.log(action);
      if (cache) {
        var ca = cache(action, saga);
        // console.log('获取', cache, ca);
        if (ca) {
          yield saga.put({
            type: success,
            result: {
              [name]: ca
            },
            noCache: true
          });
          return;
        }
      }
      const {payload} = action;
      try {
        yield saga.put({type: 'loading'});
        var {data, err} = yield saga.call(api, payload);
        if (err) {
          throw err;
        } else {
          yield saga.put({
            type: success,
            result: data,
            payload
          });
          return data;
        }
      } catch (ex) {
        console.error(ex);
        Toast.fail(ex.message || '失败');
        yield saga.put({
          type: 'failed',
          err: ex
        })
      }

    }
  );
}

/**
 * 加载状态
 * @param state
 * @returns {{loading: boolean}}
 */
export function loading(state) {
  return {...state, loading: true};
}

/**
 * 失败状态
 * @param state
 * @param action
 * @returns {{loading: boolean, err: (*|Error)}}
 */
export function failed(state, action) {
  return {...state, loading: false, err: action.err};
}
