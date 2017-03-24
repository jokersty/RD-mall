import React, {Component, PropTypes} from 'react';
import {Flex, Card, Grid} from 'antd-mobile';
import styles from './Calendar.less';
import {leftPad, getYearMonthDate} from '../../utils/date';

/**
 * 月份对应的天数，在使用前先判断年份是否闰年
 * @type {number[]}
 */
const DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
/**
 * 星期对应的中文
 * @type {string[]}
 */
const WEEK = ['日', '一', '二', '三', '四', '五', '六'];


export default class Calendar extends Component {
  static propTypes = {
    /**
     * 开始时间
     */
    start: PropTypes.object,
    /**
     * 结束时间
     */
    end: PropTypes.object,
    /**
     * 值改变时的回调方法
     */
    onChange: PropTypes.func
  };

  constructor(props) {
    super(...arguments);

    var now = new Date(); // 当前时间
    var today = getYearMonthDate(new Date(now.getFullYear(), now.getMonth(), now.getDate())); // 今天
    var start = props.start && props.start.getTime && props.start.getTime(); // 开始时间戳
    var end = props.end && props.end.getTime && props.end.getTime() || start; //结束时间戳

    var startYearMonth = getYearMonthDate(new Date(start ? Math.min(today.time, start) : today.time)); //开始的年月日

    var dates = [];

    //初始化半年的日历
    for (let i = 0; i < 6; i++) {
      dates.push(startYearMonth);
      startYearMonth = increaseMonth(startYearMonth);
    }

    this.state = {
      dates,
      start,
      end,
      today
    };

    this.__scrollLoadId = null;
  }

  /**
   * 组件挂载后添加滚动事件绑定
   */
  componentDidMount() {
    if (!this._scrollLoad) {
      this._scrollLoad = ()=> {
        this.__scrollLoadId && clearTimeout(this.__scrollLoadId);
        this.__scrollLoadId = setTimeout(()=> {
          if (this.refs.element && window.scrollY + window.innerHeight * 1.5 > this.refs.element.clientHeight) {
            let date = this.state.dates[this.state.dates.length - 1];
            for (let i = 0; i < 3; i++) {
              date = increaseMonth(date);
              this.state.dates.push(date)
            }
            this.setState({dates: this.state.dates});
          }
        }, 300);
      };
      window.addEventListener('scroll', this._scrollLoad);
    }
  }

  /**
   * 组件卸载后解除滚动事件绑定
   */
  componentWillUnmount() {
    this._scrollLoad && window.removeEventListener('scroll', this._scrollLoad);
    delete this._scrollLoad;
  }

  /**
   * 处理日历上日期的点击事件
   * @param time
   * @param className
   */
  handleClick({date:{time}, className}) {
    if (className == styles.disabled) {
      return;
    }
    const {start, end} = this.state;
    if (!start) {
      this.setState({start: time});
    } else if (!end) {
      if (time < start) {
        this.setState({start: time});
      } else {
        this.setState({end: time});
        if (this.props.onChange) {
          this.props.onChange({
            start: new Date(this.state.start),
            end: new Date(time)
          });
        }
      }
    } else if (start && end) {
      this.setState({start: time, end: 0});
    }
  }

  /**
   * 渲染组件
   * @returns {XML}
   */
  render() {
    const {today, start, end, dates} = this.state;
    return (
      <div ref="element" className={styles.Calendar}>
        <header>
          <Flex className={styles.week}>
            {
              WEEK.map((w, index)=>
                <Flex.Item key={'week-' + index} data-week={index}>{w}</Flex.Item>
              )
            }
          </Flex>
        </header>
        <section>
          {
            dates.map(date=>
              <YearMonth key={[date.year, date.month + 1].join('-')}
                         date={date} today={today} start={start} end={end || start}
                         handleClick={this.handleClick.bind(this)}
              />
            )
          }
        </section>
        <footer>正在加载...</footer>
      </div>
    );
  }
}

/**
 * 月份组件
 * @param year
 * @param month
 * @param today
 * @param start
 * @param end
 * @param handleClick
 * @returns {XML} React.Element
 * @constructor
 */
function YearMonth({date:{year, month}, today, start, end, handleClick}) {
  DAYS[1] = isLeapYear(year) ? 29 : 28;
  var days = DAYS[month];
  var week = (new Date(year, month, 1)).getDay();
  var items = [];
  for (var i = 0; i < week; i++) {
    items.push(null);
  }
  for (var i = 1; i <= days; i++) {
    var d = getYearMonthDate(new Date(year, month, i));
    var c = [];
    if (i == 1) { //每月第一天
      c.push(styles.monthFirst);
    }
    if (i == days) { //每月最后一天
      c.push(styles.monthEnd)
    }
    if (d.time < today.time) { //过去的时间
      c.push(styles.disabled);
    }
    if (d.time == today.time) { //今天
      c.push(styles.today);
    }
    if (d.time == start) { //起始时间
      c.push(styles.regionBegin);
    }
    if (d.time >= start && d.time <= end) { //区间内的时间
      c.push(styles.region);
    }
    if (d.time == end) { //结束时间
      c.push(styles.regionEnd);
    }

    items.push({
      date: d,
      className: c.join(' ')
    });
  }

  return (
    <Card full>
      <Card.Header title={year + '年' + (month + 1) + '月'}/>
      <Card.Body>
        <Grid data={items}
              columnNum={7}
              hasLine={false}
              onClick={handleClick}
              renderItem={(item, index)=> item ? <Item {...item} /> :
                <span key={[year, month + 1, index].join('-')}/>}/>
      </Card.Body>
    </Card>
  )
}
YearMonth.propTypes = {
  date: PropTypes.object,
  today: PropTypes.object,
  start: PropTypes.number,
  end: PropTypes.number,
  handleClick: PropTypes.func
};
/**
 * 日期组件
 * @param date
 * @param className
 * @returns {XML} React.Element
 * @constructor
 */
function Item({date, className}) {
  var value = [date.year, leftPad(date.month + 1), leftPad(date.date)].join('-');
  return (
    <div className={[styles.item, className].join(' ')}
         data-year={date.year}
         data-month={date.month}
         data-date={date.date}
         data-week={date.week}
         data-value={value}
    ><span>{date.date}</span></div>
  );
}
Item.propTypes = {
  date: PropTypes.object,
  className: PropTypes.string
};

/**
 * 判断是否为闰年
 * @param year 年份
 * @returns {boolean}
 */
function isLeapYear(year) {
  return !!((!(year % 4)) && (year % 100)) || (!(year % 400));
}

/**
 * 下一个月
 * @param year 年份
 * @param month 月份
 * @returns {{year, month, date, week, time}|{year: number, month: number, date: number, week: number, time: number}}
 */
function increaseMonth({year, month}) {
  const d = month < 11 ? new Date(year, month + 1) : new Date(year + 1, 0);
  return getYearMonthDate(d);
}
