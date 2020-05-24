import { __testing } from '../../app/services/convertRichText' // convertRichText,

describe("convertHyperlinks", () => {
  const anchors: Array<String> = []
  const nodeMock = {
    content: 'link text',
    data: {
      uri: 'http://vea.re'
    }
  }
  // const nodeMockLink = {
  //   content: 'link text',
  //   data: {
  //     uri: 'http://vea.re'
  //   }
  // }
  const nextMock = value => value;
  test('test normal hyperlink transformation', () => {
    expect(anchors.length).toBe(0)
    expect(__testing.convertHyperlinks(nodeMock, nextMock, anchors)).toBe('<a href="http://vea.re">link text</a>')
    expect(anchors.length).toBe(0)
  })

  test('test anchor hyperlink transformation', () => {
    nodeMock.data.uri = 'name=#anchor-Name'
    expect(anchors.length).toBe(0)
    expect(__testing.convertHyperlinks(nodeMock, nextMock, anchors)).toBe('<a name="anchor-name">link text</a>')
    expect(anchors[0]).toBe('anchor-name')
  })

  test('test wrong anchor hyperlink transformation', () => {
    nodeMock.data.uri = 'name=anchor-Name'
    expect(anchors.length).toBe(1)
    expect(__testing.convertHyperlinks(nodeMock, nextMock, anchors)).toBe('<a href="name=anchor-Name">link text</a>')
    expect(anchors.length).toBe(1)
  })
})

describe("convertEmbeddedEntries", () => {
  test.todo("testing convertEmbeddedEntries")
})

describe("richText service", () => {
  test.todo("testing richText service")
})
