const strip = require('gulp-strip-comments');
const eslint = require('gulp-eslint');
const stripDebug = require('gulp-strip-debug');
const { src, dest, series } = require('gulp');
const flatten = require('gulp-flatten');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
const glob = require('glob');
const eventStream = require('event-stream');
const buffer = require('vinyl-buffer');

function lint() {
    return src('./src/**.js')
        .pipe(eslint({ useEslintrc: true }))
        .pipe(eslint.format(''))
        .pipe(eslint.failAfterError());
}

function taskerfy(done) {
    glob('**/tasker*js', { ignore: '!src/tasker*' }, function (err, files) {
        if (err) {
            done(err);
        }
        var tasks = files.map(function (entry) {
            return browserify({ entries: [entry] })
                .bundle()
                .pipe(source(entry))
                .pipe(buffer())
                .pipe(strip({ line: true }))
                .pipe(stripDebug())
                .pipe(flatten())
                .pipe(dest('dist'));
        });
        eventStream.merge(tasks).on('end', done);
    });
}

exports.lint = lint;
exports.taskerfy = taskerfy;
exports.default = series(lint, taskerfy);
