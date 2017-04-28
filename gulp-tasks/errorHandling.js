module.exports = (error) => {
  return function error(error){
    require('gulp-util').log(require('chalk').white.bgRed.bold(`ERROR:`) + ` ${error.toString()}`)
    this.emit('end')
  }
}
