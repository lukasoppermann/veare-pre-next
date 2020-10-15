import slugToUrl from '../../app/services/slugToUrl'
/* global test expect */
describe("slugToUrl", () => {
  test("testing slugToUrl service happy flow", () => {
    // assertion
    expect(slugToUrl('slug', 'project')).toStrictEqual('/work/slug')
    expect(slugToUrl('slug', 'page')).toStrictEqual('/slug')
    expect(slugToUrl('slug', 'article')).toStrictEqual('/blog/slug')
  })

  test("testing slugToUrl service leadingSlash false", () => {
    // assertion
    expect(slugToUrl('slug', 'project', true)).toStrictEqual('/work/slug')
    expect(slugToUrl('slug', 'project', false)).toStrictEqual('work/slug')
  })

  test("testing slugToUrl service with wrong content type", () => {
    function catchError() {
      // @ts-ignore
      slugToUrl('slug', 'wrongType')
    }
    // assertion
    expect(catchError).toThrowError(new Error(`🚨 \x1b[31mError converting slug, undefined prefix requested: "wrongType"\x1b[0m`))
  })
})
