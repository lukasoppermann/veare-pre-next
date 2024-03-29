import { contentfulContent } from './contentfulContent'

export interface transformerInterface {
  (rawContent: contentfulContent): Promise<transformedDataInterface>;
}

export interface fieldsTransformerInterface {
  (rawContent: contentfulContent): Promise<transformedFields>;
}

export interface transformedDataInterface {
  id: string,
  createdAt: string,
  updatedAt: string,
  contentType: string,
  type: 'Entry' | 'Asset',
  fields: transformedFields |
    transformedCodeFields |
    transformedLinkFields |
    transformedPictureFields |
    transformedPictureSourceFields |
    transformedBlockFields |
    transformedPageFields |
    transformedArticleFields |
    transformedProjectFields |
    transformedAssetFields
}

export interface transformedPicture extends transformedDataInterface {
   fields: transformedPictureFields
}

export interface transformedPictureFields {
  title: string,
  description: string,
  image: transformedAsset,
  sources: transformedPictureSource[],
  style: string,
  classes: string
}

export interface transformedPictureSource extends transformedDataInterface {
   fields: transformedPictureSourceFields
}

export interface transformedAsset extends transformedDataInterface {
  fields: transformedAssetFields
}

export interface transformedFields {
  title?: string,
  slug?: string,
  classes?: string,
  content?: string,
  [key: string]: any
}

export interface transformedTokenFields extends transformedFields {
  tokenType: 'placeholder',
  value: string
}

export interface transformedCodeFields extends transformedFields {
  fileOrPath: string,
  code: string,
  language: string
}

export interface transformedBlockFields extends transformedFields {
  slug: string,
  classes: string,
  content: string
}


export interface transformedAssetFields extends transformedFields {
    title: string,
    description: string,
    url: string,
    fileName: string,
    details: {
      size: number,
      image: {
        width: number,
        height: number
      }
    },
    sizeInBytes: number,
    width: number,
    height: number,
    fileType: string
}
export interface transformedLinkFields extends transformedFields {
  title: string,
  subtitle: string,
  link: string,
  target: '_blank' | '_self',
  rel: 'noopener' | '',
  picture: transformedPicture,
  classes: string
}

export interface transformedPictureSourceFields extends transformedFields {
  srcset: string,
  fileType: string,
  sizes?: string,
  media?: string
}
export interface transformedPictureFields extends transformedFields {
  title: string,
  description: string,
  image: transformedAsset,
  sources: transformedPictureSource[],
  style: string,
  classes: string
}
export interface transformedProjectFields extends transformedFields {
  slug: string,
  title: string,
  durationStart: string,
  durationEnd: string,
  duration: {
    totalWeeks: number,
    years: number,
    month: number
  },
  years: {
    start: number,
    end: number
  },
  client: string,
  approach: string,
  responsibilities: string[],
  platforms: string[],
  team: string[],
  header: transformedPicture,
  previewImage: transformedPicture,
  description: string,
  content: string,
  anchors: string[]
}


export interface transformedPageFields extends transformedFields {
  slug: string,
  title: string,
  rawLastIteration: string,
  lastIteration: string,
  description: string,
  content: string,
  embeddedBlocks: any[]
}

export interface transformedArticleFields extends transformedFields {
  slug: string,
  title: string,
  rawLastIteration: string,
  lastIteration: string,
  description: string,
  content: string,
  readingTime: number,
  category: 'category' | 'design',
  relatedContent: string[]
}