const express = require('express')
const router = express.Router()
const cache = require('../services/cacheService')()
const revFiles = require('../services/files')

router.use((_req, _res, next) => {
  console.log('Running dev middleware')
  // add files to cache
  cache.put('files', revFiles(true))
  next()
})

module.exports = router
