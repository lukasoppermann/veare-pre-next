import { __testing } from '../../app/services/contentful'
import contentTypes from './data/contentTypes'
import { contentfulEntriesRaw, contentfulEntriesTransformed } from './data/contentfulEntries'
/* global test expect */

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
    'article',
    'project',
    'page',
    'link',
    'picture',
    'pictureSource',
    'block',
    'code',
    'token'
  ];

  test("sortContentByType all correct", () => {
    const sortedContent = __testing.sortContentByType(contentTypes, contentfulEntriesTransformed)
    expect(Object.keys(sortedContent)).toEqual(sortedKeys)
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

    expect(values).toEqual(expect.arrayContaining([
      { contentType: 'article', count: 1 },
      { contentType: 'project', count: 1 },
      { contentType: 'page', count: 1 },
      { contentType: 'link', count: 1 },
      { contentType: 'picture', count: 1 },
      { contentType: 'block', count: 1 },
      { contentType: 'code', count: 1 },
      null
    ]))
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
    expect(Object.keys(sortedContent)).toEqual(expect.arrayContaining(sortedKeys))
  })
})
