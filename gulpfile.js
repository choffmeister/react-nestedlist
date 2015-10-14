/* eslint-disable no-var */
var gulp = require('gulp');
var gulpUtil = require('gulp-util');

gulp.task('lint-javascript', function () {
  var gulpEslint = require('gulp-eslint');

  return gulp.src(['./gulpfile.js', './{src,test}/**/*.{js,jsx}'])
    .pipe(gulpEslint())
    .pipe(gulpEslint.format())
    .pipe(gulpEslint.failOnError());
});
gulp.task('lint', ['lint-javascript']);

gulp.task('dist', function () {
  var del = require('del');
  var gulpBabel = require('gulp-babel');

  del.sync('./dist/**/*');

  return gulp.src('./src/**/*.{js,jsx}')
    .pipe(gulpBabel())
    .pipe(gulp.dest('./dist'));
});

gulp.task('test', function (done) {
  var karma = require('karma');

  var server = new karma.Server({configFile: __dirname + '/karma.conf.js'}, done);
  server.start();
});

gulp.task('devserver', function (done) {
  var host = 'localhost';
  var port = 8082;
  var hot = true;
  var webpack = require('webpack');
  var webpackConfig = require('./webpack.config.js').generate(host, port, hot);
  var WebpackDevServer = require('webpack-dev-server');

  var server = new WebpackDevServer(webpack(webpackConfig), {
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
