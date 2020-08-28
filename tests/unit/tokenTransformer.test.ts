import tokenTransformer from '../../app/transformer/tokenTransformer'
import tokenTestData from './data/tokenTestData'
/* global test expect */
describe("tokenTransformer", () => {
  test("testing tokenTransformer", () => {
    // assertion
    return tokenTransformer(tokenTestData.raw).then(resultData => {
      expect(resultData).toStrictEqual([tokenTestData.transformed])
    })
  })

})
