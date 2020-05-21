import { __testing } from '../../app/services/cacheService'

/* global test expect */
describe("flatCacheWrapper", () => {
  const flatCache = __testing.flatCacheWrapper()

  test("put & get on flatCacheWrapper", () => {
    flatCache.delete('test')
    // before state
    expect(flatCache.get('test')).toBe(undefined)
    // add value
    flatCache.put('test', 'value')
    // assertion
    expect(flatCache.get('test')).toBe('value')
  })

  test("override value on flatCacheWrapper", () => {
    // add value
    flatCache.put('test', 'newValue')
    // before state
    expect(flatCache.get('test')).toBe('newValue')
  })

  test("delete value from flatCacheWrapper", () => {
    // add value
    flatCache.delete('test')
    // before state
    expect(flatCache.get('test')).toBe(undefined)
  })
})

describe("memoryCacheWrapper", () => {
  const memoryCache = __testing.memoryCacheWrapper()

  test("put & get on memoryCache", () => {
    memoryCache.delete('memoryTest')
    // before state
    expect(memoryCache.get('memoryTest')).toBe(null)
    // add value
    memoryCache.put('memoryTest', 'value')
    // assertion
    expect(memoryCache.get('memoryTest')).toBe('value')
  })

  test("override value on memoryCache", () => {
    // add value
    memoryCache.put('memoryTest', 'newValue')
    // before state
    expect(memoryCache.get('memoryTest')).toBe('newValue')
  })

  test("delete value from memoryCache", () => {
    // add value
    memoryCache.delete('memoryTest')
    // before state
    expect(memoryCache.get('memoryTest')).toBe(null)
  })
})
