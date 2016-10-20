var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect');


var coffeeSources = ['components/coffee/tagline.coffee'];

var jsSources = [
  'componets/scripts/rclick.js',
  'componets/scripts/pixgrid.js',
  'componets/scripts/tagline.js',
  'componets/scripts/template.js'
];

var sassSources = ['components/sass/style.scss'];

var htmlSources = ['builds/development/*.html'];

var jsonSources = ['builds/development/js/*.json']

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


//Compass - spajanje sass-a u css
gulp.task('compass', function() {
  gulp.src(sassSources)
  .pipe(compass({
    sass: 'components/sass',
    image: 'builds/development/images',
    style: 'expanded',
    comments :true
  }))
  .on('error', gutil.log)
  .pipe(gulp.dest('builds/development/css'))
  .pipe(connect.reload())
});

//Default task
gulp.task('default', ['coffee','js','compass','watch','connect','json']);

//Watch task
gulp.task('watch', function(){
  gulp.watch(coffeeSources, ['coffee']);
  gulp.watch(jsSources, ['js']);
  gulp.watch('components/sass/*.scss', ['compass']);
  gulp.watch(htmlSources, ['html']);
    gulp.watch(jsonSources, ['json']);
});

//Gulp connect - paljenje servera
gulp.task('connect', function(){
  connect.server({
      root: 'builds/development/',
      livereload: true
});
});

gulp.task('html', function(){
  gulp.src(htmlSources)
  .pipe(connect.reload())
});

gulp.task('json', function(){
  gulp.src('builds/development/js/*.json')
  .pipe(connect.reload())
});
