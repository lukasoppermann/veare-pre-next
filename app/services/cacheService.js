const memoryCache = require('memory-cache')
const flatCache = require('flat-cache')
const config = require('../config/contentful.js')
const path = require('path')

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
  cache.get = (key) => {
    return cache.data.getKey(key)
  }
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
  cache.get = (key) => {
    return memoryCache.get(key)
  }
  // return cache
  return cache
}

module.exports = () => {
  const env = process.env.NODE_ENV

  if (env !== 'development') {
    return memoryCache // keep original on production
  }

  const online = require('dns-sync').resolve(config.host[env])
  if (online === null) {
    console.log(`"${config.host[env]}" not available, using file cache…`)
    return flatCacheWrapper()
  } else {
    console.log(`Database available at "${config.host[env]}", refreshing file cache…`)
    return memoryCacheWrapper()
  }
}
