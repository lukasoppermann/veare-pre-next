import config from '../config/contentful'
import { cacheServiceInterface } from '../../types/cacheService'
const memoryCache = require('memory-cache')
const flatCache = require('flat-cache')
const path = require('path')

const flatCacheWrapper = (): cacheServiceInterface => {
  const cache = {
    cacheType: 'flatCache'
  } as any
  // store data
  cache._data = flatCache.load('offlineDbCache', path.resolve('./.cache'))
  // define access methods
  // cache PUT
  cache.put = (key, value) => {
    cache._data.setKey(key, value)
    cache._data.save(true)
    return true
  }
  // cache get
  cache.get = key => cache._data.getKey(key)
  // cache delete
  cache.delete = key => {
    cache._data.removeKey(key)
    cache._data.save()
  }
  // return cache
  return cache
}

const memoryCacheWrapper = (): cacheServiceInterface => {
  const cache = {
    cacheType: 'memoryCache'
  } as any
  const flatCacheForOffline = flatCacheWrapper()
  // define access methods
  // cache PUT
  cache.put = (key, value) => {
    flatCacheForOffline.put(key, value)
    return memoryCache.put(key, value)
  }
  // cache get
  cache.get = key => memoryCache.get(key)
  // cache delete
  cache.delete = key => {
    flatCacheForOffline.delete(key)
    memoryCache.del(key)
  }
  // return cache
  return cache
}

// get the right cachre
const getUsedCache = (env:string, online:string|null): cacheServiceInterface => {
  // keep original on production
  // production or testing
  if (env !== 'development') {
    return memoryCacheWrapper()
  }
  // development
  if (online === null) {
    console.info(`"${config.host[env]}" not available, using file cache…`)
    return flatCacheWrapper()
  } else {
    console.info(`Database available at "${config.host[env]}", refreshing file cache…`)
    return memoryCacheWrapper()
  }
}

// get environment and online state
/* istanbul ignore next */
const env = process.env.NODE_ENV || 'development'
const online = require('dns-sync').resolve(config.host[env])

export default getUsedCache(env, online)
export const __testing = {
  flatCacheWrapper: flatCacheWrapper,
  memoryCacheWrapper: memoryCacheWrapper,
  getUsedCache: getUsedCache
}
