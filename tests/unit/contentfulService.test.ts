import { __testing } from '../../app/services/contentful'
import contentTypes from './data/contentTypes'
import { contentfulEntriesRaw, contentfulEntriesTransformed } from './data/contentfulEntries'
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
    const sorted = __testing.sortByFieldDesc(entries, __testing.getFieldRawDateAsIso)
    // assertion
    expect(sorted[0].fields.title).toBe("Post 3")
    expect(sorted[1].fields.title).toBe("Post 2")
    expect(sorted[2].fields.title).toBe("Post 1")
  })
})

describe("transformEntries", () => {
  const mockTransformerFn = item => [{...item, transformed: true}]
  const mockTransformerFunctions = {
    article: mockTransformerFn,
    asset: mockTransformerFn,
    block: mockTransformerFn,
    code: mockTransformerFn,
    link: mockTransformerFn,
    page: mockTransformerFn,
    picture: mockTransformerFn,
    project: mockTransformerFn
  }
  test("transformEntries", () => {
    return __testing.transformEntries(contentfulEntriesRaw, mockTransformerFunctions).then(results => {
      expect(results.reduce((accumulator, obj) => {
        if(obj.transformed === true) {
          return accumulator + 1
        }
      }, 0 /*initial accumulator value*/)).toBe(7)
    })
  })
})

describe("sortContentByType", () => {
  const sortedKeys = [
    'block',
    'article',
    'project',
    'link',
    'textSection',
    'picture',
    'page',
    'code'
  ];

  test("sortContentByType all correct", () => {
    const sortedContent = __testing.sortContentByType(contentTypes, contentfulEntriesTransformed)
    expect(Object.keys(sortedContent)).toStrictEqual(sortedKeys)
    // test if values ar correctly sorted
    const values = Object.values(sortedContent).map(item => {
      if (item !== undefined && item[0] !== undefined) {
        return {
          contentType: item[0].contentType,
          count: item.length
        }
      }
      return null
    })

    expect(values).toStrictEqual([
      { contentType: 'block', count: 1 },
      { contentType: 'article', count: 1 },
      { contentType: 'project', count: 1 },
      { contentType: 'link', count: 1 },
      null,
      { contentType: 'picture', count: 1 },
      { contentType: 'page', count: 1 },
      { contentType: 'code', count: 1 }
    ])
  })

  test("sortContentByType with unknow item", () => {
    const withWrongEntry = contentfulEntriesTransformed.concat({
        id: '17MuwC1Ho2IMMAUyocU28o',
        createdAt: '2018-02-05T07:04:38.785Z',
        updatedAt: '2020-05-19T12:42:35.026Z',
        contentType: 'wrong',
        fields: {}
    })

    const sortedContent = __testing.sortContentByType(contentTypes, withWrongEntry)
    // assertion
    expect(Object.keys(sortedContent)).toStrictEqual(sortedKeys)
  })
})
