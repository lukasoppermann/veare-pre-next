import pictureTransformer from '../../app/transformer/pictureTransformer'
import picture from './data/picture'
/* global test expect */
// ---------
// Run test
describe("pictureTransformer", () => {
  test("testing pictureTransformer", () => {
    // assertion
    return pictureTransformer(picture.raw).then(resultData => {
      expect(resultData).toStrictEqual([picture.transformed])
    })
  })

})
