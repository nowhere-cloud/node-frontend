'use strict';
const Gulp = require('gulp');
const Babel = require('gulp-babel');
const Stylus = require('gulp-stylus');
const Maps = require('gulp-sourcemaps');
const Uglify = require('gulp-uglify');
const DEL = require('del');
const CleanCSS = require('gulp-clean-css');

const babel_options = {
  'presets': [
    'env'
  ]
};

const CleanCSS_options = {
  'compress': true
};

const Uglify_options = {
  'output': {},
  'compress': {}
};

Gulp.task('Transpile and Minify JavaScript', () => {
  return Gulp.src('assets/javascripts/*.js')
    .pipe(Babel(babel_options))
    .pipe(Uglify(Uglify_options))
    .pipe(Gulp.dest('public/assets/javascripts'));
});

Gulp.task('Compile and Minify CSS', () => {
  return Gulp.src('assets/stylesheets/*.styl')
    .pipe(Stylus())
    .pipe(CleanCSS(CleanCSS_options))
    .pipe(Gulp.dest('public/assets/stylesheets'));
});

Gulp.task('Transpile JavaScript and Generate SourceMap', () => {
  return Gulp.src('assets/javascripts/*.js')
    .pipe(Maps.init())
    .pipe(Babel())
    .pipe(Maps.write())
    .pipe(Gulp.dest('public/assets/javascripts'));
});

Gulp.task('Compile CSS and Generate SourceMap', () => {
  return Gulp.src('assets/stylesheets/*.styl')
    .pipe(Maps.init())
    .pipe(Stylus())
    .pipe(Maps.write())
    .pipe(Gulp.dest('public/assets/stylesheets'));
});

Gulp.task('clean', () => {
  return DEL(['public/assets/**/*']);
});

Gulp.task('default', ['Transpile and Minify JavaScript', 'Compile and Minify CSS']);

Gulp.task('development', ['Transpile JavaScript and Generate SourceMap', 'Compile CSS and Generate SourceMap']);
