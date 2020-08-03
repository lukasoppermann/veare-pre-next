import error404 from './404'
import contentful from './contentful'
import revisionedFiles from './revisionedFiles'
// import menu from './menu'
import project from './project'
import page from './page'
const app = require('express')
const router = app.Router()
/* =================
// Normal Routes
================= */
// router.get(/^\/fragment\/menu$/, menu)
// ## Home
router.get(/^\/?$/, require('./home').progressive)
router.get(/^\/home$/, (req, res, next) => page(req, res, next, 'homepage'))
// ## Privacy
router.get('/privacy', (req, res, next) => page(req, res, next, 'page'))
// ## Blog
router.get('/blog', require('./blog').index)
router.get(/^\/blog\/([\w-]+)/, require('./blog').get)
// ## Work
router.get(/^\/work\/([\w-]+)/, project)
/* =================
// UTILS
================= */
// return revisioned files json
router.use('/revisionedFiles', revisionedFiles)
// activate webhook
router.use('/contentful', contentful)
// handle 404
router.use(error404)

module.exports = router
