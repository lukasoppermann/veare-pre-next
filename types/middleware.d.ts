import * as http from 'http'
import { requestInterface } from './request'
export type middleware = (request: requestInterface, response: http.ServerResponse, next, opts?: any) => void;
