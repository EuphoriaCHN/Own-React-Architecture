const Webpack = require('webpack');

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WebpackBarPlugin = require('webpackbar');

const { isDev, paths } = require('./utils');

const hashType = isDev() ? 'hash' : 'chunkhash';

const plugins = [
  new Webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: isDev() ? '"development"' : '"production"'
    }
  }),
  new CaseSensitivePathsPlugin(),
  new WebpackBarPlugin()
];

if (isDev()) {
  plugins.push(new Webpack.NamedModulesPlugin());
}

module.exports = {
  entry: {
    index: [
      './src/common/utils/polyfill.js',
      './src/index.ts'
    ]
  },
  output: {
    path: paths.dist,
    filename: `[name].[${hashType}:8].js`,
    chunkFilename: `common/[name].[${hashType}:8].js`,
  },
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  resolve: {
    symlinks: false,
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
    extensions: [
      '.mjs', '.js',
      '.jsx', '.json',
      '.ts', '.tsx',
      '.graphql', '.gql'
    ],
    modules: [
      'node_modules',
    ],
    plugins: [
      new TsconfigPathsPlugin()
    ]
  },
  resolveLoader: {
    modules: [
      'node_modules',
    ]
  },
  module: {
    strictExportPresence: true,
  },
  performance: {
    maxEntrypointSize: 10485760,
    maxAssetSize: 5242880
  },
  plugins
};
