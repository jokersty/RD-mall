import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import {Button, List, Radio, Flex, Toast, ActivityIndicator, InputItem, TextareaItem, Switch, Modal} from 'antd-mobile';
import Page from '../../components/Page/Page';
import styles from './AddAddress.less';

/**
 * 添加或组件地址页面
 */
@connect((state, {params:{id}})=>({
  cities: state.address.cities,
  newAddr: state.address.newAddr,
  addresses: state.address.addresses,
  item: state.address.addresses && state.address.addresses.length && state.address.addresses.find(ad=>ad.id == id) || null
}))
export default class Add extends Component {

  static propTypes = {
    loading: PropTypes.bool,
    cities: PropTypes.array,
    addresses: PropTypes.array,
  };

  constructor(props) {
    super(...arguments);

    var item = props.item || {defaultaddr: true};
    var cities = item.cities || [];

    this.state = {
      province: cities[0] || '',
      city: cities[1] || '',
      district: cities[2] || '',
      consignee: item.consignee || '',
      mobile: item.mobile || '',
      zipcode: item.zipcode || '',
      address: item.address || '',
      defaultaddr: item ? item.defaultaddr : true
    }
    console.log('this.state', this.state, item);
  }

  componentWillReceiveProps(nextProps) {
    var {location:{query:{type, pid}}, cities} = nextProps;
    if (type == 3 && pid && cities && !cities.length) {
      history.go(-3);
    }
    if (nextProps.newAddr) {
      history.go(-1);
    }
  }

  render() {

    var {history, location:{query:{pid}}, item, addresses, dispatch} = this.props;

    /**
     * 渲染表单组件
     * @returns {XML}
     */
    var renderForm = ()=> {
      /**
       * 提交添加/修改
       */
      var handleSubmit = ()=> {
        const alert = Modal.alert;
        var {province, city, district, consignee, mobile, zipcode, address, defaultaddr} = this.state;
        if (!consignee) {
          alert('提示', '请填写收件人', [{ text: '确定', style: 'default' }]);
          return;
        }
        if (!mobile) {
          alert('提示', '请填写手机号码', [{ text: '确定', style: 'default' }]);
          return;
        }
        if (!zipcode) {
          alert('提示', '请填写邮政编码', [{ text: '确定', style: 'default' }]);
          return;
        }
        if (!province || !city) {
          alert('提示', '请选择所在地区', [{ text: '确定', style: 'default' }]);
          return;
        }
        if (!address) {
          alert('提示', '请填写详细地址', [{ text: '确定', style: 'default' }]);
          return;
        }
        var payload = {
          province: province.id,
          city: city.id,
          district: district && district.id || '',
          mobile: mobile.replace(/ /g, ''),
          country: 1,
          consignee,
          zipcode,
          address,
          defaultaddr,
        };
        if (item && item.id) {
          payload.address_id = item.id;
          dispatch({
            type: 'address/update',
            payload
          });
        } else {
          dispatch({
            type: 'address/add',
            payload
          });
        }
      };
      /**
       * 选择省市区
       */
      var handleClickCity = ()=> {
        this.setState({
          province: '',
          city: '',
          district: '',
        });
        history.push('/addresses/add?pid=1&type=1');
      };

      var {province, city, district, consignee, mobile, zipcode, address, defaultaddr} = this.state;

      return (
        <Page className={styles.page} title="添加收件地址">
          <main>
            <List>
              <InputItem value={consignee}
                         placeholder="请如实填写收件人姓名"
                         clear
                         onChange={v=>this.setState({consignee: v})}
              >收件人</InputItem>
              <InputItem value={mobile}
                         type="phone"
                         placeholder="11位数字中国大陆手机号码"
                         clear
                         onChange={v=>this.setState({mobile: v})}
              >手机号码</InputItem>
              <InputItem value={zipcode}
                         type="number"
                         placeholder="6位数字编码"
                         clear
                         maxLength={6}
                         onChange={v=>this.setState({zipcode: v})}
              >邮政编码</InputItem>
              <List.Item arrow="horizontal" onClick={handleClickCity}>
                <Flex>
                  <label>所在地区</label>
                  <Flex.Item className={styles.area}>
                    {
                      province || city || district ?
                        <span>{[province.name, city.name, district && district.name || ''].join('')}</span>
                        :
                        <span className={styles.placeholder}>省/市/区</span>
                    }
                  </Flex.Item>
                </Flex>
              </List.Item>
              <TextareaItem
                count={100}
                value={address}
                rows={3}
                placeholder="详细地址"
                clear
                onChange={v=>this.setState({address: v})}
              />
            </List>
            <List>
              <List.Item
                extra={<Switch
                  checked={defaultaddr}
                  onChange={v=>this.setState({defaultaddr: v})}
                />}
              >设置默认收货地址</List.Item>
            </List>
          </main>
          <footer>
            <Button type="primary" onClick={handleSubmit}>保存</Button>
          </footer>
        </Page>
      );
    };
    /**
     * 渲染省市区
     * @returns {XML}
     */
    var renderSelectProvinceCityArea = ()=> {
      const {cities} = this.props;
      return (
        <Page title="请选择区域">
          {
            cities ?
              <List className={styles.cities}>
                {
                  cities.length ? cities.map((c, index)=>
                    <List.Item arrow="horizontal" key={'cities-' + c.type + '-' + c.id + '-' + index} onClick={()=> {
                      switch (c.type + '') {
                        case '1':
                          this.setState({
                            province: c
                          });
                          history.push('/addresses/add?pid=' + c.id + '&type=' + (c.type + 1));
                          break;
                        case '2':
                          this.setState({
                            city: c
                          });
                          history.push('/addresses/add?pid=' + c.id + '&type=' + (c.type + 1));
                          break;
                        case '3':
                          this.setState({
                            district: c
                          });
                          history.go(-3);
                      }
                    }}>{c.name}</List.Item>
                  )
                    :
                    <List.Item>暂未支持地区</List.Item>
                }
              </List>
              :
              <ActivityIndicator size="large" toast text="正在加载"/>
          }
        </Page>
      );
    };
    // 存在pid 就是选择省市区，否则就是显示表单
    return pid ? renderSelectProvinceCityArea() : renderForm();
  }
}
