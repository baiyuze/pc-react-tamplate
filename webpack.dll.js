const path = require('path')
const webpack = require('webpack')
const CompressionWebpackPlugin = require('compression-webpack-plugin');

const ROOT_PATH = path.resolve(`${__dirname}/public`);

module.exports = {
  entry: {
    'router_dom': ['react','react-dom','react-router-dom'],
    'lodash': ['lodash']
  },
  output: {
    path: path.resolve(__dirname, 'public/dist/common'),
    filename: '[name].dll.js',
    library: '[name]_lib',
  },
  mode: process.env.NODE_ENV,
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(ROOT_PATH, 'dist', 'manifest.json'),
      name: '[name]_lib',
      context: ROOT_PATH,
    }),
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',// 目标文件名
      algorithm: 'gzip',// 使用gzip压缩
      test: new RegExp(
          '\\.(js|css)$' // 压缩 js 与 css
      ),
      threshold: 10240,// 资源文件大于10240B=10kB时会被压缩
      minRatio: 0.8 // 最小压缩比达到0.8时才会被压缩
    }),
    
  ],
}