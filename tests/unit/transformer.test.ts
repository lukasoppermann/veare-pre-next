import codeData from './data/code'
import transformer, { __testing, getField } from '../../app/transformer/transformer'
/* global test expect */
/* ====================================
    transformOrNull
==================================== */
describe("transformer: transformOrNull", () => {
  test("transformOrNull should throw error when missing transformner", () => {
    // wrapper fn needed so jest can catch error
    const catchError = () => {
      // @ts-ignore
      __testing.transformOrNull()
    }
    // assertion
    expect(catchError).toThrowError(new Error("The second argument for the transformOrNull function must be a transformer function"))
  })

  test("transformOrNull should return null when given a string", () => {
    const wrongType = 'string'
    // @ts-ignore
    const shouldBeNull = __testing.transformOrNull(wrongType, () => 'mock')
    // assertion
    expect(shouldBeNull).toBe(null)
  })

  test("transformOrNull should return null when given an array", () => {
    const wrongType = ['string']
    // @ts-ignore
    const shouldBeNull = __testing.transformOrNull(wrongType, () => 'mock')
    // assertion
    expect(shouldBeNull).toBe(null)
  })

  test("transformOrNull should return null when given a number", () => {
    const wrongType = 13
    // @ts-ignore
    const shouldBeNull = __testing.transformOrNull(wrongType, () => 'mock')
    // assertion
    expect(shouldBeNull).toBe(null)
  })

  test("transformOrNull should return null when given null", () => {
    const wrongType = null
    // @ts-ignore
    const shouldBeNull = __testing.transformOrNull(wrongType, () => 'mock')
    // assertion
    expect(shouldBeNull).toBe(null)
  })

  test("transformOrNull should return null when a wrong object", () => {
    const wrongObj = {
      'wrong': 'object'
    }
    // @ts-ignore
    const shouldBeNull = __testing.transformOrNull(wrongObj, () => 'mock')
    // assertion
    expect(shouldBeNull).toBe(null)
  })

  test("transformOrNull should run transformer on object", async () => {
    const shouldBeTransformed = __testing.transformOrNull(codeData.raw, item => item.fields.language['en-US'])
    // assertion
    expect((await shouldBeTransformed || {fields: {language: null}}).fields).toBe(codeData.raw.fields.language['en-US'])
  })
})
/* ====================================
    getField
==================================== */
describe("transformer: getField", () => {
  test("getField should throw error if missing data argument", () => {
    // wrapper fn needed so jest can catch error
    const catchError = () => {
      // @ts-ignore
      getField()
    }
    // assertion
    expect(catchError).toThrowError(new Error("Invalid data argument provided. Data must be an object with a fields property that is an object as well."))
  })

  test("getField should throw error if data argument is a string", () => {
    // wrapper fn needed so jest can catch error
    const catchError = () => {
      // @ts-ignore
      getField('string')
    }
    // assertion
    expect(catchError).toThrowError(new Error("Invalid data argument provided. Data must be an object with a fields property that is an object as well."))
  })

  test("getField should throw error if data argument is an array", () => {
    // wrapper fn needed so jest can catch error
    const catchError = () => {
      // @ts-ignore
      getField(['item', 'item'])
    }
    // assertion
    expect(catchError).toThrowError(new Error("Invalid data argument provided. Data must be an object with a fields property that is an object as well."))
  })

  test("getField should throw error if fieldName argument is not a string", () => {
    // wrapper fn needed so jest can catch error
    const catchError = () => {
      // @ts-ignore
      getField({
        fields: {}
      // @ts-ignore
      }, ['fieldName in Array'])
    }
    // assertion
    expect(catchError).toThrowError(new Error(`Invalid fieldName provided: "fieldName in Array"`))
  })

  test("getField should return null if fieldName does not exist", () => {
    // wrapper fn needed so jest can catch error
    const test_getField = getField(codeData.raw, 'wrongFieldName')
    // assertion
    expect(test_getField).toBe(null)
  })

  test("getField should return null value if no default value provided & field is null", () => {
    const data = codeData.raw
    data.title = null
    // wrapper fn needed so jest can catch error
    const test_getField = getField(data, 'title')
    // assertion
    expect(test_getField).toBe(null)
  })

  test("getField should return default value if provided & field is null", () => {
    const data = codeData.raw
    data.title = null
    // wrapper fn needed so jest can catch error
    const test_getField = getField(data, 'title', 'defaultValue')
    // assertion
    expect(test_getField).toBe('defaultValue')
  })

  test("getField should return value for fieldName in only the first language", () => {
    const data = codeData.raw
    data.fields.title = {
      'en-US': 'correct data',
      'de-DE': 'wrong data'
    }
    // wrapper fn needed so jest can catch error
    const test_getField = getField(data, 'title')
    // assertion
    expect(test_getField).toBe('correct data')
  })
})
/* ====================================
    TRANSFORMER
==================================== */
const mockResultData = {
  contentType: codeData.transformed.contentType,
  createdAt: codeData.transformed.createdAt,
  updatedAt: codeData.transformed.updatedAt,
  id: codeData.transformed.id,
  type: codeData.transformed.type,
  fields: codeData.raw.fields
}
// Tests
describe("transformer: transformer default fn", () => {
  test("transformer returns an array if only one item is provided", () => {
    // wrapper fn needed so jest can catch error
    // @ts-ignore
    return transformer(codeData.raw, data => data.fields).then(resultData => {
      // assertion
      expect(resultData).toEqual([mockResultData])
    })
  })

  test("transformer returns an array if an array is provided", () => {
    // wrapper fn needed so jest can catch error
    // @ts-ignore
    return transformer([codeData.raw], data => data.fields).then(resultData => {
      // assertion
      expect(resultData).toEqual([mockResultData])
    })
  })

  test("transformer removes null values from results", () => {
    // wrapper fn needed so jest can catch error
    // @ts-ignore
    return transformer([codeData.raw, null], data => data.fields).then(resultData => {
      // assertion
      expect(resultData).toEqual([mockResultData])
    })
  })
})
