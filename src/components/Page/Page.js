import React, {Component, PropTypes} from 'react';

/**
 * 页面组件
 */
export default class Page extends Component {
  /**
   * 组件挂载后绑定滚动事件  [这种图片懒加载必须对首屏的图片要人工保证其不使用data-src]
   */
  // componentDidMount() {
  //   if (!this._scrollLoad) {
  //     var load = ()=> {
  //       var baseLine = window.scrollY + window.innerHeight * 1.5;
  //       var imgs = document.querySelectorAll('img[data-src]');
  //       if(imgs && imgs.length){
  //         for(var i=0, len=imgs.length;i<len; i++){
  //           var img = imgs[i];
  //           if (img.getBoundingClientRect().top < baseLine) {
  //             img.src = img.getAttribute('data-src');
  //             img.removeAttribute('data-src');
  //             console.log('加载图片：' + img.src);
  //           }
  //         }
  //       }
  //     };
  //     this._scrollLoad = ()=> {
  //       this.__scrollLoadId && clearTimeout(this.__scrollLoadId);
  //       this.__scrollLoadId = setTimeout(load, 300);
  //     };
  //     window.addEventListener('scroll', this._scrollLoad);
  //     setTimeout(load, 0);
  //   }
  // }

  /**
   * 组件卸载后解绑滚动事件
   */
  // componentWillUnmount() {
  //   this._scrollLoad && window.removeEventListener('scroll', this._scrollLoad);
  //   delete this._scrollLoad;
  // }

  /**
   * 渲染组件
   * @returns {XML}
   */
  render() {
    var {title, children, className} = this.props;

    if (title && window.document.title != title) { //只在标题不相同的时候设置
      window.document.title = title;
    }
    return (
      <section className={className}>
        {children}
      </section>
    );
  }

  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.any,
    className: PropTypes.string,
  }
}

