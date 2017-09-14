module.exports = (errordata) => {
  return function error (errordata) {
    require('gulp-util').log(require('chalk').white.bgRed.bold(`ERROR:`) + ` ${errordata.toString()}`)
    this.emit('end')
  }
}
