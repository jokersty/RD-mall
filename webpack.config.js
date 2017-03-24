const fs = require('fs');
const path = require('path');
const pxtorem = require('postcss-pxtorem');

module.exports = function (webpackConfig, env) {

  webpackConfig.plugins.shift();

  webpackConfig.babel.plugins.push('transform-runtime');

  webpackConfig.babel.plugins.push(['antd', {
    style: true,  // if true, use less
    libraryName: 'antd-mobile',
  }]);

  webpackConfig.postcss.push(pxtorem({
    rootValue: 100,
    propWhiteList: [],
  }));

  // Support hmr
  if (env === 'development') {
    webpackConfig.devtool = 'inline-source-map'; // '#eval';
    webpackConfig.babel.plugins.push(['dva-hmr', {
      entries: [],
    }]);
  } else {
    webpackConfig.babel.plugins.push('dev-expression');
  }

  // Support CSS Modules
  // Parse all less files as css module.
  webpackConfig.module.loaders.forEach(function (loader, index) {
    if (typeof loader.test === 'function' && loader.test.toString().indexOf('\\.less$') > -1) {
      loader.include = /node_modules/;
      loader.test = /\.less$/;
    }
    if (loader.test.toString() === '/\\.module\\.less$/') {
      loader.exclude = /node_modules/;
      loader.test = /\.less$/;
    }
    if (typeof loader.test === 'function' && loader.test.toString().indexOf('\\.css$') > -1) {
      loader.include = /node_modules/;
      loader.test = /\.css$/;
    }
    if (loader.test.toString() === '/\\.module\\.css$/') {
      loader.exclude = /node_modules/;
      loader.test = /\.css$/;
    }
    if (loader.test.toString() === '/\\.(png|jpg|jpeg|gif)(\\?v=\\d+\\.\\d+\\.\\d+)?$/i') {
      loader.loader = 'url?limit=2048' + (env === 'development' ? '&name=[path][name].[ext]' : '&name=images/[hash].[ext]');
    }
  });

  // console.log(JSON.stringify(webpackConfig));

  return webpackConfig;
};
