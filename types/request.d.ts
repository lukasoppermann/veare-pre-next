import cookies from 'connect-cookies'
import * as http2 from 'http2'
export interface requestInterface extends http2.Http2ServerRequest {
  path: string,
  parts: string[],
  originalUrl: string,
  cookies: cookies,
  parameters: {
    [key: string]: string
  }
}
