var gulp = require('gulp');
var gutil = require('gulp-util');


/* *************
  CSS
************* */

var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var scss = require('postcss-scss');
var autoprefixer = require('autoprefixer');
var postcssProcessors = [
    autoprefixer( { browsers: ['last 2 versions', 'ie > 10'] } )
]

var inlineCss = require('gulp-inline-css');

var inlineSASS = 'sass/inline.scss';
var notInlineSASS = 'sass/not-inline.scss';

var sassFiles = 'sass/*.scss';

gulp.task('css', function() {
    gulp.src(inlineSASS)
        .pipe(
           postcss(postcssProcessors, {syntax: scss})
        )
        .pipe(
            sass({ outputStyle: 'expanded' })
            .on('error', gutil.log)
        )
        .pipe(gulp.dest(''));

    gulp.src('src/index.html')
        .pipe(
            inlineCss()
            .on('error', gutil.log)
        )
        .pipe(gulp.dest('build/'));
});





/* *************
  File Inclued
************* */

var fileinclude = require('gulp-file-include');

gulp.task('fileinclude', function() {
  gulp.src(['index.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('src/'));


    
});



/* *************
	SERVER
************* */

var connect = require('gulp-connect');

gulp.task('connect', function() {
  connect.server({
    port: 8000
  });
});



/* *************
    WATCH
************* */

gulp.task('watch', function() {
    gulp.watch(sassFiles,['css']); 
});


/* *************
    DEFAULT
************* */

var activeTasks = ['connect', 'fileinclude', 'css'];

gulp.task('default', activeTasks);





