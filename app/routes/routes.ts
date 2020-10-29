import { middleware } from '../../types/middleware'
import request from '../services/request'
import error404 from './404'
import contentful from './contentful'
import analytics from '../services/analytics'
import config from '../config/appConfig'
import { v4 as uuidv4 } from 'uuid'
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
  // send analyics tracker
  if (!req.cookies.get('veareNoTracking') &&
  (req.parts[0] === undefined || [
    '',
    'home',
    'blog',
    'work',
    'privacy',
    'now',
    'about-lukas-oppermann'
  ].includes(req.parts[0]))
  ) {
    // get user id from cookies
    let userId = req.cookies.get('pageId')
    // if user id is not in cookie, create and add cookie
    if (!userId) {
      userId = uuidv4()
      req.cookies.set('pageId', userId)
    }
    // set user for analytics
    analytics.identify(userId)
    // send page view
    analytics.page({
      title: req.path || 'home',
      // @ts-ignore
      href: config.baseUrl,
      path: req.path || '/'
    })
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
    case 'contentful':
      contentful(req, res, next)
      break
    default:
      error404(req, res, next, { location: '/' })
  }
}

export default routing
