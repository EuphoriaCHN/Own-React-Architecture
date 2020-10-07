const path = require('path');

const { merge: WebpackMerge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const Webpack = require('webpack');
const chalk = require('chalk');

const webpackBaseConfig = require('./webpack.config');
const { ModulesPath, Configs } = require('./project.config');
const { getWebpackDevTerminalStyle, logger, getIpAddress } = require('../configs/lib/utils');

const otherConfigs = [];

const progressBarPlugin = new ProgressBarPlugin({
  clear: false,
  format: `${chalk.greenBright('📦 Bundling... :msg')} [:bar] :percent, Total :elapsed s`,
  complete: '#',
  incomplete: '-',
  callback: () => {
    logger('\n打包成功 ✨', 'success');
    if (getWebpackDevTerminalStyle() === 'progress') {
      // 对 Dashboard 也没啥用
      process.stdout.write(
        process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
      );
      logger('打包成功 ✨', 'success');
      console.log('\n');
      logger('你可以通过以下地址访问：', 'info');
      console.log('\n');
      logger(`http://localhost:${Configs.devConfig.port}    or`, 'info', false);
      logger(`http://127.0.0.1:${Configs.devConfig.port}    or`, 'info', false);
      logger(`http://${getIpAddress()}:${Configs.devConfig.port}`, 'info', false);
    }
  },
});
const dashboardPlugin = new DashboardPlugin();

const webpackDevTerminalStyle = getWebpackDevTerminalStyle();
switch (webpackDevTerminalStyle) {
  case 'dashboard':
    otherConfigs.push(dashboardPlugin);
    break;
  case 'progress':
    otherConfigs.push(progressBarPlugin);
    break;
}

module.exports = WebpackMerge(webpackBaseConfig, {
  mode: 'development',
  output: {
    filename: 'bundle.[hash:8].js',
    path: ModulesPath.DIST
  },
  devServer: {
    port: Configs.devConfig.port,
    quiet: webpackDevTerminalStyle !== 'default',
    contentBase: ModulesPath.DIST,
    compress: true,
    overlay: true,
    open: true,
    hot: true,
    historyApiFallback: true,
    proxy: Configs.devConfig.proxy || {},
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(ModulesPath.SRC, 'common/template', 'index.html'),
      filename: 'index.html',
      hash: true,
    }),
    new Webpack.HotModuleReplacementPlugin(),
    new Webpack.NamedModulesPlugin()
  ].concat(otherConfigs)
});
