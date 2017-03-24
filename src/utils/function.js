/**
 * 格式化货币数字
 * @param m
 * @returns {Array} 返回数组形式方便 小数部分与整数部分使用在不同的标签里
 */
export function money(m) {
  var arr = Number(m / 100).toFixed(2).split('.');
  if (arr.length < 2) {
    arr.push('00');
  }
  return arr;
}

/**
 * 从数组中删除指定索引的元素，返回新的数组
 * @param arr
 * @param index
 * @returns {string|Array.<T>}
 * @constructor
 */
export function ArrayRemoveIndex(arr, index) {
  return arr.concat(arr.splice(index).splice(1));
}

/**
 * 判断DOM元素是否含有指定的类名
 * @param ele DOM Element
 * @param className css class name
 * @returns {*}
 */
export function hasClass(ele, className) {
  if(ele && ele.className) {
    var cns = (ele.className + '').split(' ').reduce((cc, c)=> {
      cc[c] = c;
      return cc
    }, {});
    for (var c of className.split(' ')) {
      if (cns[c]) {
        return c;
      }
    }
  }
  return false;
}

