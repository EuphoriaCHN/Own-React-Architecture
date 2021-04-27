const Webpack = require('webpack');
const { merge } = require('webpack-merge');

const WatchMissingNodeModulesPlugin = require('./plugins/WatchMissingNodeModulesPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const base = require('./webpack.config');

const { root } = require('./utils');

module.exports = merge(base, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  plugins: [
    new WatchMissingNodeModulesPlugin(root('node_modules')),
    new Webpack.HotModuleReplacementPlugin({}),
    new MiniCssExtractPlugin({
      filename: 'common/base.css',
      ignoreOrder: false,
      chunkFilename: 'common/[name].css'
    }),
  ],
  devServer: {
    port: 8080,
    contentBase: root('/build'),
    compress: true,
    overlay: true,
    open: true,
    hot: true,
    historyApiFallback: true,
    proxy: {},
  },
});