export interface transformerInterface {
  (rawData): Promise<transformedData>;
}

export interface transformedData {
  id: String,
  createdAt: String,
  updatedAt: String,
  fields: Object<any>
}
