const config = require('./ui.config.js')
const fs = require('fs')

if (!fs.existsSync(config.testSnaps)){
    console.debug(`Creating directory: ${config.testSnaps}`)
    fs.mkdirSync(config.testSnaps)
}

Object.entries(config.cases).forEach(item => {
  let dir = `${config.testSnaps}/${item[1].folder}`
  if (!fs.existsSync(dir)){
      console.debug(`Creating directory: ${dir}`)
      fs.mkdirSync(dir)
  }
})
