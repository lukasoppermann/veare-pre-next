import assetTransformer from '../../app/transformer/assetTransformer'
import asset from './data/asset'
/* global test expect */
// ---------
// Run test
describe("assetTransformer", () => {
  test("testing assetTransformer", () => {
    // assertion
    return assetTransformer(asset.raw).then(resultData => {
      expect(resultData).toStrictEqual([asset.transformed])
    })
  })

})
