const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require("compression-webpack-plugin");
const ShakePlugin = require('webpack-common-shake').Plugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const appDirectory = path.resolve(__dirname, './');

const NODE_ENV   = process.env.NODE_ENV || 'development';
const production = NODE_ENV === 'production';

module.exports = {
  mode: NODE_ENV,

  devServer: {
    contentBase: path.resolve(appDirectory, 'public'),
    compress: true,
    // port: 9000
  },
  
  // devtool: 'eval', // slow - use source-map for prod
  devtool: 'source-map',

  // your web-specific entry file
  entry: {
    polyfill: path.resolve(appDirectory, 'src/polyfill.js'),
    demo: path.resolve(appDirectory, 'src/demo.js'),
    main: path.resolve(appDirectory, 'src/main.js')
  },

  // configures where the build ends up
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(appDirectory, 'build'),
    publicPath: '/js/'
  },

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        parallel: true,
        sourceMap: true,   // enable source maps to map errors (stack traces) to modules
        uglifyOptions: {
          output: {
            comments: false, // remove all comments
          }
        }
      })
    ]
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        // Add every directory that needs to be compiled by Babel during the build.
        include: [
          path.resolve(appDirectory, 'src'),
        ],
        use: {
          loader: 'babel-loader',
          options: { babelrc: true },
        },
      }
    ]
  },

  plugins: [
    // process.env.NODE_ENV === 'production' must be true for production
    // builds to eliminate development checks and reduce build size. You may
    // wish to include additional optimizations.
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
      __DEV__: !production,
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new ShakePlugin(),
    new CompressionPlugin(),
  ],

  stats: {
    colors: true
  }
};
