const express = require('express')
const router = express.Router()
const cache = require('../services/cacheService')()
const revFiles = require('../services/files')

router.use((req, _res, next) => {
  req.app.locals.files = revFiles(true)
  // add files to cache
  cache.put('files', revFiles(true))
  next()
})

module.exports = router
