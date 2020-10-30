import * as http2 from 'http2'
import cookies from 'connect-cookies'
import { requestInterface } from '../../types/request'
const nodeUrl = require('url')

export interface connectRequest extends http2.Http2ServerRequest {
  originalUrl: string,
  cookies: cookies
}

export default (request: connectRequest): requestInterface => {
  const url = new nodeUrl.URL(`https://${request.headers[':authority']}${request.originalUrl}`)

  // return request object
  return Object.assign({
    path: url.pathname.replace(/(\/$)/mg, ''),
    parts: url.pathname.replace(/(^\/|\/$)/mg, '').split('/'),
    // @ts-ignore
    parameters: Object.fromEntries(url.searchParams.entries())
  }, request)
}
