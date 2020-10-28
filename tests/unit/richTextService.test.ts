import convertRichText, { __testing } from '../../app/services/convertRichText'
import blockTransformer from '../../app/transformer/blockTransformer'
import blockTemplate from '../../app/templates/newPartials/block'
import richText from './data/richTextTestData'

describe("convertHyperlinks", () => {
  const anchors: Array<String> = []
  const nodeMock = {
    content: 'link text',
    data: {
      uri: 'http://vea.re'
    }
  }
  const nextMock = value => value;
  test('test normal hyperlink transformation', () => {
    expect(anchors.length).toBe(0)
    expect(__testing.convertHyperlinks(nodeMock, nextMock, anchors)).toBe('<a href="http://vea.re" rel="noopener noreferrer nofollow" target="_blank">link text</a>')
    expect(anchors.length).toBe(0)
  })

  test('test anchor hyperlink transformation', () => {
    nodeMock.data.uri = 'name=#anchor-Name'
    expect(anchors.length).toBe(0)
    expect(__testing.convertHyperlinks(nodeMock, nextMock, anchors)).toBe('<a name="anchor-name">link text</a>')
    expect(anchors[0]).toBe('anchor-name')
  })

  test('test wrong anchor hyperlink transformation', () => {
    nodeMock.data.uri = '/anchor-Name'
    expect(anchors.length).toBe(1)
    expect(__testing.convertHyperlinks(nodeMock, nextMock, anchors)).toBe('<a href="/anchor-Name">link text</a>')
    expect(anchors.length).toBe(1)
  })
})

describe("convertEmbeddedEntries", () => {
  const mockTransformers = {
    block: blockTransformer
  }
  const mockTemplates = {
    block: blockTemplate
  }

  test('null provieded as richText', () => {
    //@ts-ignore
    __testing.convertEmbeddedEntries(null).then(result => {
      expect(result).toStrictEqual([])
    })
  })

  test('valid richText conversion', () => {
    return __testing.convertEmbeddedEntries(richText.raw, mockTemplates, mockTransformers).then(result => {
      expect(result[0].html.trim()).toStrictEqual(`<a class="link__anchor" name="about-resume"></a>
<div class="Block ">
  <p>Hello</p>
</div>`)
    })
  })
})

describe("richText default export service", () => {
  test('convert richText', () => {
    return convertRichText(richText.raw).then(result => {
      expect(result.anchors).toStrictEqual(["design"])
      expect(result.html).toStrictEqual(richText.transformed)
    })
  })
})
