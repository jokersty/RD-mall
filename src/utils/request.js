import fetch from 'dva/fetch';
import QueryString from 'qs';
import {loginInfoCache} from './storage';
import native from '../services/native';
// import loginInfo from './loginInfo';

/**
 * 处理result 部分
 * @param json
 * @returns {}
 */
function result(json) {
  if (!json.error_no) {
    const result = json.result || {};
    result.userid = json.userid;
    result.sessionid = json.sessionid;
    return result;
  }
  if (json.error_no == 1101) {
    loginInfoCache.clear();
    //这里页面要跳转到登录
    native.goLogin();
  }
  const error = new Error(json.error_info);
  error.code = json.error_no;
  error.response = json;
  throw error;
}
/**
 * 把返回的response转换成json
 * @param response
 * @returns {*}
 */
function parseJSON(response) {
  return response.json();
}

/**
 * 处理HTTP的状态码， 200-300之间为正常返回，其他抛出异常
 * @param response
 * @returns {*}
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  error.code = response.status;
  throw error;
}

/**
 * * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 * @param cache  function     存取方法 func([v]);
 * @returns {*}
 */
export default function request(url, options = {}, cache) {
  var data;
  if (cache) { //支持缓存
    data = cache();
    if (data) {
      return Promise.resolve({data});
    }
  }
  var data = options.data || {};
  delete options.data;
  var opts = {...options};
  opts.headers = {
    ...opts.headers,
  };

  var promise;

  opts.method = opts.method || 'POST'; //默认请求方式为POST

  if (opts.method == 'GET') { //如果是以GET形式访问的，参数放到url里， 不允许在GET请求中附加用户信息
    url = url.split('?');
    if (url[1]) {
      data = {...QueryString.parse(url[1]), ...data};
    }
    url = url[0] + '?' + QueryString.stringify(data);
    promise = fetch(url, opts);

  } else { //其他HTTP method 则把数据以 JSON string 放到请求主体中
    opts.headers['content-type'] = 'application/json; charset=UTF-8'; // 'application/x-www-form-urlencoded';
    // if (url === '/uc/services/login') { //除登录接口外其他一概附加用户登录信息
      opts.body = JSON.stringify(data);
      promise = fetch(url, opts);
    // } else {
    //   promise = loginInfo().then(loginInfo=> {
    //     data.userid = loginInfo.userid;
    //     data.sessionid = loginInfo.sessionid;
    //     opts.body = JSON.stringify(data);
    //     return fetch(url, opts);
    //   });
    // }
  }

  return promise
    .then(checkStatus)
    .then(parseJSON)
    .then(result)
    .then(data=> {
      cache && cache(data); //支持缓存
      return {data}
    })
    ['catch'](err => ({err}));
  // catch is a reserved word in IE<9, meaning promise.catch(func) throws a syntax error.
  // To work around this, use a string to access the property
}

/**
 * 从APP提供的接口获取登录信息
 * @returns {Promise}
 */
// function login() {
//   return new Promise((resolve, reject)=> {
//     var data = loginInfoCache();
//     if (data) {
//       resolve(data);
//     } else {
//       native.getLoginInfo(function (response) {
//         console.log('native getLoginInfo', response);
//         if (response && !response.errorcode && response.data) {
//           var data = response.data;
//           data = {sessionid: data.sessionId, userid: data.userId};
//           loginInfoCache(data);
//           resolve(data);
//         } else {
//           reject({err: new Error(response && response.errorinfo || '获取登录信息失败!')});
//         }
//       });
//     }
//   });
// }


