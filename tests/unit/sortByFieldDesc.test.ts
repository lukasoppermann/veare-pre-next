import sortByFieldDesc from '../../app/services/sortByFieldDesc'
/* global test expect */
describe("sortByFieldDesc", () => {
  // stub
  const getFieldRawLastIterationAsIso = data => new Date(data.fields.rawLastIteration)

  test("sortByFieldDesc not ordered correct", () => {
    const entries = [
      {
        fields: {
          title: "Post 1",
          rawLastIteration: "2018-02-01"
        }
      },
      {
        fields: {
          title: "Post 2",
          rawLastIteration: "2018-03-03"
        }
      }]
    // prep test
    expect(entries[0].fields.title).toBe("Post 1")
    expect(entries[1].fields.title).toBe("Post 2")
    // run function
    const sorted = sortByFieldDesc(entries, getFieldRawLastIterationAsIso)
    // assertion
    expect(sorted[0].fields.title).toBe("Post 2")
    expect(sorted[1].fields.title).toBe("Post 1")
  })

  test("sortByFieldDesc keep order if correct", () => {
    const entries = [
      {
        fields: {
          title: "Post 3",
          rawdate: "2018-03-03"
        }
      },
      {
        fields: {
          title: "Post 2",
          rawdate: "2018-01-02"
        }
      },
      {
        fields: {
          title: "Post 1",
          rawdate: "2018-01-02"
        }
      }]
    // prep test
    expect(entries[0].fields.title).toBe("Post 3")
    expect(entries[1].fields.title).toBe("Post 2")
    expect(entries[2].fields.title).toBe("Post 1")
    // run function
    const sorted = sortByFieldDesc(entries, getFieldRawLastIterationAsIso)
    // assertion
    expect(sorted[0].fields.title).toBe("Post 3")
    expect(sorted[1].fields.title).toBe("Post 2")
    expect(sorted[2].fields.title).toBe("Post 1")
  })
})