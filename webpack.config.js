/* eslint-disable no-var */
var path = require('path');
var webpack = require('webpack');

var dependencies = Object.keys(require('./package.json').dependencies);

var generateConfig = function (host, port, hot) {
  var config = {
    context: path.join(__dirname, 'public'),
    entry: {
      javascript: './app.jsx',
      html: './index.html',
      vendor: dependencies
    },
    output: {
      filename: 'app.js',
      path: path.join(__dirname, 'build')
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin(/*chunkName= */'vendor', /* filename= */'vendor.js')
    ],
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel'
        },
        {
          test: /\.html$/,
          loader: 'file?name=[name].[ext]'
        },
        {
          test: /\.less$/,
          loader: 'style!css?sourceMap!autoprefixer!less?sourceMap'
        }
      ]
    },
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    devtool: 'inline-source-map'
  };

  if (hot) {
    config.plugins.unshift(new webpack.HotModuleReplacementPlugin());
    Object.keys(config.entry).forEach(function (entryKey) {
      if (!Array.isArray(config.entry[entryKey])) {
        config.entry[entryKey] = [config.entry[entryKey]];
      }
      config.entry[entryKey].unshift('webpack-dev-server/client?http://' + host + ':' + port, 'webpack/hot/dev-server');
    });
  }

  return config;
};

module.exports = generateConfig('localhost', 8081, false);
module.exports.generate = generateConfig;
