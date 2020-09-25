const path = require('path');
const fs = require('fs');
const os = require('os');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const AddAssertHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
const EslintFriendlyFormatter = require('eslint-friendly-formatter');
const Happypack = require('happypack');
const happyThreadPool = Happypack.ThreadPool({ size: os.cpus().length });
const autoprefixer = require('autoprefixer');
const Webpack = require('webpack');

const { ModulesPath, Configs } = require('./project.config');
const { logger } = require('./lib/utils');

const { NODE_ENV: env } = process.env;

const isDevelopment = () => env === 'development';

const DllReferenceModules = [];
const DllModules = [];

if (!fs.existsSync(ModulesPath.DLL)) {
  fs.mkdirSync(ModulesPath.DLL);
}
fs.readdirSync(path.join(ModulesPath.DLL)).forEach(
  (filename) => {
    if (filename.endsWith('.js')) {
      DllModules.push(new AddAssertHtmlWebpackPlugin({
        filepath: path.join(ModulesPath.DLL, filename),
      }));
    } else if (filename.endsWith('.json')) {
      DllReferenceModules.push(new Webpack.DllReferencePlugin({
        manifest: path.join(ModulesPath.DLL, filename),
      }));
    }
  }
);

if (Object.keys(Configs.dllEntry).length && (!DllReferenceModules.length || !DllModules.length)) {
  logger('Can not find any DLL for project!', 'error', true, true);
  logger('You can run:', 'error', false);
  logger('  $ npm run dll', 'error', false);
  logger('to generate it!', 'error', false);
  process.exit(-1);
}

const otherWebpackPlugins = [];
if (Configs.copyPlugin.length) {
  otherWebpackPlugins.push(new CopyWebpackPlugin({
    patterns: Configs.copyPlugin,
  }));
}
if (!isDevelopment()) {
  otherWebpackPlugins.push(new MiniCssExtractPlugin({
    filename: 'styles/style.[hash:8].css'
  }));
}

const createHappypackPlugin = ({ id, loaders }) => (
  new Happypack({
    threadPool: happyThreadPool,
    verbose: false,
    id,
    loaders
  })
);

/**
 * 获取各个样式模块的 Loader
 * @param {'css' | 'sass' | 'less'} type
 */
const getStyleModulesLoader = (type, happypack = false) => {
  if (isDevelopment() && !happypack) {
    // module.rules.loader Dev configs
    // Reference to Happypack plugin
    return `Happypack/loader?id=Happypack-${type}-dev`;
  }
  const cssLoaders = ['css-loader', {
    loader: 'postcss-loader',
    options: {
      sourceMap: isDevelopment()
    }
  }];
  switch (type) {
    case 'less':
      cssLoaders.push('less-loader');
      break;
    case 'sass':
      cssLoaders.push('sass-loader');
  }
  if (happypack) {
    // Development happypack plugin will use style-loader
    cssLoaders.unshift('style-loader');
  } else {
    // Production will use extract plugin
    cssLoaders.unshift(MiniCssExtractPlugin.loader);
  }
  return cssLoaders;
};

module.exports = {
  entry: path.join(ModulesPath.SRC, 'index.js'),
  output: {
    filename: 'bundle.[hash:8].js',
    path: ModulesPath.DIST
  },
  resolve: {
    modules: [
      path.resolve(ModulesPath.ROOT, 'node_modules'),
      ModulesPath.SRC
    ],
    alias: Object.assign(Configs.alias || {}, {
      '@common': path.join(ModulesPath.SRC, 'common')
    }),
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    mainFields: ['style', 'main'],
  },
  externals: {
    jquery: '$',
  },
  //! If you want to automatically bundle production code, you can cancel this comment
  // watch: true,
  // watchOptions: {
  //   poll: 1000,
  //   aggregateTimeout: 500,
  //   ignored: /node_modules/,
  // },
  module: {
    noParse: /jquery/,
    rules: [
      {
        test: /\.css$/,
        use: getStyleModulesLoader('css')
      },
      {
        test: /\.less$/,
        use: getStyleModulesLoader('less')
      },
      {
        test: /\.s[ca]ss$/,
        use: getStyleModulesLoader('sass')
      },
      {
        test: /\.[tj]sx?$/,
        use: 'Happypack/loader?id=Happypack-js',
        exclude: /node_modules/,
        include: ModulesPath.SRC
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash:8].[ext]',
              outputPath: '/static/common',
            },
          },
        ],
      },
      {
        test: /\.(png)|(jpe?g)|(gif)/,
        use: {
          loader: 'url-loader',
          options: {
            esModule: false,
            limit: 8 * 1024,
            name: '[name].[hash:8].[ext]',
            outputPath: '/static/images',
          },
        },
      },
      {
        test: /\.html/,
        use: 'html-withimg-loader',
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      }
    ]
  },
  plugins: [
    new Webpack.IgnorePlugin(/\.\/locale/, /monent/),
    createHappypackPlugin({
      id: 'Happypack-js',
      loaders: [
        {
          loader: 'babel-loader',
        },
        {
          loader: 'eslint-loader',
          options: {
            fix: true,
            formatter: EslintFriendlyFormatter,
            emitWarning: false,
          }
        }
      ],
    }),
    createHappypackPlugin({
      id: 'Happypack-css-dev',
      loaders: getStyleModulesLoader('css', true),
    }),
    createHappypackPlugin({
      id: 'Happypack-sass-dev',
      loaders: getStyleModulesLoader('sass', true),
    }),
    createHappypackPlugin({
      id: 'Happypack-less-dev',
      loaders: getStyleModulesLoader('less', true),
    }),
  ].concat(DllModules).concat(DllReferenceModules)
    .concat(otherWebpackPlugins)
};
