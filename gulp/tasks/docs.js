const gulp = require('gulp')
const jsdoc = require('gulp-jsdoc3')

const config = require('../config')
const jsdocConfig = require('../jsdoc')

gulp.task('docs', (callback) => {
  gulp.src(config.paths.docs.src, {read: false})
    .pipe(jsdoc(jsdocConfig, callback))
})
