import { revisionedFiles } from '../services/files'
const express = require('express')
const fs = require('fs')
const router = express.Router()

router.use((_req, _res, next) => {
  console.debug('Running dev middleware')
  // update files
  revisionedFiles(JSON.parse(fs.readFileSync('public/rev-manifest.json', 'utf8')))
  next()
})

module.exports = router
