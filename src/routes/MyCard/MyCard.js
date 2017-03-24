import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Button, List, Radio, Flex, Toast, ActivityIndicator, InputItem} from 'antd-mobile';
import styles from './MyCard.less';

/*****
 * 已经废弃
 */

@connect(state=>({
  datacards: state.card.datacards || [],
  servicepackages: state.voice.servicepackages || []
}))
export default class MyCard extends Component {
  constructor() {
    super(...arguments);
  }

  render() {
    const {datacards, servicepackages} = this.props;
    const banner = <img src={require('./images/banner.jpg')}/>;

    return (
      <section className={styles.page}>
        {
          datacards.length ?
            <div>
              <header>
                {banner}
                <div className="desc">剩余使用时间：2天</div>
              </header>
              <main>
                {
                  datacards.map(card=>
                    <List key={'card-' + card.iccid}>
                      <List.Item thumb={require('./images/icon-card.png')}><label>全球卡号：</label>{card.iccid}</List.Item>
                      <List.Item thumb={require('./images/flow.png')}>
                        <Flex className="service-package">
                          <label>流量套餐：</label>
                          <Flex.Item>
                            {
                              (()=> {
                                var ret = servicepackages.filter(pk=>pk.iccid == card.iccid).map((pk, index)=>
                                  <li key={'servicepackage-' + pk.iccid + '-' + index}>
                                    <span>{pk.areaname}</span>
                                    <span>{pk.effect_datetime.split(' ')[0]}</span>
                                    <span>至</span>
                                    <span>{pk.failure_datetime.split(' ')[0]}</span>
                                  </li>
                                );
                                return ret.length ? <ul >{ret}</ul> : '暂无任何流量套餐';
                              })()
                            }
                          </Flex.Item>
                        </Flex>
                      </List.Item>
                    </List>
                  )
                }

              </main>
            </div>
            :
            <div className={styles.null}>
              {banner}
              <p>您还没有络漫全球卡</p>
              <Link className={styles.create} to="/my-card/add">立即添加</Link>
            </div>
        }
      </section>
    );
  }
}

