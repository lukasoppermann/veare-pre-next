import config from '../config/appConfig'
import Analytics from 'analytics'
import googleAnalytics from '@analytics/google-analytics'
import { requestInterface } from '../../types/request'
import { v4 as uuidv4 } from 'uuid'

// intiate analytics module
const analytics = Analytics({
  app: config.appName,
  plugins: [
    googleAnalytics({
      trackingId: config.trackingId
    })
  ]
})

export default (req:requestInterface) => {
  // send analyics tracker
  if (!req.cookies.get('veareNoTracking') && req.parts[0] !== 'contentful') {
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
}
