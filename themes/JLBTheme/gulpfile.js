// gulp dependencies
var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var rename = require('gulp-rename');

// browsersync server variable and paths
var serverURL = 'http://localhost';
var paths = {
  scripts: './js/scripts.js',
  js: './js/*.js',
  sass: './sass/**/*.sass',
  compiled: './compiled',
  css: './css/*.css',
  widgetStyles: '../../plugins/extend-widgets-bundle/sass/*.sass',
  widgetTemplates: '../../plugins/extend-widgets-bundle/extra-widgets/**/*-templates/*.php'
};

// default when you run gulp
gulp.task('default', ['sass', 'scripts', 'lint', 'compile-css', 'compile-js'], function() {
  console.log('Hey... Don\'t mess up!');
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['scripts', 'lint']);
  gulp.watch(['./**/*.php', paths.widgetStyles, paths.widgetTemplates]).on('change', browserSync.reload);
  browserSync.init({
    proxy: serverURL,
    open: false,
    logPrefix: 'JLB Dev'
  });
});

// dev task on server
gulp.task('dev', ['scripts', 'lint', 'compile-js'], function() {
  gulp.watch(paths.js, ['scripts', 'lint', 'compile-js']);
});

// sass task
gulp.task('sass', function() {
  gulp.src('sass/**/main.sass')
    // compress & minify
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    // add autoprefixers
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    // rename file
    .pipe(rename({
      basename: 'styles',
      extname: '.min.css'
    }))
    .pipe(gulp.dest(paths.compiled))
    .pipe(browserSync.stream());
});

// scripts task including es6 syntax
gulp.task('scripts', function() {
  gulp.src(paths.scripts)
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(uglify())
    .pipe(rename({
      basename: 'scripts',
      extname: '.min.js'
    }))
    .pipe(gulp.dest(paths.compiled));
});

// lint task to check syntax
gulp.task('lint', function() {
  return gulp.src([paths.scripts])
    .pipe(eslint())
    .pipe(eslint.format());
});

// minify and concat all extra css
gulp.task('compile-css', function() {
  gulp.src(paths.css)
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(concat('extra-css.min.css'))
    .pipe(gulp.dest(paths.compiled));
});

// minify and concat all extra js
gulp.task('compile-js', function() {
  gulp.src([paths.js, '!./js/scripts.js'])
    .pipe(uglify())
    .pipe(concat('extra-scripts.min.js'))
    .pipe(gulp.dest(paths.compiled));
});
