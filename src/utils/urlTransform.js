/**
 * 图片相对地址转换成绝对地址
 * @param src
 * @returns {*}
 */
export function imageSrcTransform (src) {
  if(/^images\//gi.test(src)){
    return 'https://www.roam-tech.com/roammall/'+src;
  }
  return src;
}
