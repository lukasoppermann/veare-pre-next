import { connectRequest } from '../../../app/services/request'
export default {
  raw: <connectRequest>{
    originalUrl: '/work/test/nyon?partials=true',
    headers: {
      host: 'localhost:8080'
    }
  },
  transformed: {
    originalUrl: '/work/test/nyon?partials=true',
    headers: {
      host: 'localhost:8080'
    },
    path: '/work/test/nyon',
    parts: ['work','test','nyon'],
    parameters: {
      partials: 'true'
    }
  }
}
