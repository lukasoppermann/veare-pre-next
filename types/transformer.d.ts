export interface transformerInterface {
  (rawData): Promise<transformedDataInterface>;
}

export interface transformedDataInterface {
  id: String,
  createdAt: String,
  updatedAt: String,
  contentType: String,
  fields: any
}
