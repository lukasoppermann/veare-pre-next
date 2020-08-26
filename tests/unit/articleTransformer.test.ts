import articleTransformer from '../../app/transformer/articleTransformer'
import article from './data/articleTestData'
/* global test expect */
describe("articleTransformer", () => {
  test("testing articleTransformer", () => {
    // assertion
    return articleTransformer(article.raw).then(resultData => {
      expect(resultData).toStrictEqual([article.transformed])
    })
  })

})
