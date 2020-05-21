import config from '../config/contentful'
import { cacheServiceInterface } from '../../types/cacheService'
const memoryCache = require('memory-cache')
const flatCache = require('flat-cache')
const path = require('path')

const env = process.env.NODE_ENV || 'development'
const online = require('dns-sync').resolve(config.host[env])

const flatCacheWrapper = (): cacheServiceInterface => {
  const cache = {} as any
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
  const cache = {} as any
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

// if (env !== 'development')
// keep original on production
let usedCache = memoryCache

if (env === 'development') {
  if (online === null) {
    console.info(`"${config.host[env]}" not available, using file cache…`)
    usedCache = flatCacheWrapper()
  } else {
    console.info(`Database available at "${config.host[env]}", refreshing file cache…`)
    usedCache = memoryCacheWrapper()
  }
}

export default () => usedCache
export const __testing = {
  flatCacheWrapper: flatCacheWrapper,
  memoryCacheWrapper: memoryCacheWrapper
}
