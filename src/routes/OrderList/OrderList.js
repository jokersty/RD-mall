import React, {Component, PropTypes} from 'react';
import { connect } from 'dva';
import styles from './OrderList.less';
import Page from '../../components/Page/Page';
import {Button, List, Radio, Flex, ActivityIndicator, Stepper, Popup, Grid, Carousel, ListView } from 'antd-mobile';
import OrderItem from '../../components/OrderItem/OrderItem';
import {getMyOrderList} from '../../services/index';

@connect((state)=> {
  return {
    orders:state.order.orders,
    loading:state.order.loading
  }
})
export default class OrderList extends Component {
  constructor(props){
    super(props);
    this.state={
      pageIndex:0,
      bottom:false
    }
    this.__scrollLoadId = null;
    this.__scrollLoadItem =null;
  }
  componentDidMount() {
    if (!this._scrollLoad) {

      this._scrollLoad = ()=> {
        this.__scrollLoadId && clearTimeout(this.__scrollLoadId);
        this.__scrollLoadId = setTimeout(()=> {
          // if ( window.scrollY ==0 ) { //下拉刷新
          //   setTimeout(()=> {
          //     this.refs.header.style.display = "block";
          //     location.reload();
          //   },1000)
          // }


          if (this.refs.element && window.scrollY + window.innerHeight * 1.5 > this.refs.element.clientHeight) { //上拉加载更多
            var pageIndex = this.state.pageIndex;
            var bool = false;
            pageIndex = pageIndex+1;
            getMyOrderList({pageIndex: pageIndex, pageSize: 10}).then(data => {
              for (var i = 0; i < 10; i++) {
                if(!data.data.orders[i]){
                  bool=true;
                  break
                }
                const orders = data.data.orders[i];
                this.props.orders.push(orders);
              }
              this.state.bottom = bool;
              bool=false;
              this.setState({pageIndex:pageIndex});
            })
          };

          var _content = this.refs.element;
          if(_content){
            var flag = true;
            var slideDown1 = this.refs.slideDown1,
              slideDown2 = this.refs.slideDown2;
            //第一步：下拉过程
            function slideDownStep1(dist,slideDown1,slideDown2) { // dist 下滑的距离，用以拉长背景模拟拉伸效果
              slideDown2.style.display = "none";
              slideDown1.style.display = "block";
              slideDown1.style.height = (parseInt("20px") - dist) + "px";
            }
            //第二步：下拉，然后松开，
            function slideDownStep2(slideDown1,slideDown2) {
              slideDown1.style.display = "none";
              slideDown1.style.height = "20px";
              slideDown2.style.display = "block";
              //刷新数据

            }
            //第三步：刷新完成，回归之前状态
            function slideDownStep3(slideDown1,slideDown2) {
              slideDown1.style.display = "none";
              slideDown2.style.display = "none";
              flag = true;
              location.reload();
            }

            //下滑刷新调用
            k_touch("content", "y",_content);
            //contentId表示对其进行事件绑定，way==>x表示水平方向的操作，y表示竖直方向的操作
            function k_touch(contentId, way,_content) {
              var _start = 0,
                _end = 0;
              _content.addEventListener("touchstart", touchStart, false);
              _content.addEventListener("touchmove", touchMove, false);
              _content.addEventListener("touchend", touchEnd, false);

              function touchStart(event) {
                //var touch = event.touches[0]; //这种获取也可以，但已不推荐使用
                if(!flag) {
                  return false;
                }
                var touch = event.targetTouches[0];
                if(way == "x") {
                  _start = touch.pageX;
                } else {
                  _start = touch.pageY;
                }
              }

              function touchMove(event) {
                if(!flag) {
                  return false;
                }
                var touch = event.targetTouches[0];
                if(way == "x") {
                  _end = (_start - touch.pageX);
                } else {
                  _end = (_start - touch.pageY);
                  // console.log(_end,_start,window.scrollY)
                  //下滑才执行操作
                  if(_end < 0 && window.scrollY==0) {
                    slideDownStep1(_end,slideDown1,slideDown2);
                  }
                }

              }

              function touchEnd(event) {
                if(flag) {
                  flag = false;
                } else {
                  return false;
                }
                if(_end > 0) {
                  // console.log("左滑或上滑  " + _end);
                }
                if(_end < 0 && window.scrollY==0){
                  // console.log("右滑或下滑" + _end);
                  slideDownStep2(slideDown1,slideDown2);
                  //刷新成功则
                  //模拟刷新成功进入第三步
                  setTimeout(function() {
                    slideDownStep3(slideDown1,slideDown2);
                  }, 600);
                }
              }
            }
          }
        }, 300);
      };
      window.addEventListener('scroll', this._scrollLoad, false);
      this.__scrollLoadItem && clearTimeout(this.__scrollLoadItem);
      this.__scrollLoadItem = setTimeout(()=>{
        var _content = this.refs.element;
        if(_content) {
          var flag = true;
          var slideDown1 = this.refs.slideDown1,
            slideDown2 = this.refs.slideDown2;

          function slideDownStep1(dist, slideDown1, slideDown2) { // dist 下滑的距离，用以拉长背景模拟拉伸效果
            slideDown2.style.display = "none";
            slideDown1.style.display = "block";
            slideDown1.style.height = (parseInt("20px") - dist) + "px";
          }

          //第二步：下拉，然后松开，
          function slideDownStep2(slideDown1, slideDown2) {
            slideDown1.style.display = "none";
            slideDown1.style.height = "20px";
            slideDown2.style.display = "block";

          }

          //第三步：刷新完成，回归之前状态
          function slideDownStep3(slideDown1, slideDown2) { //这一步是不需要的
            slideDown1.style.display = "none";
            slideDown2.style.display = "none";
            flag = true;
            location.reload();
          }

          //下滑刷新调用
          k_touch("content", "y", _content);
          var flag = true;
          //contentId表示对其进行事件绑定，way==>x表示水平方向的操作，y表示竖直方向的操作
          function k_touch(contentId, way, _content) {
            var _start = 0,
              _end = 0;
            _content.addEventListener("touchstart", touchStart, false);
            _content.addEventListener("touchmove", touchMove, false);
            _content.addEventListener("touchend", touchEnd, false);
            function touchStart(event) {
              //var touch = event.touches[0]; //这种获取也可以，但已不推荐使用
              if (!flag) {
                return false;
              }
              var touch = event.targetTouches[0];
              if (way == "x") {
                _start = touch.pageX;
              } else {
                _start = touch.pageY;
              }
            }

            function touchMove(event) {
              if (!flag) {
                return false;
              }
              var touch = event.targetTouches[0];
              if (way == "x") {
                _end = (_start - touch.pageX);
              } else {
                _end = (_start - touch.pageY);
                //下滑才执行操作
                if (_end < 0 && window.scrollY==0) {
                  slideDownStep1(_end, slideDown1, slideDown2);
                }
              }

            }

            function touchEnd(event) {
              if (flag) {
                flag = false;
              } else {
                return false;
              }
              if (_end >= 0) {
                // console.log("左滑或上滑  " + _end);
              }
              if(_end < 0 && window.scrollY==0){
                // console.log("右滑或下滑" + _end);
                slideDownStep2(slideDown1, slideDown2);
                //刷新成功则
                //模拟刷新成功进入第三步
                setTimeout(function () {
                  slideDownStep3(slideDown1, slideDown2);
                }, 600);
              }
            }
          }
        }
      },300);
      window.addEventListener('scroll',this.__scrollLoadItem,false);
    }
  }

  render(){
    let {orders,loading} = this.props;
    let {bottom} =this.state;
    if (orders == null) {
      orders = [];
    }
    return (
      <Page className={styles.page} title="我的订单" >
        <section>
        {
          orders && orders.length ?
            <div ref="element" className={styles.content}>
              <div className={styles.header} ref="slideDown1">松开刷新</div>
              <div className={styles.header} ref="slideDown2">刷新中...</div>
              <List>
                {
                  orders.map((order) =>
                    <OrderItem order={order} key={order.id}/>
                  )
                }
              </List>
              {
                !!bottom ?
                  <footer>已经是最后一页了...</footer>
                  :
                  <footer>加载更多...</footer>
              }
            </div>
            :
            <div className={styles.null}>
              <p>您还未购买任何产品</p>
            </div>
        }
        {/*{*/}
        {/*!!loading ?*/}
        {/*<ActivityIndicator size="large" toast text="正在加载"/>*/}
        {/*:*/}
        {/*null*/}
        {/*}*/}
        </section>
      </Page>
    );
  }
}













