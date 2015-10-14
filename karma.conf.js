/*eslint-disable no-var*/
var argv = require('yargs').argv;
var path = require('path');

module.exports = function (karmaConfig) {
  var browsers = [];
  if (argv.chrome) browsers.push('Chrome');
  if (argv.firefox) browsers.push('Firefox');
  if (browsers.length === 0) browsers.push('PhantomJS');

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

  if (!argv.dev) {
    config.webpack.module.preLoaders = [
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
    ];
    config.reporters.push('junit');
    config.junitReporter = {
      outputDir: 'reports/testresults'
    };
  }

  if (argv.coverage) {
    config.reporters.push('coverage');
    config.coverageReporter = {
      reporters: [
        {type: 'html', dir: 'reports/coverage/'},
        {type: 'text'}
      ]
    };
  }

  karmaConfig.set(config);
};
