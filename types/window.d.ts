declare interface Window {
  app: {
    baseUrl: string,
    files?: {
      js: {},
      css: {}
    }
    fetchInject: (...args: any[]) => Promise<any>
  }
}
