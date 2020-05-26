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

describe("sortByFieldDesc", () => {
  test("sortByFieldDesc not ordered correct", () => {
    const entries = [
    {
      fields: {
        title: "Post 1",
        rawdate: "2018-02-01"
      }
    },
    {
      fields: {
        title: "Post 2",
        rawdate: "2018-03-03"
      }
    }]
    // prep test
    expect(entries[0].fields.title).toBe("Post 1")
    expect(entries[1].fields.title).toBe("Post 2")
    // run function
    const sorted = __testing.sortByFieldDesc(entries, __testing.getFieldRawDateAsIso)
    // assertion
    expect(sorted[0].fields.title).toBe("Post 2")
    expect(sorted[1].fields.title).toBe("Post 1")
  })

  test("sortByFieldDesc keep order if correct", () => {
    const entries = [
    {
      fields: {
        title: "Post 2",
        rawdate: "2018-03-03"
      }
    },
    {
      fields: {
        title: "Post 1",
        rawdate: "2018-01-02"
      }
    }]
    // prep test
    expect(entries[0].fields.title).toBe("Post 2")
    expect(entries[1].fields.title).toBe("Post 1")
    // run function
    const sorted = __testing.sortByFieldDesc(entries, __testing.getFieldRawDateAsIso)
    // assertion
    expect(sorted[0].fields.title).toBe("Post 2")
    expect(sorted[1].fields.title).toBe("Post 1")
  })
})
