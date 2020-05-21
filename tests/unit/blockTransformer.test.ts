import blockTransformer from '../../app/transformer/blockTransformer'
import block from './data/block'
/* global test expect */
describe("blockTransformer", () => {
  test("testing blockTransformer", () => {
    // assertion
    return blockTransformer(block.raw).then(resultData => {
      expect(resultData).toStrictEqual([block.transformed])
    })
  })
})
