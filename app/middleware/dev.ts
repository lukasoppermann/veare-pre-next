const express = require('express')
const router = express.Router()
const getFiles = require('../modules/files')

router.use((req, _res, next) => {
  req.app.locals.files = getFiles()
  next()
})

module.exports = router
