import cache from '../services/cacheService'
const express = require('express')
const router = express.Router()
const revFiles = require('../services/files')

router.use((_req, _res, next) => {
  console.debug('Running dev middleware')
  // add files to cache
  cache().put('files', revFiles(true))
  next()
})

module.exports = router
