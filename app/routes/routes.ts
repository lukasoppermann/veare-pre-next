import { middleware } from '../../types/middleware'
import error404 from './404'
import contentful from './contentful'
import revisionedFiles from './revisionedFiles'
// import menu from './menu'
import template from './template'
import project from './project'
import blog from './blog'
import page from './page'
// const app = require('express')
// const router = app.Router()
/* =================
// Normal Routes
================= */
// router.get(/^\/fragment\/menu$/, menu)
const routing: middleware = async (req, res, next) => {
  // parse url
  const path = (req.url || '').replace(/^\/+|\/+$/g, '')
  // test path and call route
  switch (path) {
    case '':
      template(req, res, next, 'progressive')
      break
    case 'home':
      page(req, res, next, 'homepage')
      break
    case 'privacy':
      page(req, res, next, 'page')
      break
    case 'blog':
      blog(req, res, next)
      break
    case 'work':
      project(req, res, next)
      break
    case 'revisionedFiles':
      revisionedFiles(req, res, next)
      break
    case 'contentful':
      contentful(req, res, next)
      break
    default:
      error404(req, res, next, { location: '/' })
  }
}

export default routing
