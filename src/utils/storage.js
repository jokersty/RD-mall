

/**
 * 数据缓存类
 */
export class Storage {
  /**
   * 数据缓存类构造方法
   * @param appKey 用于存储数据时键名的前缀
   * @param storage 本地存储或会话存储
   */
  constructor(appKey, storage) {
    this.__storage = storage || localStorage;
    this.__appKey = appKey ? appKey + '-' : '';
  }

  /**
   * 存储数据
   * @param key   键名
   * @param v     键值
   * @param expire  有效期， ms 单位
   * @param merge 新旧数据是否合并
   */
  setItem(key, v, expire, merge) {
    const {__storage, __appKey} = this;
    var str = merge ? {v: {...{v: this.getItem(key)}, ...{v}}} : {v: {v}};
    if (expire) {
      str.t = Date.now() + expire;
    }
    __storage.setItem(__appKey + key.toString(), JSON.stringify(str));
  }

  /**
   * 获取数据
   * @param key   键名
   * @returns     返回键值， 如果过期则为空
   */
  getItem(key) {
    const {__storage, __appKey} = this;
    const k = __appKey + key.toString();
    var obj = JSON.parse(__storage.getItem(k));
    if (obj && obj.t && obj.t < Date.now()) {
      __storage.removeItem(k);
      return;
    }
    return obj && obj.v && obj.v.v;
  }

  /**
   * 删除存储的数据
   * @param key
   */
  removeItem(key) {
    const {__storage, __appKey} = this;
    const k = __appKey + key.toString();
    __storage.removeItem(k);
  }

  /**
   * 清空数据
   */
  clear() {
    const {__storage, __appKey} = this;
    Object.keys(__storage).forEach(k=>k.indexOf(__appKey) == 0 && __storage.removeItem(k));
  }
}

/**
 * 络漫RD商城的缓存对象
 * @type {Storage}
 */
const storage = new Storage('roammall', window.sessionStorage);


var MINUTES = 60000;
var HOURS = 60 * MINUTES;
var DAY = 24 * HOURS;
var WEEK = 7 * DAY;
var MONTH = 30 * DAY;

export default storage;

export function homePagesCache(homePages) {
  var key = 'home.homepages';
  return homePages ? storage.setItem(key, homePages, HOURS) : storage.getItem(key);
}
homePagesCache.clear = function(){
  storage.removeItem('home.homepages');
};

/**
 * 收件地址缓存
 * @param addresses
 * @returns {返回键值}
 */
export function addressCache(addresses) {
  var key = 'address.addresses';
  return addresses ? storage.setItem(key, addresses, 2 * MINUTES) : storage.getItem(key);
}
addressCache.clear = function(){
  storage.removeItem('address.addresses');
};

/**
 * 省市区缓存
 * @param cities
 * @returns {返回键值}
 */
export function citiesCache(cities){
  var key = 'address.cities';
  return cities ? storage.setItem(key, cities, WEEK) : storage.getItem(key);
}

/**
 * 全球卡缓存
 * @param datacards
 * @returns {返回键值}
 */
export function datacardsCache(datacards){
  var key = 'card.datacards';
  return datacards ? storage.setItem(key, datacards, 2 * MINUTES) : storage.getItem(key);
}
datacardsCache.clear = function () {
  storage.removeItem('card.datacards');
};

// export function paymentsCache(payments){
//   var key = 'order.payments';
//   return payments ? storage.setItem(key, payments, WEEK) : storage.getItem(key);
// }

/**
 * 产品Map缓存
 * @param products
 * @returns {返回键值}
 */
export function productsCache(products){
  var key = 'product.map';
  return products ? storage.setItem(key, products, WEEK, true) : storage.getItem(key);
}

/**
 * 产品ID集合缓存
 * @param ids
 * @returns {返回键值}
 */
export function productsIdCache(ids){
  var key = 'product.map.ids';
  return ids ? storage.setItem(key, ids, WEEK) : storage.getItem(key);
}

/**
 * 产品类目缓存
 * @param category
 * @returns {返回键值}
 */
export function productCategoryCache(category) {
  var key = 'product.category.map';
  return category ? storage.setItem(key, category, WEEK, true) : storage.getItem(key);
}

/**
 * 登录信息缓存
 * @param data
 * @returns {返回键值}
 */
export function loginInfoCache(data) {
  var key = 'user.login';
  var old = storage.getItem(key);
  if(data){
    // 存储用户信息的时候要判断一下原先的用户信息,
    // 如果userid不一致， 需要清除所有与用户相关的数据
    if(old && old.userid != data.userid){
      addressCache.clear();
      datacardsCache.clear();
    }
    storage.setItem(key, data, HOURS * 12);
  }else {
    return old;
  }
  // return data ? storage.setItem(key, data, HOURS * 12) : storage.getItem(key);
}

loginInfoCache.clear = function () {
  storage.removeItem('user.login');
}


