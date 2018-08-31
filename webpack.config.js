const HtmlWebpackPlugin = require('html-webpack-plugin'); 
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // 注意版本号 webpack 4 以上版本请下载 @next 版本
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const apiMocker = require('webpack-api-mocker');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const os = require('os');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { exec } = require('child_process');
const ROOT_PATH = path.resolve(`${__dirname}/public`);
let htmlOut = path.join(__dirname, 'public/dist/index.html');
let isdev = true;
if(process.env.NODE_ENV !== "development") {
  isdev = false;
}

let pkg = require('./package.json');
let theme = pkg.theme;
let output = {
  path:  path.resolve(__dirname, './public/dist/common'),
  chunkFilename: `[name].[hash].js`,
  filename: `[name].[hash].js`
}
let imgOptions = {
  name: 'img/[name].[ext]'
};
if(isdev) {
  htmlOut = 'index.html';
} else {
  imgOptions.publicPath = '/isoftportalsweb/';
  output.publicPath= '/isoftportalsweb/common/';
}



//复制文件


let config = {
  entry: ['babel-polyfill', path.join(__dirname,'./src/index.js')],
  output,
  module:{
    rules: [
      {
        test: /\.(jsx|js)?$/,
        exclude: /(node_modules|bower_components)/, 
        use: { 
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react',
              ['@babel/preset-env',{
                "targets": { 
                  "browsers": [
                    "> 1%",
                    "last 2 versions",
                    "Android >= 3.2", 
                    "Firefox >= 20", 
                    "iOS 7"
                  ]
                }
              }]
            ],
            plugins: [
              [
                "import",
                {libraryName: "antd", style: true}
              ] 
            ]
          }
        } 
      },
      {
        test: /\.(less|css)$/,
        use: ExtractTextPlugin.extract({ 
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  path: 'postcss.config.js'  // 这个得在项目根目录创建此文件
                }
              }
            },
            {
              loader:  'less-loader',
              options: { 
                javascriptEnabled: true,
                modifyVars: theme   //antd默认主题样式
              } 
            }
          ]
        })
      },
      {
        test: /\.html$/,
        use: [ 
          {
            loader: 'html-loader',
            options: { 
              minimize: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: imgOptions 
          }
        ]
      }
    ]  
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname + '/src/components'),
      config: path.resolve(__dirname + '/src/config')
    },
    extensions: ['.js','.jsx']
  },
  mode: process.env.NODE_ENV,
  plugins: [
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',// 目标文件名
      algorithm: 'gzip',// 使用gzip压缩
      test: new RegExp(
          '\\.(js|css)$' // 压缩 js 与 css
      ),
      threshold: 10240,// 资源文件大于10240B=10kB时会被压缩
      minRatio: 0.8 // 最小压缩比达到0.8时才会被压缩
    }),
    // 提取样式，生成单独文件
    new ExtractTextPlugin({
      filename: 'build.min.css',
      allChunks: false,
    }),
    new webpack.DllReferencePlugin({
      manifest: require(path.resolve(ROOT_PATH, 'dist', 'manifest.json')), 
      context: ROOT_PATH,
    }),
    new htmlWebpackPlugin({
      filename: htmlOut, //通过模板生成的文件名
      template:'./index.ejs',//模板路径
      inject: true, //是否自动在模板文件添加 自动生成的js文件链接
      title: 'demo',
      publicPath: !isdev ? '/isoftportalsweb/' : './',
      compress: true,
      hash: true,
      minify:{
        removeComments: true //是否压缩时 去除注释
      }
  })
  ],

 // 提供静态服务
  devServer:{ 
    port: 8001,
    contentBase: path.join(__dirname, 'public/dist'),
    historyApiFallback: true,
    headers: { // 添加头部信息
      "X-Custom-Foo": "bar"
    },
    open: false,
    // before(app) { 
    //   apiMocker(app, path.resolve('./mock/api.mock.js'))
    // },
    proxy: { // 请求代理
      "/proxy": {
        target: "http://192.168.0.129:8080",  //江龙
        // target: "http://192.168.0.122:8081",  //李路
        pathRewrite: { '^/proxy': '' }
      },
    }
  }

}

if(isdev) {
  config.devtool = 'cheap-module-eval-source-map';
} else {

  
} 

module.exports = config;