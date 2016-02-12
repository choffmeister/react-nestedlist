/*eslint-env node*/
'use strict';

const path = require('path');
const webpack = require('webpack');

const generateConfig = function (host, port, hot) {
    const config = {
        context: path.join(__dirname, 'public'),
        entry: {
            javascript: './app.jsx',
            html: './index.html',
            vendor: [
                'immutable',
                'react',
                'react-dom',
                'react-immutable-proptypes'
            ]
        },
        output: {
            filename: 'app.js',
            path: path.join(__dirname, 'build')
        },
        plugins: [
            new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')
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
                    loader: 'style!css!postcss!less'
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

module.exports = generateConfig('localhost', 8080, false);
module.exports.generate = generateConfig;
