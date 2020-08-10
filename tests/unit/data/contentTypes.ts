export default {
  sys: { type: 'Array' },
  total: 9,
  skip: 0,
  limit: 100,
  items: [
    {
      sys: {
        space: {
          sys: { type: 'Link', linkType: 'Space', id: '5dfliyp93yzg' }
        },
        type: 'ContentType',
        id: 'block',
        revision: 9,
        createdAt: '2020-04-21T14:40:05.526Z',
        updatedAt: '2020-05-18T11:09:38.672Z',
        environment: {
          sys: { id: 'master', type: 'Link', linkType: 'Environment' }
        }
      },
      displayField: 'cmsTitle',
      name: 'Block',
      description: 'A block of content. This can be used to collect multiple entries, or just wrap a text with a class.',
      fields: [
        {
          id: 'cmsTitle',
          name: 'CMS Title',
          type: 'Symbol',
          localized: false,
          required: true,
          disabled: false,
          omitted: false
        },
        {
          id: 'slug',
          name: 'Slug',
          type: 'Symbol',
          localized: false,
          required: false,
          disabled: false,
          omitted: false
        },
        {
          id: 'content',
          name: 'Content',
          type: 'RichText',
          localized: false,
          required: true,
          disabled: false,
          omitted: false
        },
        {
          id: 'classes',
          name: 'Classes',
          type: 'Array',
          localized: false,
          required: false,
          disabled: false,
          omitted: false,
          items: { type: 'Symbol', validations: [] }
        }
      ]
    },
    {
      sys: {
        space: {
          sys: { type: 'Link', linkType: 'Space', id: '5dfliyp93yzg' }
        },
        type: 'ContentType',
        id: 'article',
        revision: 25,
        createdAt: '2018-12-02T08:41:34.969Z',
        updatedAt: '2020-04-29T08:00:20.633Z',
        environment: {
          sys: { id: 'master', type: 'Link', linkType: 'Environment' }
        }
      },
      displayField: 'title',
      name: 'Article',
      description: 'An article on the blog',
      fields: [
        {
          id: 'title',
          name: 'Title',
          type: 'Symbol',
          localized: false,
          required: true,
          disabled: false,
          omitted: false
        },
        {
          id: 'slug',
          name: 'Slug',
          type: 'Symbol',
          localized: false,
          required: false,
          disabled: false,
          omitted: false
        },
        {
          id: 'date',
          name: 'Date',
          type: 'Date',
          localized: false,
          required: true,
          disabled: false,
          omitted: false
        },
        {
          id: 'category',
          name: 'Category',
          type: 'Symbol',
          localized: false,
          required: true,
          disabled: false,
          omitted: false
        },
        {
          id: 'featuredImage',
          name: 'Featured Image',
          type: 'Link',
          localized: false,
          required: false,
          disabled: true,
          omitted: false,
          linkType: 'Entry'
        },
        {
          id: 'preview',
          name: 'Preview',
          type: 'Text',
          localized: false,
          required: true,
          disabled: false,
          omitted: false
        },
        {
          id: 'seoDescription',
          name: 'SEO Description',
          type: 'Symbol',
          localized: false,
          required: true,
          disabled: false,
          omitted: false
        },
        {
          id: 'content',
          name: 'Content',
          type: 'RichText',
          localized: false,
          required: true,
          disabled: false,
          omitted: false
        }
      ]
    },
    {
      sys: {
        space: {
          sys: { type: 'Link', linkType: 'Space', id: '5dfliyp93yzg' }
        },
        type: 'ContentType',
        id: 'project',
        revision: 58,
        createdAt: '2018-01-22T06:55:20.698Z',
        updatedAt: '2020-04-28T13:59:40.952Z',
        environment: {
          sys: { id: 'master', type: 'Link', linkType: 'Environment' }
        }
      },
      displayField: 'title',
      name: 'Project',
      description: '',
      fields: [
        {
          id: 'title',
          name: 'Title',
          type: 'Symbol',
          localized: false,
          required: true,
          disabled: false,
          omitted: false
        },
        {
          id: 'subtitle',
          name: 'Subtitle',
          type: 'Symbol',
          localized: false,
          required: false,
          disabled: false,
          omitted: false
        },
        {
          id: 'slug',
          name: 'Slug',
          type: 'Symbol',
          localized: false,
          required: true,
          disabled: false,
          omitted: false
        },
        {
          id: 'durationStart',
          name: 'DurationStart',
          type: 'Date',
          localized: false,
          required: true,
          disabled: false,
          omitted: false
        },
        {
          id: 'durationEnd',
          name: 'DurationEnd',
          type: 'Date',
          localized: false,
          required: true,
          disabled: false,
          omitted: false
        },
        {
          id: 'client',
          name: 'Client',
          type: 'Symbol',
          localized: false,
          required: false,
          disabled: false,
          omitted: false
        },
        {
          id: 'header',
          name: 'Header',
          type: 'Link',
          localized: false,
          required: true,
          disabled: false,
          omitted: false,
          linkType: 'Entry'
        },
        {
          id: 'previewImage',
          name: 'Preview Image',
          type: 'Link',
          localized: false,
          required: true,
          disabled: false,
          omitted: false,
          linkType: 'Asset'
        },
        {
          id: 'content',
          name: 'Content',
          type: 'RichText',
          localized: false,
          required: true,
          disabled: false,
          omitted: false
        },
        {
          id: 'variables',
          name: 'Variables',
          type: 'Object',
          localized: false,
          required: false,
          disabled: false,
          omitted: false
        }
      ]
    },
    {
      sys: {
        space: {
          sys: { type: 'Link', linkType: 'Space', id: '5dfliyp93yzg' }
        },
        type: 'ContentType',
        id: 'link',
        revision: 5,
        createdAt: '2019-11-30T22:11:23.086Z',
        updatedAt: '2020-04-28T13:57:42.502Z',
        environment: {
          sys: { id: 'master', type: 'Link', linkType: 'Environment' }
        }
      },
      displayField: 'title',
      name: 'Link',
      description: 'A link to an internal or external page',
      fields: [
        {
          id: 'title',
          name: 'Title',
          type: 'Symbol',
          localized: false,
          required: true,
          disabled: false,
          omitted: false
        },
        {
          id: 'subtitle',
          name: 'Subtitle',
          type: 'Symbol',
          localized: false,
          required: false,
          disabled: false,
          omitted: false
        },
        {
          id: 'link',
          name: 'Link',
          type: 'Symbol',
          localized: false,
          required: true,
          disabled: false,
          omitted: false
        },
        {
          id: 'targetBlank',
          name: 'Open in new window',
          type: 'Boolean',
          localized: false,
          required: true,
          disabled: false,
          omitted: false
        },
        {
          id: 'picture',
          name: 'Picture',
          type: 'Link',
          localized: false,
          required: false,
          disabled: false,
          omitted: false,
          linkType: 'Entry'
        },
        {
          id: 'cssClasses',
          name: 'CSS Classes',
          type: 'Array',
          localized: false,
          required: false,
          disabled: false,
          omitted: false,
          items: { type: 'Symbol', validations: [] }
        }
      ]
    },
    {
      sys: {
        space: {
          sys: { type: 'Link', linkType: 'Space', id: '5dfliyp93yzg' }
        },
        type: 'ContentType',
        id: 'textSection',
        revision: 34,
        createdAt: '2018-01-21T13:43:29.741Z',
        updatedAt: '2020-04-27T15:23:08.471Z',
        environment: {
          sys: { id: 'master', type: 'Link', linkType: 'Environment' }
        }
      },
      displayField: 'textType',
      name: 'Text',
      description: 'A text block',
      fields: [
        {
          id: 'textType',
          name: 'Text Type',
          type: 'Symbol',
          localized: false,
          required: true,
          disabled: false,
          omitted: false
        }
      ]
    },
    {
      sys: {
        space: {
          sys: { type: 'Link', linkType: 'Space', id: '5dfliyp93yzg' }
        },
        type: 'ContentType',
        id: 'picture',
        revision: 11,
        createdAt: '2020-04-23T10:44:41.827Z',
        updatedAt: '2020-04-27T08:35:23.487Z',
        environment: {
          sys: { id: 'master', type: 'Link', linkType: 'Environment' }
        }
      },
      displayField: 'title',
      name: 'Picture',
      description: '',
      fields: [
        {
          id: 'title',
          name: 'Title',
          type: 'Symbol',
          localized: false,
          required: true,
          disabled: false,
          omitted: false
        },
        {
          id: 'description',
          name: 'Description',
          type: 'RichText',
          localized: false,
          required: false,
          disabled: false,
          omitted: false
        },
        {
          id: 'sources',
          name: 'Sources',
          type: 'Array',
          localized: false,
          required: true,
          disabled: false,
          omitted: false,
          items: { type: 'Link', validations: [Array], linkType: 'Asset' }
        },
        {
          id: 'style',
          name: 'Style',
          type: 'Symbol',
          localized: false,
          required: false,
          disabled: false,
          omitted: false
        },
        {
          id: 'classes',
          name: 'Classes',
          type: 'Array',
          localized: false,
          required: false,
          disabled: false,
          omitted: false,
          items: { type: 'Symbol', validations: [] }
        }
      ]
    },
    {
      sys: {
        space: {
          sys: { type: 'Link', linkType: 'Space', id: '5dfliyp93yzg' }
        },
        type: 'ContentType',
        id: 'page',
        revision: 27,
        createdAt: '2018-02-05T07:03:08.672Z',
        updatedAt: '2020-04-27T08:12:25.361Z',
        environment: {
          sys: { id: 'master', type: 'Link', linkType: 'Environment' }
        }
      },
      displayField: 'title',
      name: 'Page',
      description: '',
      fields: [
        {
          id: 'title',
          name: 'Title',
          type: 'Symbol',
          localized: false,
          required: true,
          disabled: false,
          omitted: false
        },
        {
          id: 'slug',
          name: 'Slug',
          type: 'Symbol',
          localized: false,
          required: false,
          disabled: false,
          omitted: false
        },
        {
          id: 'content',
          name: 'Content',
          type: 'RichText',
          localized: false,
          required: true,
          disabled: false,
          omitted: false
        }
      ]
    },
    {
      sys: {
        space: {
          sys: { type: 'Link', linkType: 'Space', id: '5dfliyp93yzg' }
        },
        type: 'ContentType',
        id: 'code',
        revision: 5,
        createdAt: '2018-12-29T11:14:51.598Z',
        updatedAt: '2019-12-03T16:33:35.743Z',
        environment: {
          sys: { id: 'master', type: 'Link', linkType: 'Environment' }
        }
      },
      displayField: 'fileOrPath',
      name: 'Code',
      description: 'A block of code',
      fields: [
        {
          id: 'fileOrPath',
          name: 'File or Path',
          type: 'Symbol',
          localized: false,
          required: true,
          disabled: false,
          omitted: false
        },
        {
          id: 'language',
          name: 'Language',
          type: 'Symbol',
          localized: false,
          required: true,
          disabled: false,
          omitted: false
        },
        {
          id: 'code',
          name: 'Code',
          type: 'Text',
          localized: false,
          required: true,
          disabled: false,
          omitted: false
        }
      ]
    }
  ]
}
