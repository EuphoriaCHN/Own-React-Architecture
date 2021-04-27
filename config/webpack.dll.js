const Webpack = require('webpack');

const { paths } = require('./utils');

const pkg = require(paths.package);
const deps = Object.keys(pkg.dependencies || {});

const baseConfig = require('./webpack.base');

baseConfig.entry = {
  dll: deps
};

baseConfig.output = {
  path: paths.dll,
  filename: 'index.js',
  library: 'dll'
};

delete baseConfig.optimization;

baseConfig.plugins.push(
  new Webpack.DllPlugin({
    path: paths.dllManifest,
    name: 'dll',
    context: paths.root
  })
);

module.exports = baseConfig;
