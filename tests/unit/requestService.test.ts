import request from '../../app/services/request'
import requestData from './data/requestTestData'
/* global test expect */
describe("request service", () => {
  test("testing request service", () => {
    // assertion
    // @ts-ignore
    return expect(request(requestData.raw)).toStrictEqual(requestData.transformed)
  })
})
