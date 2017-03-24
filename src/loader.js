/**
 * 加载器的Ajax请求， 用于获取JS、CSS文件内容
 * @param url
 * @param callback
 */
function ajax(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.send(null);
  xhr.onreadystatechange = function () {
    var DONE = 4; // readyState 4 代表已向服务器发送请求
    var OK = 200; // status 200 代表服务器返回成功
    if (xhr.readyState === DONE) {
      if (xhr.status === OK) {
        callback.call(xhr, null, xhr.responseText);
      } else {
        callback.call(xhr, new Error("Error: " + xhr.status));
      }
    }
  }
}
/**
 * 创建Style标签 装载CSS
 * @returns {Element}
 */
function createStyleNode() {
  var node = document.createElement('style');
  node.type = 'text/css';
  node.rel = "stylesheet";
  return node;
}
/**
 * 创建Script标签 装载JS
 * @returns {Element}
 */
function createScriptNode() {
  var node = document.createElement('script');
  node.type = 'text/javascript';
  return node;
}
/**
 * 插入样式文本
 * @param text
 */
function insertStyleText(text) {
  var node = createStyleNode();
  node.appendChild(document.createTextNode(text));
  head.appendChild(node);
}
/**
 * 插入样式标签
 * @param url
 */
function insertStyleTag(url, cb) {
  var node = createStyleNode();
  node.href = url;
  node.onload = cb;
  head.appendChild(node);
}
/**
 * 插入脚本文本
 * @param text
 */
function insertScriptText(text) {
  var node = createScriptNode();
  node.appendChild(document.createTextNode(text));
  head.appendChild(node);
}
/**
 * 插入脚本标签
 * @param url
 */
function insertScriptTag(url, cb) {
  var node = createScriptNode();
  node.href = url;
  node.onload = cb;
  head.appendChild(node);
}

function each(o, fn) {
  if (o) {
    if (o.length) {
      for (var i = 0, len = o.length; i < len; i++) {
        fn(o[i], i, o);
      }
    } else {
      for (var i in o) {
        fn(o[i], i, o);
      }
    }
  }
}

function isCssFile(file) {
  return /\.css$/gi.test(file);
}

function invokeJsCodes(jsCodes, jsErrors) {
  if (jsCodes && jsCodes.length) {
    while (jsCodes.length) {
      insertScriptText(jsCodes.shift());
    }
  }
  if (jsErrors && jsErrors.length) {
    while (jsErrors.length) {
      insertScriptTag(jsErrors.shift());
    }
  }
}

function checkJsInvoke(css, cssLoads) {
  return css >= cssLoads.length;
}

function tryInvokeJs(css, cssLoads, jsCodes, jsErrors) {
  checkJsInvoke(css, cssLoads) && invokeJsCodes(jsCodes, jsErrors);
}

var head = document.getElementsByTagName('head')[0];
var localVersion = localStorage.getItem('version');

localStorage.setItem('version', JSON.stringify(version)); //保存新的版本信息

try {
  localVersion = JSON.parse(localVersion) || {};
} catch (ex) {
  localVersion = {};
}
var prefix = 'code-', cssLoads = [], jsLoads = [], jsErrors = [], jsCodes = [], css = 0;

each(version, function (file, i) {
  console.log('version 比较', file, localVersion[i]);
  // 如果版本相同
  if (file === localVersion[i]) {
    // 读取代码
    var code = localStorage.getItem(prefix + file);
    if (code) {
      // 存在代码，如果是CSS直接插入
      if (isCssFile(file)) {
        // console.log('插入CSS:'+file);
        insertStyleText(code);
      } else {
        //如果是JS代码 暂存
        // console.log('本地读取，暂存JS:'+file);
        jsCodes.push(code);
      }
      return;
    }
  }
  // 版本不同 或 本地代码没有
  // 删除老版本代码
  localStorage.removeItem(prefix + localVersion[i]);
  console.log('删除老版本文件:'+localVersion[i]);

  if (isCssFile(file)) {
    cssLoads.push(file); // 存入待加载中git
    console.log('ajax:'+file);
    ajax(file, function (err, text) {
      if (err) {
        // console.log('ajax Error:'+file);
        insertStyleTag(file, function () {
          css++;
          // 检查是否可以执行JS
          tryInvokeJs(css, cssLoads, jsCodes, jsErrors);
        });
      } else {
        insertStyleText(text);
        css++;
        // 检查是否可以执行JS
        tryInvokeJs(css, cssLoads, jsCodes, jsErrors);
        localStorage.setItem(prefix + file, text);
      }
    });
  } else {
    jsLoads.push(file); // 存入待加载中
    // console.log('ajax:'+file);
    ajax(file, function (err, text) {
      if (err) {
        // console.log('ajax Error:'+file);
        jsErrors.push(file);
        // 检查是否可以执行JS
        checkJsInvoke(css, cssLoads) && invokeJsCodes(jsCodes, jsErrors);
      } else {
        jsCodes.push(text);
        // 检查是否可以执行JS
        tryInvokeJs(css, cssLoads, jsCodes, jsErrors);
        localStorage.setItem(prefix + file, text);
      }
    })
  }
});

tryInvokeJs(css, cssLoads, jsCodes, jsErrors);


