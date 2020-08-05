import * as http2 from 'http2'
import { requestInterface } from '../../types/request'

export interface connectRequest extends http2.Http2ServerRequest {
  originalUrl: string
}

export default (request: connectRequest): requestInterface => {
  const url = new URL(request.originalUrl, `https://${request.headers[':authority']}`)
  return Object.assign({
    path: url.pathname,
    parts: url.pathname.replace('/', '').split('/'),
    // @ts-ignore
    parameters: Object.fromEntries(url.searchParams.entries())
  }, request)
}
