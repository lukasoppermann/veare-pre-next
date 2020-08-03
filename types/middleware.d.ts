import * as http from 'http'
export type middleware = (request: http.IncomingMessage, response: http.ServerResponse, next, opts?: any) => void;
