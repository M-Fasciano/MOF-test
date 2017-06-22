'use strict';

var gulp = require('gulp'),
	gutil = require('gulp-util'),
    wait = require('gulp-wait'),
	sourcemaps = require('gulp-sourcemaps');
	
//styles task dependencies
var sass = require('gulp-sass');

//scripts task dependencies
var browserify = require('gulp-browserify');

//server task dependencies
var connect = require('gulp-connect'),
    open = require('gulp-open');

var config = {
    source: 'source/',
    output: 'dist/'
}

gulp.task('default', ['server', 'styles', 'scripts', 'html', 'copy', 'watch']);

gulp.task('html', function() {
    return gulp.src(config.source + '/html/**/*.html')
        .pipe(gulp.dest(config.output))
        .pipe(connect.reload());
});

gulp.task('styles', function() {
    return gulp.src(config.source + 'scss/core.scss')
        .pipe(sourcemaps.init())
            .pipe(sass({
                linenos: true
            }))
        .pipe(sourcemaps.write())
        .on('error', function(err) { console.error(err); this.emit('end'); })
        .pipe(gulp.dest(config.output + 'css/'))
        .pipe(wait(1000))
        .pipe(connect.reload());
});

gulp.task('scripts', function() {
    return gulp.src(config.source + 'js/main.js')
        .pipe(sourcemaps.init())
        .pipe(browserify())
        .pipe(sourcemaps.write())
        .on('error', function(err) { console.error(err); this.emit('end'); })
        .pipe(gulp.dest(config.output + 'js/'))
        .pipe(connect.reload());
});

gulp.task('connect', function() {
    return connect.server({
        root: config.output,
        port: 9012,
        livereload: true
    })
});

gulp.task('server', ['connect'], function() {
    return gulp.src(__filename)
        .pipe(open({
            uri: 'http://localhost:9012'
        }))
});

gulp.task('copy', function() {
    return gulp.src([
            config.source + 'images/**/*.*'
        ])
        .on('error', function(err) { console.error(err); this.emit('end'); })
        .pipe(gulp.dest(config.output + 'images/'))
        .pipe(connect.reload());
});

gulp.task('watch', function() {
	//HTML watch
    gulp.watch(
        config.source + 'html/**/*',
        ['html']
    ).on('change', function(file) {
        watchMessage("HTML", file);
    })
    //CSS watch
    gulp.watch(
        config.source + 'scss/**/*',
        ['styles']
    ).on('change', function(file) {
        watchMessage("CSS", file);
    })
    //JS watch
    gulp.watch(
        config.source + 'js/**/*',
        ['scripts']
    ).on('change', function(file) {
        watchMessage("JS", file);
    })
    //Images watch
    gulp.watch([
            config.source + 'images/**/*'
        ],
        ['copy']
    ).on('change', function(file) {
        watchMessage("images", file);
    })
});

function watchMessage(taskname, file) {
    return gutil.log(
        "File: ",
        gutil.colors.green(file.path),
        gutil.colors.cyan("caused " + taskname + " watch to run")
    );
}