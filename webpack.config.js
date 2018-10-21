var path = require('path');
var webpack = require('webpack');

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
  entry: path.resolve(appDirectory, 'src/demo.js'),

  // configures where the build ends up
  output: {
    filename: 'bundle.js',
    path: path.resolve(appDirectory, 'build'),
    publicPath: '/js/'
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
  ],

  stats: {
    colors: true
  }
};
