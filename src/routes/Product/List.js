import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Button, Grid, List, Radio, Flex, ActivityIndicator, Stepper, Popup} from 'antd-mobile';
import Page from '../../components/Page/Page';
import styles from './List.less';

/**
 * 产品列表页面， 目前只应用于专属号
 * @param products  所有产品Map
 * @param cid       产品类目ID
 * @param loading   加载状态
 * @returns {XML}
 * @constructor
 */
function ProductList({products, params:{cid}, loading}) {

  if (loading) {
    return (<Page title="正在加载..."><ActivityIndicator size="large" toast text="正在加载"/></Page>);
  }

  var list = [];

  // 生成产品列表
  products && Object.keys(products).forEach(id=> {
    list.push(products[id]);
  });

  // 过虑，选取指定的类目的产品
  if (cid) {
    list = list.filter(p=> p.categoryid == cid);
  }
  return (
    <Page title="专属云号码">
      <Grid className={styles.grid} data={list} columnNum={2} hasLine={true} renderItem={item=><Product item={item}/>}/>
    </Page>
  );
}
ProductList.propTypes = {
  products: PropTypes.object,
  loading: PropTypes.bool,
};

export default connect(state=>({
  products: state.product.map,
  loading: state.product.loading,
}))(ProductList);

/**
 * 产品组件
 * @param item
 * @returns {XML}
 * @constructor
 */
function Product({item}) {
  return (
    <Link to={'/products/' + item.categoryid + '/' + item.id}>
      <div className={styles.item}>
        <Flex className="item-icon">
          <img src={item.image}/>
        </Flex>
        <h3>{item.name}</h3>
        <h4>{item.subname}</h4>
      </div>
    </Link>
  );
}
Product.propTypes = {
  item: PropTypes.object
};
