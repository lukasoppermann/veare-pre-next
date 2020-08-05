import * as http from 'http'
export default {
  raw: <http.IncomingMessage>{
    url: '/work/nyon?partials=true',
    headers: {
      host: 'localhost:8080'
    }
  },
  transformed: {
    url: '/work/nyon',
    headers: {
      host: 'localhost:8080'
    },
    path: '/work/nyon',
    parts: ['work','nyon'],
    parameters: {
      partials: 'true'
    }
  }
}
