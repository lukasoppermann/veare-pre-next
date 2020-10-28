import { default as articleTransformer, __testing} from '../../app/transformer/articleTransformer'
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

describe("getFieldRawLastIterationAsIso", () => {
  test("getFieldRawLastIterationAsIso", () => {
    expect(__testing.getFieldRawLastIterationAsIso({
      fields: {
        rawLastIteration: "2018-01-02"
      }
    }).toISOString()).toBe("2018-01-02T00:00:00.000Z")
  })
})

describe("randomBetween", () => {
  test("randomBetween", () => {
    const randomA = __testing.randomBetween(1,100)
    const randomB = __testing.randomBetween(1, 100)
    // compare
    expect(randomA).not.toBe(randomB)
    expect(randomA).toBeGreaterThanOrEqual(1)
    expect(randomA).toBeLessThan(101)
    expect(randomB).toBeGreaterThanOrEqual(1)
    expect(randomB).toBeLessThan(101)
  })
})