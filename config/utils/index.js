const { v4: uuidV4 } = require('uuid');
const path = require('path');

function uuid() {
  return uuidV4().replace(/-/g, '');
}

function root(...paths) {
  return path.resolve(process.cwd(), ...paths);
}

function src(...paths) {
  return path.resolve(root('src'), ...paths);
}

function isDev() {
  return process.env.NODE_ENV !== 'production';
}

const paths = {
  root: root(''),
  src: src(''),
  nodeModules: root('node_modules'),
  package: root('package.json'),
  pages: src('pages'),
  caches: root('node_modules/.cache-loader'),
  dist: root('build'),
  dll: isDev() ? root('node_modules/.eup_dll/') : root('build/dll/'),
  dllFile: isDev() ? root('node_modules/.eup_dll/index.js') : root('build/dll/index.js'),
  dllManifest: isDev() ? root('node_modules/.eup_dll/manifest.json') : root('build/dll/manifest.json'),
  dllVersionManifest: isDev() ? root('node_modules/.eup_dll/version.json') : root('build/dll/version.json'),
  webpackScript: root('node_modules/webpack/bin/webpack.js')
};

module.exports = {
  isDev,
  root,
  src,
  uuid,
  paths
};