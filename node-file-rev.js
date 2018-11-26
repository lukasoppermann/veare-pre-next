#!/usr/bin/env node

const argv = require('yargs').argv
const hasha = require('hasha')
const fs = require('fs')
const editJsonFile = require('edit-json-file')

if (!argv.input) {
  throw Error('An input file needs to be provided.')
}

const file = argv.input // 'public/css/app.css'
const revFile = argv.manifest || 'public/rev-manifest.json'
hasha.fromFile(file, { algorithm: 'md5' }).then(hash => {
  // split filename
  let fileArray = file.split('.')
  // get file path without extension
  let filename = fileArray.slice(0, -1).join('.')
  // get file extension
  let extension = fileArray.pop()
  // create hashed filename
  let newFilename = `${filename}-${hash}.${extension}`
  // append hash to file
  fs.rename(file, newFilename, (err) => {
    if (err) {
      throw err
    }
    // If the file doesn't exist, the content will be an empty object by default.
    let jsonFile = editJsonFile(revFile)
    // add file version
    jsonFile.set(file.replace(/\./g, '\\.'), newFilename)
    // save to json
    jsonFile.save()
  })
})
