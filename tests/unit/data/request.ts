import { connectRequest } from '../../../app/services/request'
export default {
  raw: <connectRequest>{
    originalUrl: '/work/nyon?partials=true',
    headers: {
      host: 'localhost:8080'
    }
  },
  transformed: {
    originalUrl: '/work/nyon?partials=true',
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
