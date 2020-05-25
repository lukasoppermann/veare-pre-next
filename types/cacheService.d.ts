export interface cacheServiceInterface {
  cacheType: "flatCache" | "memoryCache"
  put: (key:string, value:any) => void
  get: (key:string) => any
  delete: (key:string) => void
}
