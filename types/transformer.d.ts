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
    sources: transformedAsset[],
    style: string,
    classes: string
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
