import slugToUrl from '../../app/services/slugToUrl'
/* global test expect */
describe("slugToUrl", () => {
  test("testing slugToUrl service", () => {
    // assertion
    expect(slugToUrl('slug', 'project')).toStrictEqual('/work/slug')
    expect(slugToUrl('slug', 'page')).toStrictEqual('/slug')
    expect(slugToUrl('slug', 'article')).toStrictEqual('/blog/slug')
  })

  test("testing slugToUrl service with wrong content type", () => {
    function catchError() {
      slugToUrl('slug', 'projects')
    }
    // assertion
    expect(catchError).toThrowError(new Error(`🚨 \x1b[31mError converting slug, undefined prefix requested: "projects"\x1b[0m`))
  })
})
