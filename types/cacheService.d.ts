export interface cacheServiceInterface {
  put: (key:string, value:any) => void
  get: (key:string) => any
}
