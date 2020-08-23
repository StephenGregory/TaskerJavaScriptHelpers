/*eslint-env node */
const strip = require('gulp-strip-comments');
const eslint = require('gulp-eslint');

const { src, dest, series } = require('gulp');

function clean(cb) {
    return src('./src/**/*.js')
        .pipe(strip({ line: true }))
        .pipe(dest('dist'));
}

function lint(cb) {
    return src('./src/**/*.js')
        .pipe(eslint({ useEslintrc: true }))
        .pipe(eslint.format(''))
        .pipe(eslint.failOnError());
}

exports.default = series(lint, clean);
