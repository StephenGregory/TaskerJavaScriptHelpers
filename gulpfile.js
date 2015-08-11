/*eslint-env node */
var gulp = require('gulp');
var strip = require('gulp-strip-comments');

gulp.task('default', function () {
    return gulp.src('./src/**/*.js')
        .pipe(strip({line: true}))
        .pipe(gulp.dest('dist'));
});
