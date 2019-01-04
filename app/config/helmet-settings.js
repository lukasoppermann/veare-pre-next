module.exports = {
  frameguard: {
    action: 'deny'
  },
  hsts: {
    // Must be at least 1 year to be approved
    maxAge: 63072000,
    // Must be enabled to be approved
    includeSubDomains: true,
    preload: true
  },
  hidePoweredBy: {
    setTo: 'PHP 4.2.0'
  },
  xssFilter: {
    reportUri: 'https://veare.report-uri.com/r/d/xss/enforce'
  },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'www.google-analytics.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      imgSrc: ["'self'", 'www.google-analytics.com', 'images.contentful.com', 'images.ctfassets.net', 'data:'],
      connectSrc: ["'self'", 'apis.google.com', 'fonts.googleapis.com', 'polyfill.io'],
      fontSrc: ["'self'", 'fonts.gstatic.com', 'fonts.googleapis.com'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      workerSrc: ["'self'"],
      reportUri: 'https://veare.report-uri.com/r/d/csp/enforce'
    }
  }
}
