import config from '../config/appConfig'
import Analytics from 'analytics'
import googleAnalytics from '@analytics/google-analytics'

export default Analytics({
  app: config.appName,
  plugins: [
    googleAnalytics({
      trackingId: config.trackingId
    })
  ]
})
