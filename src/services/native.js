import Ready from '../utils/ready';

// nativeInterface.goPayOrder(orderid.toString(), payid,onGetResult);
// nativeInterface.setCallTransfer();
// nativeInterface.goBack();
// nativeInterface.goMall();
// nativeInterface.goScanCode();
// nativeInterface.getGlobalCard();
// nativeInterface.setApn();
// nativeInterface.getLoginInfo(onGetResult);
// nativeInterface.goLogin();
// nativeInterface.getInfo(function(mes){alert(mes)});

var native = new Ready(window.nativeInterface);

// var fnList = []; // 在ready之前暂存方法调用

// var native = window.nativeInterface;  // APP提供的接口

/**
 * 判断参数是否为函数
 * @param fn
 * @returns {boolean}
 */
function isFunction(fn) {
  return 'function' === typeof fn;
}

// /**
//  * 如果native对象已经存在，直接执行fn, 否则暂存方法等待native就绪
//  * @param fn
//  */
// function ready(fn) {
//   native ? fn(native) : fnList.push(fn);
// }

/**
 * 将参数对象转换成数组形式
 * @param args arguments
 * @returns {*}
 */
// function makeArray(args) {
//   var arr = [];
//   if (args && args.length) {
//     for (var i = 0, len = args.length; i < len; i++) {
//       arr.push(args[i]);
//     }
//   }
//   return args;
// }

/**
 * 生成方法
 * @param name
 * @returns {Function}
 */
function method(name) {
  return function () {
    var params = [...arguments]; //makeArray(arguments);
    console.log('wait native invoke ', name, params);
    native.ready(function (wni) {
      console.log('native invoke ', name, params);
      var fn = wni[name];
      isFunction(fn) && fn.apply(wni, params);
    });
  }
}

var Module = {};

// APP 提供以下接口
// goBack goMall getGlobalCard getInfo
'go goPayOrder setCallTransfer goScanCode setApn getLoginInfo goLogin'.split(' ').forEach(function (name) {
  Module[name] = method(name);
});

/**
 * DOM事件监听, nativeready事件触发后执行暂存的方法
 */
document.addEventListener('nativeready', function () {
  native.set(window.nativeInterface);
  // while (fnList.length) {
  //   const fn = fnList.shift();
  //   isFunction(fn) && fn(native);
  // }
});

export default Module;



