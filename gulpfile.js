var gulp = require('gulp');
var gutil = require('gulp-util');


/* *************
  Config
************* */

var globalData = {
    mailchimp: require('./src/data/mailchimp.json')
};


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
        .pipe(gulp.dest('build/css/'));
});

gulp.task('sassEmbedded', function(callback) {
    return gulp.src('src/sass/embedded.scss')
        .pipe(
           postcss(postcssProcessors, {syntax: scss})
        )
        .pipe(
            sass({ outputStyle: 'compressed' })
            .on('error', gutil.log)
        )
        .pipe(gulp.dest('build/css/')); 
});



var inlineCss = require('gulp-inline-css');

gulp.task('inlinecss', ['sassInline', 'nunjucks'], function() {
    return gulp.src('build/*.html')
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

gulp.task('nunjucks', ['sassEmbedded'], function() {
    return gulp.src('src/emails/*.nunjucks')
        .pipe(
            data(function() {
                return globalData;
            })
            .on('error', gutil.log)
        )
        .pipe(
            nunjucksRender({
                path: ['src/templates/', 'build/css/']
            })
            .on('error', gutil.log)
        )
        .pipe(gulp.dest('build/'));
});


/* *************
    ZIP
************* */

var zip = require('gulp-zip');

gulp.task('zip', function () {
    return gulp.src('build/**')
        .pipe(zip('build.zip'))
        .pipe(gulp.dest('./'));
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


