import React, {Component, PropTypes} from 'react';
import {Flex, List} from 'antd-mobile';
import styles from './Address.less';

const Brief = List.Item.Brief;
/**
 * 地址组件
 * @param address
 * @returns {XML} React.Element
 * @constructor
 */
export default function Address({address}) {
  if(address) {
    return (
      <div className={styles.component} data-id={address.id}>
        <Flex>
          <Flex.Item className={styles.consignee}>{address.consignee}</Flex.Item>
          <Flex.Item className={styles.mobile} style={{textAlign: 'right'}}>{address.mobile}</Flex.Item>
        </Flex>
        <Brief>
          {address.defaultaddr ? <strong>[默认]</strong> : null}
          {address.cities.map(c=>
            <span key={['cities', c.type, c.id].join('-')}>{c.name}</span>
          )}
          {<span>{address.address}</span>}
        </Brief>
      </div>
    );
  }
  return (
    <div className={styles.component}>
      添加收件地址
    </div>
  )
}

Address.propTypes = {
  address: PropTypes.object
};

