import Ready from './ready';
import storage, {loginInfoCache} from './storage';
import native from '../services/native';
import {loginSync, loginWithWxmp} from '../services/index';

var info = new Ready();

var ua = navigator.userAgent.toLowerCase();
var inRoamPhone = /roamphone\/(\S+\b)/.test(ua);
var inSDK = /roamphonesdk\/(\S+\b)/.test(ua);

if (inRoamPhone || inSDK) {
  native.getLoginInfo(function (response) {
    console.log('native getLoginInfo', response);
    if (response && !response.errorcode && response.data) {
      var data = response.data;
      data = {sessionid: data.sessionId, userid: data.userId};
      loginInfoCache(data);
      info.set({data});
    } else {
      info.set({err: new Error(response && response.errorinfo || '获取登录信息失败!')});
      loginInfoCache.clear();
    }
  });
} else {
  var inWeixin = /micromessenger\/(\d+\.\d+\.\d+)/.test(ua);
  if (inWeixin) {
    var isTest = false;
    if (isTest) {
      var cacheInfo = loginInfoCache();
      if (cacheInfo != null) {
        info.set({data: cacheInfo});
      } else {
        var code = localStorage.getItem("code");
        var state = "STATE";
        if (code != null) {
          loginWithWxmp({code, state}).then(({data, err}) => {
            var d = null;
            if (data) {
              d = {
                userid: data.userid,
                sessionid: data.sessionid,
                openid: data.phone
              };
              loginInfoCache(d);
              info.set({data: d});
            } else {
              info.set({err});
              loginInfoCache.clear();
            }
          });
        }
      }
    } else {
      // 每次都需要根据code获取sessionid
      var code = localStorage.getItem("code");
      var state = "STATE";
      if (code != null) {
        // 微信登录前清空所有缓存
        storage.clear();
        loginWithWxmp({code, state}).then(({data, err}) => {
          var d = null;
          if (data) {
            d = {
              userid: data.userid,
              sessionid: data.sessionid,
              openid: data.phone
            };
            loginInfoCache(d);
            info.set({data: d});
          } else {
            info.set({err});
            loginInfoCache.clear();
          }
        });
      }
    }

  } else {
    loginSync({
      username: '15168228927',
      password: 'hjkl258'
    }).then(({data, err})=> {
      var d = null;
      if (data) {
        d = {
          userid: data.userid,
          sessionid: data.sessionid
        };
        loginInfoCache(d);
        info.set({data: d});
      } else {
        info.set({err});
        loginInfoCache.clear();
      }
    });
  }
}
export default function () {
  return new Promise((resolve, reject)=> {
    info.ready(({data, err})=> {
      if (err) {
        reject(err);
        info.set(null);
      } else {
        resolve(data);
      }
    });
  });
}
