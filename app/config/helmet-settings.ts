export default {
  frameguard: {
    action: 'deny'
  },
  hsts: {
    // Must be at least 1 year to be approved
    maxAge: 0
    // Must be enabled to be approved
    // includeSubDomains: true,
    // preload: false
  },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'www.google-analytics.com', 'www.googletagmanager.com', 'plausible.io'],
      styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      imgSrc: ["'self'", 'www.google-analytics.com', 'images.contentful.com', 'images.ctfassets.net', 'data:'],
      connectSrc: ["'self'", 'apis.google.com', 'fonts.googleapis.com', 'www.google-analytics.com', 'plausible.io'],
      fontSrc: ["'self'", 'fonts.gstatic.com', 'fonts.googleapis.com'],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      mediaSrc: ["'self'"],
      manifestSrc: ["'self'"],
      frameSrc: ["'none'"],
      workerSrc: ["'self'"],
      formAction: ['vea.us1.list-manage.com/'],
      baseUri: ["'none'"],
      reportUri: 'https://veare.report-uri.com/r/d/csp/enforce'
    }
  }
}
