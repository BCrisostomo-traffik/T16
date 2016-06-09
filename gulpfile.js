var pkg = require('./package.json'),
    gulp = require('gulp'),
    bump = require('gulp-bump'),
    path = require('path'),
    del = require('del'),
    notify = require("gulp-notify"),
    plumber = require("gulp-plumber"),
    browserSync = require('browser-sync'),
    connect = require('gulp-connect-php'),
    less = require('gulp-less'),
    sourcemaps = require('gulp-sourcemaps'),
    uncss = require('gulp-uncss'),
    cssnano = require('gulp-cssnano'),
    gutil = require('gulp-util'),
    processhtml = require('gulp-processhtml'),
    source = require('vinyl-source-stream'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    replace = require('gulp-replace-task'),
    sequence = require('run-sequence'),
    argv = require('yargs').argv,
    gulpif = require('gulp-if'),

// auto prefix
    LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    autoprefixPlugin = new LessPluginAutoPrefix({browsers: ["last 2 versions"]}),

// globals
    versionPattern = 'version',
    namePattern = 'name',
    descPattern = 'desc',

// paths
    paths = {
        SRC: './src',
        BUILD: './build',
        DEBUG: './debug',
        JS: './src/js',
        LESS: './src/less',
        ASSETS: './src/assets'
    },

    production = true;

function getBuildPath() {
    return production ? paths.BUILD : paths.DEBUG;
}

/*********************************
 * ERROR HANDLING / DEBUGGING *
 ********************************/
function handleErrors() {
    return plumber(function () {
        var args = [].slice.apply(arguments);

        // Send error to notification center with gulp-notify
        notify.onError({
            title: "Compile Error",
            message: "<" + "%= error.message %" + ">"
        }).apply(this, args);

        // Keep gulp from hanging on this task
        this.emit('end');
    });
}

function logChanges(event) {
    return gutil.log(
        gutil.colors.green('File ' + event.type + ': ') +
        gutil.colors.magenta(path.basename(event.path))
    );
}

/*********************************
 * VERSIONING / CACHE BUSTING *
 ********************************/
function versionReplace() {
    console.log('replace', pkg.version)
    return replace({
        patterns: [
            {
                match: versionPattern,
                replacement: pkg.version
            }, {
                match: descPattern,
                replacement: pkg.description
            }, {
                match: namePattern,
                replacement: pkg.name
            }
        ]
    });
}

/*********************************
 * GULP TASKS *
 ********************************/
gulp.task('assets', function () {
    return gulp.src(paths.ASSETS + '/**')
        .pipe(gulp.dest(getBuildPath() + '/assets'));
});


gulp.task('vendor', function () {
    return gulp.src(paths.JS + '/vendor/*.js')
        .pipe(gulp.dest(getBuildPath() + '/assets/js/vendor'));
});

/*********************************
 * JS *
 ********************************/
gulp.task('js:debug', function () {
    return gulp.src([
            paths.JS + '/vendor/jquery/jquery-1.11.3.min.js',
            paths.JS + '/vendor/viewport-checker/jquery.viewportchecker.min.js',
            paths.JS + '/vendor/jquery-match-height/jquery.matchHeight-min.js',
            paths.JS + '/vendor/scroll2id/PageScroll2id.min.js',
            paths.JS + '/app.js'
        ])
       // .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
       // .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.DEBUG + '/assets/js'))
});


gulp.task('js:build', function () {
    return gulp.src([
            paths.JS + '/vendor/jquery/jquery-1.11.3.min.js',
            paths.JS + '/vendor/viewport-checker/jquery.viewportchecker.min.js',
            paths.JS + '/vendor/jquery-match-height/jquery.matchHeight-min.js',
            paths.JS + '/vendor/scroll2id/PageScroll2id.min.js',
            paths.JS + '/app.js'
        ])
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest(paths.BUILD + '/assets/js'));
});

/*********************************
 * LESS / CSS *
 ********************************/
gulp.task('css', function () {
    return gulp.src(paths.LESS + '/core.less')
        .pipe(handleErrors())
        .pipe(gulpif(!production, sourcemaps.init()))
        .pipe(less({
            plugins: [autoprefixPlugin]
        }))
        .pipe(concat(production ? 'app.min.css' : 'app.css'))
        .pipe(gulpif(production, cssnano({
            keepSpecialComments: false,
            removeEmpty: true
        })))
        .pipe(gulpif(!production, sourcemaps.write('.')))
        .pipe(gulp.dest(getBuildPath() + '/assets/css'));
});

/*********************************
 * HTML *
 ********************************/
gulp.task('html', function () {
    console.log(pkg.version)
    return gulp.src(paths.SRC + '/*.{html,php}')
        .pipe(versionReplace())
        .pipe(handleErrors())
        .pipe(gulpif(production, processhtml()))
        .pipe(gulp.dest(getBuildPath()));
});

gulp.task('php', function () {
    return gulp.src(paths.SRC + '/*.php')
        .pipe(versionReplace())
        .pipe(handleErrors())
        .pipe(gulpif(production, processhtml()))
        .pipe(gulp.dest(getBuildPath()));
});

/*********************************
 * CLEAN FOLDERS *
 ********************************/
gulp.task('clean', function () {
    return del([
        getBuildPath()
    ], {
        force: true
    });
});

/*********************************
 * WATCH / SERVER (FOR LOCAL DEV) *
 ********************************/
gulp.task('watch', function () {
    gulp.watch(paths.SRC + '/fonts', browserSync.reload)
        .on('error', gutil.log)
        .on('change', logChanges);

    gulp.watch(paths.SRC + '/img/**/*.{png,jpg,gif}', browserSync.reload)
        .on('error', gutil.log)
        .on('change', logChanges);

    gulp.watch(paths.LESS + '/**/*.less', ['css', browserSync.reload])
        .on('error', gutil.log)
        .on('change', logChanges);

    gulp.watch(paths.JS + '/**/*.js', ['js:debug', browserSync.reload])
        .on('error', gutil.log)
        .on('change', logChanges);

    gulp.watch(paths.SRC + '/*.{html,php}', ['html', browserSync.reload])
        .on('error', gutil.log)
        .on('change', logChanges);
});


gulp.task('server:php', function () {
    return connect.server({
        base: './debug/'
    }, function () {
        browserSync({
            proxy: '127.0.0.1:8000'
        });
    });
});

gulp.task('server:html', function () {
    return browserSync({
        server: {
            baseDir: [
                paths.DEBUG
            ]
        }
    });
});

/*********************************
 * MAIN GULP TASKS *
 ********************************/
gulp.task('build', function (done) {
    return sequence('clean', 'html', 'css', production ? 'js:build' : 'js:debug', 'assets', 'vendor', done);
});

gulp.task('default', function (done) {
    production = argv.production;
    if (production) {
        return sequence('build', done);
    } else {
        return sequence('build', 'watch', 'server:php', done);
    }
});