const path = require('path');

const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Webpack = require('webpack');

const { ModulesPath, Configs: { dllEntry } } = require('./project.config');

module.exports = {
  mode: 'production',
  entry: dllEntry,
  output: {
    filename: '_dll_[id]_[hash:8].js',
    path: path.resolve(ModulesPath.DLL),
    library: '[name]_[hash:8]',
  },
  optimization: {
    minimizer: [
      new UglifyJsWebpackPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: {
            drop_console: true,
            keep_infinity: true,
          },
          output: {
            comments: false,
            beautify: false,
          },
        },
      }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new Webpack.DllPlugin({
      name: '[name]_[hash:8]',
      path: path.join(ModulesPath.DLL, '[name]_manifest.json'),
    }),
  ],
};
