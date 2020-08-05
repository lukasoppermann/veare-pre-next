import * as http from 'http'
export interface requestInterface extends http.IncomingMessage {
  path: string,
  parts: string[],
  parameters: {
    [key: string]: string
  }
}
