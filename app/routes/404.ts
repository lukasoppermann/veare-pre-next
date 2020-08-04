import { middleware } from '../../types/middleware'

const route: middleware = (req, res, _next, opts = {}) => {
  console.error(`🚨 \x1b[31m404 Page not found: ${req.url}\x1b[0m`)
  res.writeHead(301, { Location: (opts.location || '/') })
  return res.end()
}

export default route
