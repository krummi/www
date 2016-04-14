'use strict';

const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const less = require('gulp-less');

gulp.task('less', function () {
  console.log('compiling LESS');
  gulp.src('./public/css/**/*.less')
    .pipe(less())
    .pipe(gulp.dest('./public/css'));
});

gulp.task('nodemon', ['less'], function () {
  console.log('running nodemon...');
  nodemon({
    script: 'bin/server',
    ext: 'js, jade, html, less',
    ignore: ['README.md', 'node_modules/**', '.DS_Store'],
    tasks: ['less']
  });
});

gulp.task('default', ['nodemon', 'less']);
