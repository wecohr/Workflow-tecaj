var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    connect = require('gulp-connect');


var env, coffeeSources, jsSources, sassSources, htmlSources, jsonSources, outputDir,sassStyle;

env = process.env.NODE_ENV || 'production';

if (env==='development'){
outputDir = 'builds/development';
sassStyle = 'expanded';
}
else {
  outputDir = 'builds/production';
  sassStyle = 'compressed';
}

coffeeSources = ['components/coffee/tagline.coffee'];

jsSources = [
  'componets/scripts/rclick.js',
  'componets/scripts/pixgrid.js',
  'componets/scripts/tagline.js',
  'componets/scripts/template.js'
];

sassSources = ['components/sass/style.scss'];

htmlSources = [outputDir + '/*.html'];

jsonSources = [outputDir + '/*.json']

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
  .pipe(gulpif(env === 'production', uglify()))
  .pipe(gulp.dest('builds/development/js'))
});


//Compass - spajanje sass-a u css
gulp.task('compass', function() {
  gulp.src(sassSources)
  .pipe(compass({
    sass: 'components/sass',
    image: outputDir + '/images',
    style: sassStyle,
    comments :true
  }))
  .on('error', gutil.log)
  .pipe(gulp.dest(outputDir + '/css'))
  .pipe(connect.reload())
});

//Default task
gulp.task('default', ['coffee','js','compass','watch','connect','json','html']);

//Watch task
gulp.task('watch', function(){
  gulp.watch(coffeeSources, ['coffee']);
  gulp.watch(jsSources, ['js']);
  gulp.watch('components/sass/*.scss', ['compass']);
  gulp.watch('builds/development/*.html', ['html']);
  gulp.watch(jsonSources, ['json']);
});

//Gulp connect - paljenje servera
gulp.task('connect', function(){
  connect.server({
      root: outputDir,
      livereload: true
});
});

gulp.task('html', function(){
  gulp.src('builds/development/*.html')
  .pipe(gulpif(env === 'production', minifyHTML())) //minify samo za htmk na production
  .pipe(gulpif(env === 'production', gulp.dest(outputDir))) //outputDir za produkciju
  .pipe(connect.reload())
});

gulp.task('json', function(){
  gulp.src(outputDir + '/js/*.json')
  .pipe(connect.reload())
});
