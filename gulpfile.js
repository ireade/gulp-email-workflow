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

gulp.task('sassInline', function(callback) {
    return gulp.src('src/sass/inline.scss')
        .pipe(
           postcss(postcssProcessors, {syntax: scss})
        )
        .pipe(
            sass({ outputStyle: 'expanded' })
            .on('error', gutil.log)
        )
        .pipe(gulp.dest('tmp/'));
});


gulp.task('sassNotInline', function(callback) {
    return gulp.src('src/sass/not-inline.scss')
        .pipe(
           postcss(postcssProcessors, {syntax: scss})
        )
        .pipe(
            sass({ outputStyle: 'compressed' })
            .on('error', gutil.log)
        )
        .pipe(gulp.dest('tmp/')); 
});



var inlineCss = require('gulp-inline-css');

gulp.task('inlinecss', ['sassInline', 'nunjucks'], function() {
    return gulp.src('tmp/*.html')
        .pipe(
            inlineCss({
                applyStyleTags: false,
                removeStyleTags: false
            })
            .on('error', gutil.log)
        )
        .pipe(gulp.dest('build/'));

});






/* *************
  TEMPLATING
************* */

var nunjucksRender = require('gulp-nunjucks-render');
var data = require('gulp-data');


gulp.task('nunjucks', ['sassNotInline'], function() {

    return gulp.src('src/emails/*.nunjucks')
        .pipe(data(function() {
            return {
                mailchimp: require('./src/data/mailchimp.json')
            };

        }))
        .pipe(nunjucksRender({
          path: ['src/templates/', 'tmp/']
        }))
        .pipe(gulp.dest('tmp'));

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

var filesToWatch = [
    'src/sass/**/*.scss',
    'src/emails/*.nunjucks',
    'src/templates/**/*.nunjucks',
    'src/data/*.json'
]

gulp.task('watch', function() {
    gulp.watch(filesToWatch,['nunjucks', 'inlinecss']); 
});


/* *************
    DEFAULT
************* */

gulp.task('default', ['connect', 'nunjucks', 'inlinecss', 'watch']);





