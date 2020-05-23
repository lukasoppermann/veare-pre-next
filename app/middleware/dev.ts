// import cache from '../services/cacheService'
import files from '../services/files'
const express = require('express')
const router = express.Router()

router.use((_req, _res, next) => {
  console.debug('Running dev middleware')
  // update files
  files(true)
  next()
})

module.exports = router
