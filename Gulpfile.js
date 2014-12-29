var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var less = require('gulp-less');

gulp.task('less', function () {
  console.log('Compiling LESS.');
  gulp.src('./public/css/**/*.less')
    .pipe(less())
    .pipe(gulp.dest('./public/css'));
});

gulp.task('nodemon', function () {
  console.log('Running nodemon...');
  nodemon({
    script: 'bin/server',
    ext: 'js, jade, html, less',
    ignore: ['README.md', 'node_modules/**', '.DS_Store']
  })
  .on('change', ['less']);
});

gulp.task('default', ['nodemon', 'less']);
