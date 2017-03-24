# 络漫APP商城 项目重构

### 项目开发环境：
 
 node 5.10.1
 npm 3.8.3
 
 建议`npm install`使用`cnpm install`安装项目依赖
 
### 项目中使用的框架

 项目使用 [dva-cli](https://github.com/dvajs/dva-cli) 脚手架创建
 
 ```
 $ npm install -g dva-cli
 
 $ mkdir myApp && cd myApp
 $ dva init
 ```
 
 项目使用[dvajs](https://github.com/dvajs/dva), 包含:React + ES6 + LESS + [Redux-saga](http://leonshi.com/redux-saga-in-chinese/index.html)，使用atool-build[](https://ant-tool.github.io/atool-build.html)构建工具
 
### 下载源代码后执行
 ```
 npm install
 
 npm start // 开发模式下
 
 npm run build && gulp  // 构建生产环境代码
 
 ```
 其中`gulp`是处理将atool-build构建的代码html文件中的CSS 与 JS 文件链接去除，并插入loader.js(加载器)的代码 
 
### 项目目录介绍
 
 ```
 |--dist            // 生产环境构建的前端代码，使用此处文件部署
 |
 |--node_modules    // 项目依赖， "npm install"后产生
 |
 |--src             // 源代码文件
 |   |
 |   |--components  // 组件代码
 |   |
 |   |--models      // Redux-saga 
 |   |
 |   |--routes      // 路由页面组件
 |   |
 |   |--service     // 服务端接口，APP提供的接口
 |   |
 |   |--utils       // 一些工具函数定义
 |   |
 |   |--index.html  // WebApp的承载页面
 |   |
 |   |--index.js    // 入口JS文件
 |   |
 |   |--index.less  // 入口页面样式文件 各组件样式单独写在组件目录内
 |   |
 |   |--loader.js   // 加载器JS文件，页面代码使用localStorage存储
 |   |
 |   |--router.js   // 路由文件
 |
 |--gulpfile.js     // 处理生产环境生成的html文件，去除JS、CSS引用，并把构建后的loader.js文件代码嵌入到index.html文件中
 |
 |--package.json    // 项目文件
 |
 |--proxy.config.js // 开发时使用代理Mock服务器数据，此处配置代理
 |
 |--webpack.config.js // atool-build/webpack 的配置文件
 |
 |--update/index.html // 强制更新页面
 ```
 
### 强制更新页面 update/index.html 
这个页面单独部署到原来的商城页面地址下， 只需要这一个文件，图片我已经手base64写到html文件内了
修改index.html文件内IOS与安卓的下载地址
