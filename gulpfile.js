const { src, dest, parallel, series, watch } = require('gulp');
const webpack = require('webpack-stream');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const cleancss = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const newer = require('gulp-newer');
const strip = require('gulp-strip-comments');
const del = require('del');
//---------------------------------------------------------------//
const browserSync = require('browser-sync').create();

//---------------------------------------------------------------//

function browsersync() {
    browserSync.init({
        // proxy: "optimized.dev", // domain name ( Open Server: Setting > Domain )
        server: { baseDir: './src', https: true },
        ghostMode: { clicks: false },
        notify: false,
        online: true, // tunnel: 'yousutename', // Attempt to use the URL https://yousutename.loca.lt
    });
}

function scripts() {
    return src('src/js/scripts.js')
        .pipe(
            webpack({
                mode: 'production',
                performance: { hints: false },
                module: {
                    rules: [
                        {
                            test: /\.(js)$/,
                            exclude: /(node_modules)/,
                            loader: 'babel-loader',
                        },
                    ],
                },
            })
        )
        .on('error', function handleError() {
            this.emit('end');
        })
        .pipe(concat('scripts.min.js'))
        .pipe(dest('src/js'))
        .pipe(browserSync.stream()); // optional
}

function styles() {
    return src('src/styles/styles.scss')
        .pipe(eval(sass)())
        .pipe(concat('styles.min.css'))
        .pipe(
            autoprefixer({
                overrideBrowserslist: ['last 10 versions'],
                grid: true,
            })
        )
        .pipe(
            cleancss({
                level: { 1: { specialComments: 0 } } /* format: 'beautify' */,
            })
        )
        .pipe(dest('src/styles/'))
        .pipe(browserSync.stream()); // optional
}

function cleanimg() {
    return del('src/img/dist/**/*', { force: true });
}

function img() {
    return src(['src/img/src/**/*', '!src/**/*.zip', '!src/**/*.rar'])
        .pipe(newer('src/img/dist'))
        .pipe(webp({ quality: 70 }))
        .pipe(dest('src/img/dist'))
        .pipe(src(['src/img/src/**/*', '!src/**/*.zip', '!src/**/*.rar']))
        .pipe(newer('src/img/dist'))
        .pipe(imagemin())
        .pipe(dest('src/img/dist'))
        .pipe(browserSync.stream()); // optional
}

function buildcopy() {
    return src(
        [
            'src/js/scripts.min.js',
            '!src/js/*.json',
            'src/styles/styles.min.css',
            'src/fonts/**/*',

            'src/*.*',
            '!src/*.html',
            '!src/*.php',

            'src/img/**/*.*',
            '!src/img/src/**/*',
            '!src/img/dist/**/old/**.*',

            '!src/**/*.zip',
            '!src/**/*.rar',
        ],
        { base: 'src/' }
    ).pipe(dest('dist'));
}

function removeComments() {
    return src(['src/*.php', 'src/*.html']).pipe(strip()).pipe(dest('dist'));
}

function cleandist() {
    return del('dist/**/*', { force: true });
}

function startwatch() {
    watch(`src/styles/**/*.scss`, { usePolling: true }, styles);
    watch(
        ['src/js/**/*.js', '!src/js/**/*.min.js'],
        { usePolling: true },
        scripts
    );
    watch(
        'src/img/src/**/*.{jpg,jpeg,png,webp,svg,gif}',
        { usePolling: true },
        img
    );
    watch(`src/**/*.{php,html,htm,txt,json,md,woff2}`, { usePolling: true }).on(
        'change',
        browserSync.reload
    );
}

exports.js = series(scripts);
exports.scss = series(styles);
exports.img = series(cleanimg, img);
exports.html = series(removeComments);
exports.build = series(
    cleandist,
    scripts,
    styles,
    cleanimg,
    img,
    buildcopy,
    removeComments
);
exports.default = series(scripts, styles, parallel(browsersync, startwatch));
