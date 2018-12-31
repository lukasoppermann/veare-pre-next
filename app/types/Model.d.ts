interface Model {
  Transformer: any
  contentType: string
  content(): Array<Resource>
  all(): Array<Resource>
  find(id: string): Resource
  findByField (type: string, value: any): Array<Resource>
  findByArrayField (type: string, value: any): Array<Resource>
}
