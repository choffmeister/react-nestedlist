/* eslint-env node */
'use strict';

const argv = require('yargs').argv;
const path = require('path');

const browser = () => {
    switch (argv.browser) {
        case 'chrome': return 'Chrome';
        case 'firefox': return 'Firefox';
        default: return 'PhantomJS';
    }
};

module.exports = function (karmaConfig) {
    const config = {
        basePath: '.',
        frameworks: [
            'mocha'
        ],
        webpack: {
            module: {
                loaders: [
                    {
                        test: /\.jsx?$/,
                        exclude: [
                            path.resolve('node_modules/')
                        ],
                        loader: 'babel'
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
            'node_modules/babel-polyfill/dist/polyfill.js',
            'test/main.js'
        ],
        preprocessors: {
            'test/main.js': ['webpack', 'sourcemap']
        },
        reporters: ['spec'],
        browsers: [browser()],
        singleRun: !argv.dev
    };

    if (argv.coverage) {
        delete config.webpack.devtool;

        config.webpack.module.preLoaders = [
            {
                test: /\.jsx$/,
                exclude: [
                    path.resolve('node_modules/'),
                    path.resolve('src/')
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
        config.reporters.push('coverage');
        config.preprocessors['test/main.js'] = 'webpack';
        config.coverageReporter = {
            reporters: [
                {type: 'lcov', dir: 'reports/coverage/'},
                {type: 'json', dir: 'reports/coverage/', file: 'coverage.json'},
                {type: 'text-summary'}
            ]
        };
    }

    karmaConfig.set(config);
};
