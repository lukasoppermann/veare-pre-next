export interface transformerInterface {
  (rawData): Promise<transformedDataInterface>;
}

export interface transformedDataInterface {
  id: string,
  createdAt: string,
  updatedAt: string,
  contentType: string,
  fields: any
}

export interface transformedPicture extends transformedDataInterface {
   fields: {
    title: string,
    description: string,
    image: transformedAsset,
    sources: transformedPictureSource[],
    style: string,
    classes: string
   }
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
