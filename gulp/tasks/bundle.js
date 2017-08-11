const path = require('path')

const gulp = require('gulp')
const browserify = require('browserify')
const babelify = require('babelify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const sourcemaps = require('gulp-sourcemaps')
const uglify = require('gulp-uglify')
const gutil = require('gulp-util')

const config = require('../config')

gulp.task('bundle:app', () => {
  const basename = path.basename(config.paths.app.src)
  const dirname = path.dirname(config.paths.app.src)
  const rootbase = path.basename(dirname) + '/' + basename
  const rootdir = path.dirname(dirname)

  const browser = browserify({
    debug: true,
    entries: rootbase,
    basedir: rootdir
  })

  const babel = babelify.configure({
    presets: ['es2015', 'es2016'],
    plugins: [
      ['transform-builtin-extend', { globals: ['Array'] }],
      'transform-runtime'
    ]
  })

  return browser
    .transform(babel)
    .bundle()
    .pipe(source(config.names.app))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.mapSources(sourcePath => {
      return sourcePath.replace(/^(?:\.\.\/)+/, '')
    }))
    .on('error', gutil.log)
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.paths.app.dst))
})

gulp.task('bundle:lib', () => {
  const basename = path.basename(config.paths.lib.src)
  const dirname = path.dirname(config.paths.lib.src)
  const rootbase = path.basename(dirname) + '/' + basename
  const rootdir = path.dirname(dirname)

  const browser = browserify({
    debug: true,
    entries: rootbase,
    basedir: rootdir,
    standalone: config.names.glob
  })

  const babel = babelify.configure({
    presets: ['es2015', 'es2016'],
    plugins: [
      ['transform-builtin-extend', { globals: ['Array'] }],
      'transform-runtime'
    ]
  })

  return browser
    .transform(babel)
    .bundle()
    .pipe(source(config.names.lib))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.paths.lib.dst))
})

gulp.task('bundle', ['bundle:lib', 'bundle:app'])
