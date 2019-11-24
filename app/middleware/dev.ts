const express = require('express')
const router = express.Router()
const cache = require('../services/cacheService')()
const revFiles = require('../services/files')

router.use((_req, _res, next) => {
  console.log('Running dev middleware')
  // console.log('dev before: ', cache.get('files'))
  // add files to cache
  cache.put('files', revFiles(true))
  // console.log('dev after: ', cache.get('files').css)
  next()
})

module.exports = router
