import request from '../../app/services/request'
import requestData from './data/request'
/* global test expect */
describe("request service", () => {
  test("testing request service", () => {
    // assertion
    return expect(request(requestData.raw)).toStrictEqual(requestData.transformed)
  })
})
