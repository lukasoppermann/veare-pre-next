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
  fields: any
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
   fields: {
    srcset: string,
    type: string,
    sizes?: string,
    media?: string
   }
}

export interface transformedAsset extends transformedDataInterface {
  fields: {
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
    contentType: string
  }
}

export interface transformedFields {
  slug?: string,
  classes?: string,
  content?: string,
  [key: string]: any
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
