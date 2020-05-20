import codeTransformer from '../../app/transformer/codeTransformer'
import code from './data/code'
/* global test expect */
describe("codeTransformer", () => {
  test("testing codeTransformer", () => {
    // assertion
    return codeTransformer(code.raw).then(resultData => {
      expect(resultData).toStrictEqual([code.transformed])
    })
  })

})
