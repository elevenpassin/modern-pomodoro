const gulp = require('gulp');
const del = require('del');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

const paths = {
  styles: {
    src: 'src/styles/**/*.pcss',
    dest: 'dist/styles/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'dist/scripts/'
  },
  images: {
    src: 'src/images/**/*',
    dest: 'dist/images/'
  },
  sw: {
    src: 'src/sw.js',
    dest: 'dist/sw.js'
  },
  otherFiles: {
    src: [
      'src/*.html',
      'src/*.mp3',
      'src/*.json',
      'src/*.ico'
    ],
    dest: 'dist'
  }
}

function sw() {
  return gulp.src(paths.sw.src, { since: gulp.lastRun(sw) })
    .pipe(gulp.dest(paths.sw.dest));
}

function images() {
  return gulp.src(paths.images.src, { since: gulp.lastRun(images) })
    .pipe(gulp.dest(paths.images.dest));
}

function clean() {
  return del(['dist']);
}

function styles() {
  return gulp.src(paths.styles.src, { since: gulp.lastRun(styles) })
    .pipe(sourcemaps.init())
    .pipe(
      postcss([
        require('precss'),
        require('autoprefixer')
      ])
    )
    .pipe(cleanCSS())
    .pipe(
      rename((path) => {
        path.extname = '.css'
      })
    )
    .pipe( sourcemaps.write('.') )
    .pipe( gulp.dest(paths.styles.dest) );
}

function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true, since: gulp.lastRun(scripts) })
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest));
}

function otherFiles() {
  return gulp.src(paths.otherFiles.src)
    .pipe(gulp.dest(paths.otherFiles.dest));
}

function watch() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.otherFiles.src, otherFiles);
  gulp.watch(paths.sw.src, sw);
}



const build = gulp.series(clean, gulp.parallel(styles, scripts, images, otherFiles, sw));

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.otherFiles = otherFiles;
exports.sw = sw;
exports.watch = watch;
exports.build = build;
exports.default = build;