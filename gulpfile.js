/* eslint-env node */
'use strict';

const gulp = require('gulp');
const gulpUtil = require('gulp-util');

gulp.task('lint-javascript', function () {
    const gulpEslint = require('gulp-eslint');

    return gulp.src(['./*.js', './{src,test}/**/*.{js,jsx}'])
        .pipe(gulpEslint())
        .pipe(gulpEslint.format())
        .pipe(gulpEslint.failOnError());
});
gulp.task('lint', ['lint-javascript']);

gulp.task('build', function (done) {
    const del = require('del');
    const webpack = require('webpack');
    const webpackConfig = require('./webpack.config.js');

    del.sync('./build');

    const compiler = webpack(webpackConfig);
    compiler.run(function (err) {
        if (!err) {
            gulpUtil.log('Build to ' + compiler.outputPath);
        } else {
            done(err);
        }
    });
});

gulp.task('dist', function () {
    const del = require('del');
    const gulpBabel = require('gulp-babel');

    del.sync('./dist');

    return gulp.src('./src/**/*.{js,jsx}')
        .pipe(gulpBabel())
        .pipe(gulp.dest('./dist'));
});

gulp.task('test', function (done) {
    const karma = require('karma');

    const server = new karma.Server({configFile: __dirname + '/karma.conf.js'}, done);
    server.start();
});

gulp.task('devserver', function (done) {
    const host = 'localhost';
    const port = 8080;
    const hot = true;
    const webpack = require('webpack');
    const webpackConfig = require('./webpack.config.js').generate(host, port, hot);
    const WebpackDevServer = require('webpack-dev-server');

    const server = new WebpackDevServer(webpack(webpackConfig), {
        inline: true,
        hot: hot,
        historyApiFallback: true,
        stats: {
            assets: false,
            colors: true,
            version: false,
            modules: false,
            hash: false,
            timings: false,
            chunks: false,
            chunkModules: false,
            reasons: true,
            cached: true,
            chunkOrigins: true
        }
    });
    server.listen(port, host, function (err) {
        if (!err) {
          gulpUtil.log('Listening on http://' + host + ':' + port + '. Running initial build...');
        } else {
          done(err);
        }
    });
});

gulp.task('default', ['devserver']);

// ensure all subprocesses are killed after tasks have run or on interruption signals
gulp.doneCallback = err => process.exit(err ? 1 : 0);
process.on('SIGINT', () => process.exit());
process.on('SIGTERM', () => process.exit());
