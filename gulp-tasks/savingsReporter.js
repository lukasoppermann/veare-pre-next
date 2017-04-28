const size = require('gulp-size')

class Savings{

  start(){
    return this.before = size({showTotal: false})
  }
  stop(){
    return this.after = size({showTotal: false})
  }
  gziped(){
    return this.gzip = size({
      showTotal: false,
      gzip: true
    })
  }

  report(prefix = ''){
    const chalk = require('chalk')
    require('gulp-util').log(prefix + ' ' +
      chalk.white.bgGreen.bold(` ${this.calcSavings(this.before, this.after)}% saved `) +
      ` Total size ${this.after.prettySize} / ` +
      chalk.green.bold(`${this.gzip.prettySize} (gzip)`)
    )
  }

  calcSavings(before, after){
    return Math.floor(((before.size - after.size) / before.size * 100))
  }
}

module.exports = () => new Savings()
