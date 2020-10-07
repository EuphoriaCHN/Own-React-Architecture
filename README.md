# Update

> 升级到了 2.0 版本，目前只支持 **纯净版**（详见 Dependencies）

<hr />

# Caution
This project config just apply for **SPA**

# Use
All Configurations are in `configs\project.config.js`，you can config that.

If you not 纯净版, you should config `configs\project.config.js` run script `npm run dll` to genarate dll for project.

Project support `process.env.NODE_ENV`, like `production` and `development`, you don't need to configurate that.

# Bugs
- When you remove any Style modules in Component, React HMR will not work (it means that you also need refresh page manually), But when you add and modify some style modules, HMR will work!

# Support
- Webpack Dev Server
- LESS & SASS
- Mini CSS extract (means that we not use style-loader to insert style element into <head></head>)
- Auto prefixer
- Optimize CSS & Uglify js (In production mode)
- Babel & ES lint
- File loader & URL loader
- Support jQuery & Moment (Caution: We used Webpack.IgnorePlugin to ignoring "Moment" i18n languages, so you may need to use `import 'moment/locale/zh-cn';` to import clearly any i18n locale which you want)

# Dependencies

- @babel/runtime, @babel/polyfill
- normalize.css
- react, react-dom

# Development Dependencies

- Typescript
  - typescript
- Webpack
  - webpack, webpack-cli, webpack-merge
- Dev Tools:
  - webpack-dev-server, html-webpack-plugin, child_process
- Style Loader:
  - (style-loader), css-loader, node-sass, sass-loader, less, less-loader
- Css Optimize:
  - mini-css-extract-plugin, postcss-loader, autoprefixer, optimize-css-assets-webpack-plugin
- JS Optimize:
  - uglifyjs-webpack-plugin
- Bable:
  - babel-loader, @babel/core, @babel/preset-env, @babel/preset-react, @babel/preset-typescript
  - @babel/plugin-proposal-decorators, @babel/plugin-proposal-class-properties, @babel/plugin-syntax-dynamic-import, @babel/plugin-proposal-object-rest-spread
  - @babel/plugin-transform-runtime
- ES lint:
  - eslint, eslint-loader, eslint-friendly-formatter, babel-eslint, eslint-plugin-react, eslint-plugin-import
  - @typescript-eslint/parser
- Static sources:
  - file-loader, url-loader, html-withimg-loader, json-loader
- Utils: 
  - clean-webpack-plugin, copy-webpack-plugin, banner-plugin
- DLL: 
  - add-asset-html-webpack-plugin
- Bundle Optimize:
  - happypack (Because that the `mini-css-extract-plugin` can not be used with `happypack`, so we dont use it on **any** style modules)
- Other:
  - chalk, webpack-dashboard, progress-bar-webpack-plugin, react-hot-loader, log-symbols, log4js

# Extends

- react-router, react-router-dom