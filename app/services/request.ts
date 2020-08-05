import * as http from 'http'
import { requestInterface } from '../../types/request'
export default (request: http.IncomingMessage): requestInterface => {
  const url = new URL(request.url || '', `https://${request.headers.host}`)

  return Object.assign({
    path: url.pathname,
    parts: url.pathname.replace('/', '').split('/'),
    // @ts-ignore
    parameters: Object.fromEntries(url.searchParams.entries())
  }, request)
}
