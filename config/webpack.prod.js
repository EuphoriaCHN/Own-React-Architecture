const Webpack = require('webpack');

const { merge } = require('webpack-merge');

const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const base = require('./webpack.config');

const plugins = [
  new Webpack.HashedModuleIdsPlugin({
    hashFunction: 'sha256',
    hashDigest: 'hex',
    hashDigestLength: 20,
  }),
  new MiniCssExtractPlugin({
    filename: 'common/base.[contenthash:8].css',
    ignoreOrder: false,
    chunkFilename: 'common/[name].[contenthash:8].css'
  }),
];

// plugins.push(new BundleAnalyzerPlugin({
//   analyzerHost: '0.0.0.0',
//   analyzerPort: '9990'
// }));

module.exports = merge(base, {
  mode: 'production',
  bail: true,
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        parallel: 7,
        terserOptions: {
          mangle: { safari10: true },
          compress: { defaults: true, drop_console: false },
          output: { comments: 'some', ascii_only: true }
        },
      }),
      new OptimizeCssAssetsPlugin({
        cssProcessorPluginOptions: { preset: ['default', { normalizeUrl: false }] },
      })
    ]
  },
  plugins
});