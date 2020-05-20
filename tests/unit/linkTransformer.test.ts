import linkTransformer from '../../app/transformer/linkTransformer'
import link from './data/link'
/* global test expect */
describe("linkTransformer", () => {
  test("testing linkTransformer", () => {
    // assertion
    return linkTransformer(link.raw).then(resultData => {
      expect(resultData).toStrictEqual([link.transformed])
    })
  })

})
