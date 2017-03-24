import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Button, List, Radio, Flex, ActivityIndicator, Stepper, Popup, Grid, Carousel} from 'antd-mobile';
import Page from '../../components/Page/Page';
import styles from './Home.less';

/**
 * 首页页面
 * @param banner
 * @param sales
 * @returns {XML}
 * @constructor
 */
function Home({banners, products, loading, history}) {
  var openLink = (link)=> {
    if (link) {
      if (link.indexOf('http') > -1) {
        window.location = link;
      } else {
        history.push(link);
      }
    }
  }

  return (
    <Page title="RD商城">
      {
        banners && banners.length ?
          <div className={styles.banner}>
            {
              banners.length > 1 ?
                <Carousel dots={true} autoplay={true} infinite={true}>
                  {
                    banners && banners.map(banner=>
                      <Link onClick={()=>openLink(banner.url)} key={'banner-' + banner.id}>
                        <img src={banner.logo}/>
                      </Link>
                    )
                  }
                </Carousel>
                :
                <Link onClick={()=>openLink(banners[0].url)} key={'banner-' + banners[0].id}>
                  <img src={banners[0].logo}/>
                </Link>
            }
          </div>
          :
          null
      }
      <div className={styles.sales}>
        {
          products.map((data, index)=>
            data.items && data.items.length ?
              <section key={index} className={data.location}>
                {
                  data.icon || data.title ?
                    <header>
                      {data.icon ? <img src={data.icon}/> : null}
                      {data.title}
                    </header>
                    :
                    null
                }
                <Grid data={data.items} columnNum={data.columnNum} hasLine={true} renderItem={(item, itemIndex)=>
                  <Link to={item.url}>
                    <div className={['sale', item.location, [item.location, item.id].join('-')].join(' ')}>
                      <Flex className="sale-icon">
                        <img src={item.logo}/>
                      </Flex>
                      <h3>{item.name}</h3>
                      <h4>{item.description}</h4>
                    </div>
                  </Link>
                }/>

              </section>
              :
              null
          )
        }
      </div>

      <Link to="/order-list">
        <h1>我的订单</h1>
      </Link>
      {
        !!loading ?
          <ActivityIndicator size="large" toast text="正在加载"/>
          :
          null
      }
    </Page>
  );
}

Home.propTypes = {
  loading: PropTypes.bool,
  banner: PropTypes.object,
  sales: PropTypes.array,
};

/**
 * 链接到首页的数据
 */
export default connect((state)=>({
  loading: state.home.loading,
  banners: state.home.homepages.banners,
  products: (()=> {
    var products = [...state.home.homepages.products || []];
    var travalroutes = state.home.homepages.travalroutes || [];
    var p_ys = products.length % 3;
    var row_count = Math.floor(products.length / 3);
    var products_row = products.splice(0, 3 * row_count);
    return [
      {
        title: '全球流量/语音',
        icon: require('./images/icon-flow.png'),
        columnNum: 3,
        location: 'products',
        items: products_row
      },
      {
        columnNum: p_ys,
        location: 'products',
        items: products
      },
      {
        title: '精选旅行线路',
        icon: require('./images/icon-tour.png'),
        columnNum: 2,
        location: 'travalroutes',
        items: travalroutes
      }
    ];
  })(),

  banner: {
    link: '',
    img: require('./images/banner.jpg')
  },

}))(Home)


// sales: (()=> {
//   return [
//     {
//       title: '全球流量/语音',
//       icon: require('./images/icon-flow.png'),
//       columnNum: 3,
//       items: [
//         {
//           img: require('../Product/images/flow.png'),
//           title: '全球上网流量',
//           price: '19.90元起',
//           link: '/products/2/2'
//         },
//         {
//           img: require('../Product/images/timelength.png'),
//           title: '全球通话时长',
//           price: '0.10元/分钟',
//           link: '/products/3/3'
//         },
//         {
//           img: require('../Product/images/number.png'),
//           title: '专属云号码',
//           price: '1.90元/天',
//           link: '/products/4'
//         }
//       ]
//     },
//     {
//       columnNum: 2,
//       items: [
//         {
//           img: require('./images/card.jpg'),
//           title: '络漫全球卡',
//           price: '99.00元',
//           link: '/products/1/1'
//         },
//         {
//           img: require('./images/romabao.png'),
//           title: '络漫宝',
//           price: '299.00元',
//           link: ''
//         }
//       ]
//     },
//     {
//       title: '精选旅行线路',
//       icon: require('./images/icon-tour.png'),
//       columnNum: 2,
//       items: [
//         {
//           img: require('./images/tour-1.jpg'),
//           title: '上海-日本往返豪华游轮',
//           price: '1999.00元',
//           link: ''
//         },
//         {
//           img: require('./images/tour-2.jpg'),
//           title: '美国西海岸7日游',
//           price: '9999.00元',
//           link: ''
//         },
//         {
//           img: require('./images/tour-1.jpg'),
//           title: '上海-日本往返豪华游轮',
//           price: '1999.00元',
//           link: ''
//         },
//         {
//           img: require('./images/tour-2.jpg'),
//           title: '美国西海岸7日游',
//           price: '9999.00元',
//           link: ''
//         },
//       ]
//     }
//   ];
// })(state),


/*
 {
 sales.map((data, index)=>
 <section key={index} className={['sale-list', index].join('-')}>
 {
 data.icon || data.title ?
 <header>
 {data.icon ? <img src={data.icon}/> : null}
 {data.title}
 </header>
 :
 null
 }
 <Grid data={data.items} columnNum={data.columnNum} hasLine={true} renderItem={(item, itemIndex)=>
 <Link to={item.link}>
 <div className={['sale', ['sale', index, itemIndex].join('-')].join(' ')}>
 <Flex className="sale-icon">
 <img src={item.img}/>
 </Flex>
 <h3>{item.title}</h3>
 <h4>{item.price}</h4>
 </div>
 </Link>
 }/>
 </section>
 )
 }
 */
