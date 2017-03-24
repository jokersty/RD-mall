import React, {Component, PropTypes} from 'react';
import styles from './Instructions.less';

/**
 * 使用说明组件
 * @param children
 * @returns {XML}
 * @constructor
 */
export default function Instructions({children}) {
  return (
    <div className={styles.component}>
      <h3>使用说明</h3>
      <div>{children}</div>
    </div>
  );
}

Instructions.propTypes = {
  children: PropTypes.node
};
