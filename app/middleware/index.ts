import helmetSettings from '../config/helmet-settings'
const express = require('express')
const router = express.Router()

router.use(express.json({ type: 'application/*+json' }))
router.use(require('compression')())
router.use(require('helmet')(helmetSettings))
router.use(express.static('public', { maxAge: '365d', etag: false }))

module.exports = router
