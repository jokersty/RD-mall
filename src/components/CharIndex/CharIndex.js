import React, {Component, PropTypes} from 'react';
import {Flex} from 'antd-mobile';
import styles from './CharIndex.less';

/**
 * 字母定位
 * @param keys
 * @param onChange
 * @returns {XML}
 * @constructor
 */
export default function CharIndex({keys, onChange}) {
  const handleClick = (e)=> {
    const key = e.target.innerText;
    if (keys.indexOf(key) !== -1) {
      onChange(key);
    } else {
      window.scrollTo(0, 0);
    }
  };
  return (
    <Flex className={styles.component} onClick={handleClick} direction="column" align="stretch">
      <Flex.Item className={styles.search} />
      {
        keys.map(key=>
          <Flex.Item key={'char-' + key}>{key}</Flex.Item>
        )
      }
    </Flex>
  );
}

CharIndex.propTypes = {
  keys: PropTypes.array,
  onChange: PropTypes.func
};

