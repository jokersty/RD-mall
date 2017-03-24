/**
 * 数字小于10的前面补0
 * @param num
 * @returns {string}
 */
export function leftPad(num) {
  return num < 10 ? '0' + num : num;
}

/**
 * 获取时间对象的年、月、日、星期、时间戳
 * @param d
 * @returns {{year: number, month: number, date: number, week: number, time: number}}
 */
export function getYearMonthDate(d) {
  var year = d.getFullYear();
  var month = d.getMonth();
  var date = d.getDate();
  var week = d.getDay();
  var time = d.getTime();
  return {year, month, date, week, time};
}
/**
 * 获取时间对象的时、分、秒
 * @param d
 * @returns {{hours: number, minutes: number, seconds: number}}
 */
export function getHoursMinutesSeconds(d){
  var hours = d.getHours();
  var minutes = d.getMinutes();
  var seconds = d.getSeconds();
  return { hours, minutes, seconds};
}

/**
 * 格式化输出时间对象成字符串
 * @param d
 * @param hasTime
 * @returns {string}
 */
export function format(d, hasTime) {
  var {year, month, date} = getYearMonthDate(d);
  if(hasTime){
    var { hours, minutes, seconds} = getHoursMinutesSeconds(d);
    return `${year}-${leftPad(month+1)}-${leftPad(date)} ${leftPad(hours)}:${leftPad(minutes)}:${leftPad(seconds)}`;
  }
  return `${year}-${leftPad(month+1)}-${leftPad(date)}`;
}
