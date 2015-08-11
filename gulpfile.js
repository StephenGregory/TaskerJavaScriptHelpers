/*eslint-env node */
var gulp = require('gulp');
var strip = require('gulp-strip-comments');
var eslint = require('gulp-eslint');

gulp.task('default', ['lint'], function () {
    return gulp.src('./src/**/*.js')
        .pipe(strip({line: true}))
        .pipe(gulp.dest('dist'));
});

gulp.task('lint', function () {
    return gulp.src('./src/**/*.js')
        .pipe(eslint({useEslintrc: true}))
        .pipe(eslint.format(''))
        .pipe(eslint.failOnError());
});
