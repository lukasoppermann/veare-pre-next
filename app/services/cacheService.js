const memoryCache = require('memory-cache')
const flatCache = require('flat-cache')
const config = require('../config/contentful.js')
const path = require('path')

const env = process.env.NODE_ENV
const online = require('dns-sync').resolve(config.host[env])

const flatCacheWrapper = () => {
  const cache = {}
  // store data
  cache.data = flatCache.load('offlineDbCache', path.resolve('../cache'))
  // define access methods
  // cache PUT
  cache.put = (key, value) => {
    cache.data.setKey(key, value)
    cache.data.save(true)
    return true
  }
  // cache get
  cache.get = key => cache.data.getKey(key)
  // return cache
  return cache
}

const memoryCacheWrapper = () => {
  const cache = {}
  const flatCacheForOffline = flatCacheWrapper()
  // define access methods
  // cache PUT
  cache.put = (key, value) => {
    flatCacheForOffline.put(key, value)
    return memoryCache.put(key, value)
  }
  // cache get
  cache.get = key => memoryCache.get(key)

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

module.exports = () => usedCache
