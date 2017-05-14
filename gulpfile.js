'use strict';
const Gulp        = require('gulp');
const Babel       = require('gulp-babel');
const Sass        = require('gulp-sass');
const Uglify      = require('gulp-uglify');
const DEL         = require('del');
const CleanCSS    = require('gulp-clean-css');
const SourceMaps  = require('gulp-sourcemaps');
const Includes    = require('gulp-include');

const Babel_options = {
  'presets': ['env']
};

const CleanCSS_options = {
  'compress': true
};

const Uglify_options = {
  'output': {},
  'compress': {}
};

const Sass_options = {

};

const js_path   = 'assets/javascripts/*.j+(s|sx|sm)';
const sass_path = 'assets/stylesheets/*.s+(a|c)ss';
const pjs_path_a  = 'assets/javascripts-a/*.j+(s|sx|sm)';
const pjs_path_u  = 'assets/javascripts-u/*.j+(s|sx|sm)';

Gulp.task('Transpile and Minify JavaScript', () => {
  return Gulp.src(js_path)
    .pipe(Includes()).on('error', console.error)
    .pipe(Babel(Babel_options))
    .pipe(Uglify(Uglify_options))
    .pipe(Gulp.dest('public/assets/javascripts'));
});

Gulp.task('Transpile and Minify Protected Admin JavaScript', () => {
  return Gulp.src(pjs_path_a)
    .pipe(Includes()).on('error', console.error)
    .pipe(Babel(Babel_options))
    .pipe(Uglify(Uglify_options))
    .pipe(Gulp.dest('private/assets-a'));
});

Gulp.task('Transpile and Minify Protected User JavaScript', () => {
  return Gulp.src(pjs_path_u)
    .pipe(Includes()).on('error', console.error)
    .pipe(Babel(Babel_options))
    .pipe(Uglify(Uglify_options))
    .pipe(Gulp.dest('private/assets-u'));
});

Gulp.task('Compile and Minify CSS', () => {
  return Gulp.src(sass_path)
    .pipe(Sass(Sass_options).on('error', Sass.logError))
    .pipe(CleanCSS(CleanCSS_options))
    .pipe(Gulp.dest('public/assets/stylesheets'));
});

Gulp.task('Transpile JavaScript and Generate SourceMap', () => {
  return Gulp.src(js_path)
    .pipe(SourceMaps.init())
    .pipe(Includes()).on('error', console.error)
    .pipe(Babel(Babel_options))
    .pipe(SourceMaps.write('.'))
    .pipe(Gulp.dest('public/assets/javascripts'));
});

Gulp.task('Transpile Protected Admin JavaScript and Generate SourceMap', () => {
  return Gulp.src(pjs_path_a)
    .pipe(SourceMaps.init())
    .pipe(Includes()).on('error', console.error)
    .pipe(Babel(Babel_options))
    .pipe(SourceMaps.write('.'))
    .pipe(Gulp.dest('private/assets-a'));
});

Gulp.task('Transpile Protected User JavaScript and Generate SourceMap', () => {
  return Gulp.src(pjs_path_u)
    .pipe(SourceMaps.init())
    .pipe(Includes()).on('error', console.error)
    .pipe(Babel(Babel_options))
    .pipe(SourceMaps.write('.'))
    .pipe(Gulp.dest('private/assets-u'));
});

Gulp.task('Compile CSS and Generate SourceMap', () => {
  return Gulp.src(sass_path)
    .pipe(SourceMaps.init())
    .pipe(Sass(Sass_options).on('error', Sass.logError))
    .pipe(SourceMaps.write('.'))
    .pipe(Gulp.dest('public/assets/stylesheets'));
});

Gulp.task('clean', () => {
  return DEL(['private/assets/**/*', 'private/assets-a/**/*', 'private/assets-u/**/*', 'public/assets/javascripts/*', 'public/assets/stylesheets/*']);
});

Gulp.task('default', ['Transpile and Minify JavaScript', 'Transpile and Minify Protected Admin JavaScript', 'Transpile and Minify Protected User JavaScript', 'Compile and Minify CSS']);

Gulp.task('development', ['Transpile JavaScript and Generate SourceMap', 'Transpile Protected Admin JavaScript and Generate SourceMap', 'Transpile Protected User JavaScript and Generate SourceMap', 'Compile CSS and Generate SourceMap']);
