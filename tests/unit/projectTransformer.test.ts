import projectTransformer from '../../app/transformer/projectTransformer'
import project from './data/projectTestData'
/* global test expect URL */
describe("projectTransformer", () => {
  test("testing projectTransformer", () => {
    // assertion
    return projectTransformer(project.raw).then(resultData => {
      expect(resultData).toStrictEqual([project.transformed])
    })
  })

  test("testing projectTransformer with less than 1 year", () => {
    const input = project.raw
    const output = project.transformed
    // prepare test
    input.fields.durationEnd = { 'en-US': '2017-08-01' }
    output.fields.durationEnd = '2017-08-01'
    output.fields.duration = {
      month: 6,
      totalWeeks: 29,
      years: 0,
    }
    output.fields.years.end = 2017
    // assertion
    return projectTransformer(input).then(resultData => {
      expect(resultData).toStrictEqual([output])
    })
  })

})
