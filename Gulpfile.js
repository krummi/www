var gulp = require('gulp');

// Nodemon
var nodemon = require('gulp-nodemon');

// LESS
var less = require('gulp-less');

// LiveReload
var livereload = require('gulp-livereload');
var server = livereload(35729);

gulp.task('less', function () {
  console.log('Compiling LESS.');
  gulp.src('./public/css/**/*.less')
    .pipe(less())
    .pipe(gulp.dest('./public/css'));
});

gulp.task('nodemon', function () {
  console.log('Running nodemon...');
  nodemon({
    script: 'lib/server.js',
    ext: 'js, jade, html, less',
    ignore: ['README.md', 'node_modules/**', '.DS_Store']
  })
  .on('change', ['less']);
});

gulp.task('watch', function() {

  gulp.watch('./public/css').on('change', function (file) {
    server.changed(file.path)
  });

});

gulp.task('default', ['nodemon', 'less', 'watch']);