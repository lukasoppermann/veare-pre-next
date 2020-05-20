import pageTransformer from '../../app/transformer/pageTransformer'
import page from './data/page'
/* global test expect */
describe("pageTransformer", () => {
  test("testing pageTransformer", () => {
    // assertion
    return pageTransformer(page.raw).then(resultData => {
      expect(resultData).toStrictEqual([page.transformed])
    })
  })

})
