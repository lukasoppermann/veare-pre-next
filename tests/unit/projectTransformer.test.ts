import projectTransformer from '../../app/transformer/projectTransformer'
import project from './data/project'
/* global test expect */
describe("projectTransformer", () => {
  test("testing projectTransformer", () => {
    // assertion
    return projectTransformer(project.raw).then(resultData => {
      expect(resultData).toStrictEqual([project.transformed])
    })
  })

})
