import basicAuth from '../../app/services/basicAuth'
import requestData from './data/requestTestData'
/* global test expect */
// @ts-ignore

describe("basicAuth service", () => {

  test.skip("testing valid credentials", () => {
    // assertion
    return expect(basicAuth(requestData.raw, 'validUser', 'validPw')).toStrictEqual(true)
  })

  test("testing invalid credentials", () => {
    // assertion
    return expect(basicAuth(requestData.raw, 'invalidUser', 'invalidPw')).toStrictEqual(false)
  })
})
