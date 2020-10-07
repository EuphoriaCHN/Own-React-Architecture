const path = require('path');

const Webpack = require('webpack');
const { merge: WebpackMerge } = require('webpack-merge');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const webpackBaseConfig = require('./webpack.config');
const { ModulesPath, Configs } = require('./project.config');

const otherPlugins = [];
if (Configs.bundleAnalyzer) {
  otherPlugins.push(new BundleAnalyzerPlugin());
}

module.exports = WebpackMerge(webpackBaseConfig, {
  mode: 'production',
  output: {
    filename: 'bundle.[hash:8].js',
    publicPath: '/dist/',
    path: ModulesPath.DIST
  },
  optimization: {
    minimizer: [
      new OptimizeCssAssetsWebpackPlugin(),
      new UglifyJsWebpackPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new Webpack.BannerPlugin(Configs.bannerMsg),
    new HtmlWebpackPlugin({
      template: path.join(ModulesPath.SRC, 'common/template', 'index.html'),
      filename: 'index.html',
      minify: {
        removeAttributeQuotes: true,
        removeComments: true,
        collapseWhitespace: true,
      },
      hash: true,
    }),
  ].concat(otherPlugins)
});
