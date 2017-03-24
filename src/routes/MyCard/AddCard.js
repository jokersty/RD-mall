import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Button, List, Radio, Flex, Toast, ActivityIndicator, InputItem} from 'antd-mobile';
import native from '../../services/native';
import Page from '../../components/Page/Page';
import styles from './AddCard.less';

/**
 * 绑定全球卡页面
 */
@connect()
export default class AddCard extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      card: ''
    }
  }

  render() {
    /**
     * 绑定卡
     */
    var handleSubmit = ()=> {
      if(this.state.card) {
        this.props.dispatch({
          type: 'card/bind',
          payload: {
            datacardid: this.state.card
          }
        });
      }else{
        Toast.fail('卡号不能为空！');
      }
    };
    /**
     * 扫码输入卡号
     */
    var handleSaoma = () => {
      native.goScanCode(card=> {
        this.setState({card});
      });
    };
    return (
      <Page className={styles.page} title="添加全球卡">
        <div className={styles.banner}>
          <img src={require('./images/add-banner.jpg')}/>
        </div>
        <List>
          <InputItem placeholder="扫描或输入全球卡背后的ICCID"
                     maxLength={25}
                     extra={<img src={require('./images/saoma.png')}/>}
                     value={this.state.card}
                     onChange={v=>this.setState({card: v})}
                     onExtraClick={handleSaoma}
          >
            <img src={require('./images/icon-card.png')}/>
          </InputItem>
        </List>
        <footer>
          <Button type="primary" onClick={handleSubmit}>添 加</Button>
        </footer>
      </Page>
    );
  }
}
