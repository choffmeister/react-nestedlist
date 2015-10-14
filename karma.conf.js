/*eslint-disable no-var*/
var argv = require('yargs').argv;
var deepExtend = require('deep-extend');
var path = require('path');

module.exports = function (karmaConfig) {
  var browsers = ['PhantomJS'];
  if (argv.chrome) browsers.push('Chrome');
  if (argv.firefox) browsers.push('Firefox');

  var config = {
    basePath: '.',
    frameworks: [
      'mocha'
    ],
    webpack: {
      module: {
        loaders: [
          {
            test: /\.jsx?$/,
            exclude: path.resolve('node_modules/'),
            loader: 'babel'
          },
          {
            test: /\.json/,
            loader: 'file-loader'
          }
        ]
      },
      resolve: {
        extensions: ['', '.js', '.jsx']
      },
      devtool: 'inline-source-map'
    },
    webpackMiddleware: {
      noInfo: true
    },
    files: [
      'node_modules/babel-core/browser-polyfill.js',
      'test/main.js'
    ],
    preprocessors: {
      'test/main.js': ['webpack', 'sourcemap']
    },
    reporters: ['spec'],
    browsers: browsers,
    singleRun: !argv.dev
  };

  var fullTestRunConfig = {
    webpack: {
      module: {
        preLoaders: [
          {
            test: /\.jsx?$/,
            exclude: [
              path.resolve('node_modules/'),
              path.resolve('test/')
            ],
            loader: 'babel'
          },
          {
            test: /\.jsx?$/,
            include: [
              path.resolve('src/')
            ],
            loader: 'isparta'
          }
        ]
      }
    },
    reporters: ['spec', 'junit', 'coverage'],
    junitReporter: {
      outputDir: 'reports/testresults'
    },
    coverageReporter: {
      reporters: [
        {type: 'html', dir: 'reports/coverage/'},
        {type: 'text'}
      ]
    }
  };

  if (!argv.dev) deepExtend(config, fullTestRunConfig);

  karmaConfig.set(config);
};
