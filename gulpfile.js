'use strict';
const Gulp      = require('gulp');
const Babel     = require('gulp-babel');
const Sass      = require('gulp-sass');
const Uglify    = require('gulp-uglify');
const DEL       = require('del');
const CleanCSS  = require('gulp-clean-css');

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

const Sass_options = {
  indentedSyntax: true
};

const js_path = 'assets/javascripts/*.j+(s|sx|sm)';
const sass_path = 'assets/stylesheets/*.s+(a|c)ss';

Gulp.task('Transpile and Minify JavaScript', () => {
  return Gulp.src(js_path)
    .pipe(Babel(babel_options))
    .pipe(Uglify(Uglify_options))
    .pipe(Gulp.dest('public/assets/javascripts'));
});

Gulp.task('Compile and Minify CSS', () => {
  return Gulp.src(sass_path)
    .pipe(Sass(Sass_options).on('error', Sass.logError))
    .pipe(CleanCSS(CleanCSS_options))
    .pipe(Gulp.dest('public/assets/stylesheets'));
});

Gulp.task('Transpile JavaScript and Generate SourceMap', () => {
  return Gulp.src(js_path)
    .pipe(Babel())
    .pipe(Gulp.dest('public/assets/javascripts'));
});

Gulp.task('Compile CSS and Generate SourceMap', () => {
  return Gulp.src(sass_path)
    .pipe(Sass(Sass_options).on('error', Sass.logError))
    .pipe(Gulp.dest('public/assets/stylesheets'));
});

Gulp.task('clean', () => {
  return DEL(['public/assets/**/*']);
});

Gulp.task('default', ['Transpile and Minify JavaScript', 'Compile and Minify CSS']);

Gulp.task('development', ['Transpile JavaScript and Generate SourceMap', 'Compile CSS and Generate SourceMap']);
