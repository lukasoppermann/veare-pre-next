export default {
  raw: {
    originalUrl: '/work/test/nyon?partials=true',
    uri: 'http://localhost:8080',
    headers: {
      host: 'localhost:8080',
      Authorization: 'Basic ' + new Buffer(`validUser:validPw`).toString('base64')
    }
  },
  transformed: {
    originalUrl: '/work/test/nyon?partials=true',
    headers: {
      host: 'localhost:8080',
      Authorization: 'Basic ' + new Buffer(`validUser:validPw`).toString('base64')
    },
    path: '/work/test/nyon',
    parts: ['work','test','nyon'],
    parameters: {
      partials: 'true'
    }
  }
}
