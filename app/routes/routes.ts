import { middleware } from '../../types/middleware'
import request from '../services/request'
import error404 from './404'
import contentful from './contentful'
import revisionedFiles from './revisionedFiles'
import analytics from '../services/analytics'
// import config from '../config/appConfig'
// import menu from './menu'
import project from './project'
import blog from './blog'
import page from './page'
/* =================
// Normal Routes
================= */
// router.get(/^\/fragment\/menu$/, menu)
const routing: middleware = async (req, res, next) => {
  // parse url
  req = request(req)
  if (!req.cookies.get('veareNoTracking') && [
    '',
    'home',
    'blog',
    'work',
    'privacy',
    'now',
    'about-lukas-oppermann'
  ].includes(req.parts[0])) {
    analytics.page(
      // {
      // title: req.path,
      // url: `${config.baseUrl}/${req.path}`,
      // path: req.path
      // }
    )
  }
  // test path and call route
  switch (req.parts[0]) {
    case '':
      page(req, res, next, 'homepage')
      break
    case 'home':
      page(req, res, next, 'homepage')
      break
    case 'privacy':
      page(req, res, next, 'page')
      break
    case 'about-lukas-oppermann':
      page(req, res, next, 'about')
      break
    case 'now':
      page(req, res, next, 'page')
      break
    case 'designsystem':
      page(req, res, next, 'designsystem')
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
