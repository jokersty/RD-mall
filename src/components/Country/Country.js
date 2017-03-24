import React, {Component, PropTypes} from 'react';
import QueryString from  'qs';
import {Flex, List, SearchBar} from 'antd-mobile';
import  {money, hasClass} from '../../utils/function';
import CharIndex from '../CharIndex/CharIndex';
import styles from './Country.less';


/**
 * 国家选择控件
 */
export default class Country extends Component {
  static propTypes = {
    areas: PropTypes.object,    // 国家MAP
    history: PropTypes.object,  // 浏览历史
    location: PropTypes.object, // 页面地址
    onChange: PropTypes.func    // 值改变的时候回调
  };

  constructor(props) {
    super(...arguments);
    var {areas = {}} = props;
    var pinyinKeys = Object.keys(areas.pinyinMap || {}); //应该在这里生成拼音字母
    this.state = {
      pinyinKeys,
      search: ''      //初始化的时候搜索关键字为空
    }
  }

  render() {
    var {areas, history, location, onChange} = this.props;
    var {pinyinKeys, search} = this.state;
    var continents = areas && areas.continents || null;
    var continentId = location.query.continentId;
    var lis = [styles.continent, styles.country].join(' ');
    var continent, countrys, searchResult;

    /**
     * 查找元素指定类名的祖先元素
     * @param ele DOM Element
     */
    var parentElement = ele => hasClass(ele, lis) ? ele : (hasClass(ele, styles.main) ? null : parentElement(ele.parentElement));
    /**
     * 设置搜索关键字
     * @param value
     */
    var setSearchValueToState = value => this.setState({search: value});
    /**
     * 清空搜索关键字
     */
    var clearSearchValue = ()=> this.setState({search:''});
    /**
     * 点击国家选项的事件处理
     * @param e
     */
    var handleClick = e => {
      var ele = parentElement(e.target);
      if (ele) {
        var id = ele.getAttribute('data-id');
        var pa = areas.all[id];
        if (pa.isContinent && !continentId) {
          history.push(location.pathname + '?' + QueryString.stringify({...location.query, continentId: id}));
        } else {
          onChange && onChange(pa);
        }
      }
    };
    // 如果大洲ID存在, 则只显示所属大洲的国家
    if (continentId) {
      continent = areas.all[continentId];
      countrys = areas.countrys.filter(c=>c.continent == continent.value);
    }
    // 如果搜索关键字存在, 则只显示与关键字相关的国家地区或大洲
    if (search) {
      searchResult = areas.continents.filter(c=>c.value.indexOf(search) != -1);
      searchResult = searchResult.concat(areas.countrys.filter(c=>c.pinyin.indexOf(search) != -1 || c.value.indexOf(search) != -1));
    }

    return (
      <section className={styles.component}>
        {
          continentId ?
            null
            :
            <SearchBar
              value={this.state.search}
              placeholder="搜索-输入拼音首字母或中文"
              showCancelButton={false}
              onSubmit={setSearchValueToState}
              onClear={clearSearchValue}
              onChange={setSearchValueToState}
            />
        }
        <main className={styles.main} onClick={handleClick}>
          {
            searchResult ?
              <List title="搜索结果" className={styles.searchResult}>
                {
                  searchResult.length ?
                    searchResult.map(c=> {
                      return c.isContinent ?
                        <ContinentItem continent={c} key={'country-' + c.id} currency={true}/>
                        :
                        <CountryItem country={c} key={'country-' + c.id}/>
                    })
                    :
                    <List.Item>对不起，暂未支持此区域！</List.Item>
                }
              </List>
              : null
          }
          {
            continentId ?
              <List className={styles.leyel2}>
                {
                  continent ?
                    <ContinentItem continent={continent} key={'country-' + continent.id} currency={true}/>
                    :
                    null
                }
                {
                  countrys && countrys.length ?
                    countrys.map(country=>
                      <CountryItem country={country} key={'country-' + country.id}/>
                    )
                    :
                    null
                }
              </List>
              :
              <div>
                {
                  continents && continents.length ?
                    <List renderHeader={()=>'大洲'} className={styles.continents}>
                      {
                        continents.map(cont=>
                          <ContinentItem continent={cont} key={'country-' + cont.id}/>
                        )
                      }
                    </List>
                    :
                    null
                }
                {
                  pinyinKeys.map(py=>
                    <div ref={'pinyin' + py} key={'pinyin-' + py}>
                      <List renderHeader={()=>py}>
                        {
                          areas && areas.pinyinMap[py].map(country=>
                            <CountryItem country={country} key={'country-' + country.id}/>
                          )
                        }
                      </List>
                    </div>
                  )
                }
              </div>
          }
        </main>
        <div className={styles.charIndexContainer}>
          <Flex style={{height: '100%'}} direction="column" justify="center" >
            <CharIndex keys={this.state.pinyinKeys}
                       onChange={(k)=> {
                         const ele = this.refs['pinyin' + k];
                         var Y = ele.getBoundingClientRect().top + window.scrollY;
                         window.scrollTo(0, Y);
                       }}/>
          </Flex>
        </div>
      </section>
    );
  }
}
/**
 * 国家选项
 * @param country
 * @returns {XML}
 * @constructor
 */
function CountryItem({country}) {
  return (
    <div className={styles.country}
         key={'country-' + country.id}
         data-id={country.id}>
      <List.Item arrow="horizontal"
                 thumb={country.img}
                 extra={money(country.price * 100).join('.') + '元/天'}>
        {country.value}
      </List.Item>
    </div>
  );
}
CountryItem.propTypes = {
  country: PropTypes.object
};
/**
 * 大洲选项
 * @param continent
 * @param currency
 * @returns {XML}
 * @constructor
 */
function ContinentItem({continent, currency}) {
  return (
    <div className={currency ? styles.continent : styles.country}
         key={'country-' + continent.id}
         data-id={continent.id}>
      <List.Item arrow="horizontal"
                 thumb={continent.img}
                 extra={money(continent.price * 100).join('.') + '元/天'}>
        {continent.value + (currency ? '通用' : '')}
        {currency ? <sub>(支持以下国家/地区)</sub> : null}
      </List.Item>
    </div>
  );
}
ContinentItem.propTypes = {
  continent: PropTypes.object,
  currency: PropTypes.bool,
};





