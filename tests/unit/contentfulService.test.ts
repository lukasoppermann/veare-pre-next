import { __testing } from '../../app/services/contentful'

/* global test expect */
describe("getFieldRawDateAsIso", () => {

  test("getFieldRawDateAsIso", () => {
    expect(__testing.getFieldRawDateAsIso({
      fields: {
        rawdate: "2018-01-02"
      }
    }).toISOString()).toBe("2018-01-02T00:00:00.000Z")
  })
})
