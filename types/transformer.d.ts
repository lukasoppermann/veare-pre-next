export interface transformerInterface {
  (rawData): Promise<transformedDataInterface>;
}

export interface transformedDataInterface {
  id: String,
  createdAt: String,
  updatedAt: String,
  fields: Object<any>
}
