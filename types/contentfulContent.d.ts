export interface contentfulContent {
  sys: {
      space: {
        sys: {
          type: 'Link',
          linkType: 'Space',
          id: string
        }
      },
      id: string,
      type: 'Entry' | 'Asset',
      contentType: {
        sys: {
          type: 'Link',
          linkType: 'ContentType',
          id: 'article' | 'asset' | 'block' | 'code' | 'link' | 'page' | 'picture' | 'pictureSource' | 'project'
        }
      },
      revision: Number,
      createdAt: string,
      updatedAt: string,
      environment: {
        sys: {
          id: string,
          type: 'Link',
          linkType: 'Environment'
        }
      }
    },
    fields: {
      [key: string]: {
        'en-US': string | object | any[]
      }
    }
}
