import { middleware } from '../../types/middleware'
import contentfulConfig from '../config/contentful'
import contentful from '../services/contentful'
import basicAuth from '../services/basicAuth'

const route: middleware = (req, res) => {
  if (basicAuth(req, contentfulConfig.webhookUser, contentfulConfig.webhookPassword)) {
    contentful()
    res.setHeader('Content-Type', 'text/plain')
    res.end('OK')
  }
  // login failed
  res.statusCode = 401
  res.end('Unauthorized')
}

export default route
