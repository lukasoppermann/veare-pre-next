const express = require('express')
const router = express.Router()
const helmetSettings = require('../config/helmet-settings.js')

router.use(require('body-parser').json({ type: 'application/*+json' }))
router.use(require('compression')())
// router.use(require('./nounce'))
router.use(require('helmet')(helmetSettings))
router.use(express.static('public', { maxAge: '365d' }))
router.use(require('./staticFiles'))

if (process.env.NODE_ENV === 'development') {
  router.use(require('../middleware/staticFilesReload'))
}

module.exports = router
