var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify');
    concat = require('gulp-concat');


var coffeeSources = ['components/coffee/tagline.coffee'];

var jsSources = [
  'componets/scripts/rclick.js',
  'componets/scripts/pixgrid.js',
  'componets/scripts/tagline.js',
  'componets/scripts/template.js'
];

gulp.task('coffee', function() {
    gulp.src(coffeeSources)
      .pipe(coffee({bare: true})
        .on('error', gutil.log))
        .pipe(gulp.dest('components/scripts'))
});

//Concat - spanjanje gore navedenih js fileova u jedan script.js
gulp.task('js', function() {
  gulp.src(jsSources)
  .pipe(concat('script.js'))
  .pipe(browserify())
  .pipe(gulp.dest('builds/development/js'))
});
