import React, {Component, PropTypes} from 'react';
import {List} from 'antd-mobile';
import styles from './AddActionBar.less';

/**
 * 列表形式的添加操作组件
 * @param title
 * @param onClick
 * @returns {XML} React.Element
 * @constructor
 */
export default function AddActionBar({title = '添加', onClick = ()=>console.warn('未绑定onClick事件处理')}) {
  return (
    <List className={styles.addActionBar}>
      <List.Item onClick={onClick}>
        <span>{title}</span>
      </List.Item>
    </List>
  );
}

AddActionBar.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func,
};
