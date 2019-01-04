module.exports = {
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
