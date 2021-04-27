const Webpack = require('webpack');
const { merge } = require('webpack-merge');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlinePlugin = require('./plugins/HtmlInlinePlugin');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
const AddAssertHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');

const baseConfig = require('./webpack.base');

const { uuid, isDev, root, src, paths } = require('./utils');

module.exports = merge(baseConfig, {
  module: {
    rules: [
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac|mov)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: { name: 'medias/[name].[hash:8].[ext]' }
        }]
      },
      {
        test: /(\.(js|jsx|mjs)$)|(\.(ts|tsx)$)/,
        include: [function (v) {
          if (/node_modules\/core-js/.test(v)) {
            return false;
          }

          if (!/node_modules/.test(v)) {
            return true;
          }
          return false;
        }],
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: paths.caches,
              cacheIdentifier: uuid()
            }
          },
          {
            loader: 'thread-loader'
          },
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  { modules: false, useBuiltIns: 'usage', corejs: 2 }
                ],
                [
                  '@babel/preset-typescript',
                  { allExtensions: undefined }
                ],
                '@babel/preset-react'
              ],
              plugins: [
                [
                  '@babel/plugin-proposal-decorators',
                  { legacy: true }
                ],
                [
                  '@babel/plugin-proposal-class-properties',
                  { loose: true }
                ],
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-proposal-optional-catch-binding',
                '@babel/plugin-proposal-async-generator-functions',
                '@babel/plugin-proposal-export-namespace-from',
                '@babel/plugin-proposal-export-default-from',
                '@babel/plugin-proposal-nullish-coalescing-operator',
                '@babel/plugin-proposal-optional-chaining',
                [
                  '@babel/plugin-proposal-pipeline-operator',
                  { proposal: 'minimal' }
                ],
                '@babel/plugin-proposal-do-expressions',
                '@babel/plugin-proposal-function-bind',
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-syntax-jsx',
                // Attention!
                root('node_modules/react-hot-loader/babel.js')
              ]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        sideEffects: true,
        include: [
          src('/common/styles')
        ],
        use: [{
          loader: root('node_modules/mini-css-extract-plugin/dist/loader.js'),
          options: { hmr: isDev() }
        },
        {
          loader: 'css-loader',
          options: { importLoaders: 1 }
        },
        {
          loader: 'postcss-loader',
        }]
      },
      {
        test: /\.css$/,
        sideEffects: true,
        exclude: [src('/common/styles')],
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: { importLoaders: 1 }
          },
          {
            loader: 'postcss-loader',
          }
        ]
      },
      {
        test: /\.(scss|sass)$/,
        sideEffects: true,
        include: [src('common/styles')],
        use: [
          {
            loader: root('node_modules/mini-css-extract-plugin/dist/loader.js'),
            options: { hmr: isDev() }
          },
          {
            loader: 'css-loader',
            options: { importLoaders: 2 }
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [src('')],
                fiber: false
              },
              implementation: require('sass'),
              prependData: "$type: 'web';",
              sourceMap: false
            }
          }
        ]
      },
      {
        test: /\.(scss|sass)$/,
        sideEffects: true,
        exclude: [src('common/styles')],
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: { importLoaders: 2 }
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [src('')],
                fiber: false
              },
              implementation: require('sass'),
              prependData: "$type: 'web';",
              sourceMap: false
            }
          }
        ]
      },
      {
        test: /\.less$/,
        sideEffects: true,
        include: [src('common/styles')],
        use: [
          {
            loader: root('node_modules/mini-css-extract-plugin/dist/loader.js'),
            options: { hmr: isDev() }
          },
          {
            loader: 'css-loader',
            options: { importLoaders: 2 }
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                paths: [src('')],
              },
              additionalData: `@type: "web";`,
              sourceMap: false,
              implementation: require('less'),
            }
          }
        ]
      },
      {
        test: /\.less$/,
        sideEffects: true,
        exclude: [src('common/styles')],
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: { importLoaders: 2 }
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                paths: [src('')],
              },
              additionalData: `@type: "web";`,
              sourceMap: false,
              implementation: require('less'),
            }
          }
        ]
      },
      {
        test: /\.gif$|\.jpe?g$|\.a?png$|\.webp$/,
        loader: 'url-loader',
        options: {
          limit: 8 * 1024,
          name: 'imgs/[name].[hash:8].[ext]',
          esModule: false,
        }
      },
      {
        test: /\.(svg)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: { name: 'svgs/[name].[hash:8].[ext]' }
        }]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [{
          loader: 'url-loader',
          options: { name: 'fonts/[name].[hash:8].[ext]' }
        }]
      }
    ]
  },
  optimization: {
    minimize: !isDev(),
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'all',
          name: 'vendor',
          priority: 0,
          enforce: true,
          test: function (module) {
            if (module.nameForCondition && /\/node_modules\//.test(module.nameForCondition())) {
              return true;
            }
            return false;
          }
        }
      }
    }

  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      templateParameters: function templateParametersGenerator(compilation, assets, options) {
        return {
          compilation,
          webpackConfig: compilation.options,
          htmlWebpackPlugin: {
            files: assets,
            options,
          },
        };
      },
      filename: isDev() ? 'index.html' : root('build/index.html'),
      hash: false,
      inject: true,
      compile: true,
      favicon: false,
      minify: isDev() ? false : {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      scriptLoading: 'blocking',
      publicPath: 'auto',
      cache: true,
      showErrors: true,
      chunks: ['index', 'vendor'],
      excludeChunks: [],
      chunksSortMode: 'auto',
      meta: {},
      title: 'Webpack App',
      xhtml: false,
      env: { NODE_ENV: isDev() ? 'development' : 'production', PUBLIC_URL: undefined },
      currentEntryName: 'index',
    }),
    new HtmlInlinePlugin(),
    new HtmlWebpackExcludeAssetsPlugin(),
    new AddAssertHtmlWebpackPlugin({
      filepath: paths.dllFile
    }),
    new Webpack.DllReferencePlugin({
      manifest: paths.dllManifest
    })
  ],
});
