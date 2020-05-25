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

  test("testing linkTransformer with targetBlank false", () => {
    // prepare test
    const linkRaw = link.raw
    linkRaw.fields.targetBlank['en-US'] = false;
    const linkTransformed = link.transformed
    linkTransformed.fields.target = "_self";
    linkTransformed.fields.rel = "";
    // assertion
    return linkTransformer(linkRaw).then(resultData => {
      expect(resultData).toStrictEqual([linkTransformed])
    })
  })

})
