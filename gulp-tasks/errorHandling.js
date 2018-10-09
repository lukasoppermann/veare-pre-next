module.exports = (errordata) => {
  return function error (errordata) {
    require('gulp-util').log(`ERROR: ${errordata.toString()}`)
    this.emit('end')
  }
}
