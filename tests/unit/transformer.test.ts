// import { transformerInterface } from '../../types/transformer'
import transformer, { __testing, getField } from '../../app/transformer/transformer'
import { transformedDataInterface } from '../../types/transformer'
/* global test expect */
/* ====================================
    transformOrNull
==================================== */
describe("Testing transformOrNull", () => {
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
    const shouldBeNull = __testing.transformOrNull(wrongType, () => 'mock')
    // assertion
    expect(shouldBeNull).toBe(null)
  })

  test("transformOrNull should return null when given an array", () => {
    const wrongType = ['string']
    const shouldBeNull = __testing.transformOrNull(wrongType, () => 'mock')
    // assertion
    expect(shouldBeNull).toBe(null)
  })

  test("transformOrNull should return null when given a number", () => {
    const wrongType = 13
    const shouldBeNull = __testing.transformOrNull(wrongType, () => 'mock')
    // assertion
    expect(shouldBeNull).toBe(null)
  })

  test("transformOrNull should return null when given null", () => {
    const wrongType = null
    const shouldBeNull = __testing.transformOrNull(wrongType, () => 'mock')
    // assertion
    expect(shouldBeNull).toBe(null)
  })

  test("transformOrNull should return null when a wrong object", () => {
    const wrongObj = {
      'wrong': 'object'
    }
    const shouldBeNull = __testing.transformOrNull(wrongObj, () => 'mock')
    // assertion
    expect(shouldBeNull).toBe(null)
  })

  test("transformOrNull should run transformer on object", () => {
    const item = {
      'fields': {
        'is': 'correct'
      }
    }
    const shouldBeTransformed = __testing.transformOrNull(item, item => item.fields.is)
    // assertion
    expect(shouldBeTransformed).toBe('correct')
  })
})
/* ====================================
    getField
==================================== */
describe("Testing getField", () => {
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
    const test_getField = getField({
        fields: {
          'testField': 20
        }
      }, 'wrongFieldName')
    // assertion
    expect(test_getField).toBe(null)
  })

  test("getField should return null value if no default value provided & field is null", () => {
    // wrapper fn needed so jest can catch error
    const test_getField = getField({
        fields: {
          'testField': {
            'en-US': null
          }
        }
      }, 'testField')
    // assertion
    expect(test_getField).toBe(null)
  })

  test("getField should return default value if provided & field is null", () => {
    // wrapper fn needed so jest can catch error
    const test_getField = getField({
        fields: {
          'testField': null
        }
      }, 'testField', 'defaultValue')
    // assertion
    expect(test_getField).toBe('defaultValue')
  })

  test("getField should return value for fieldName in only the first language", () => {
    // wrapper fn needed so jest can catch error
    const test_getField = getField({
        fields: {
          'testField': {
            'en-US': 'correct data',
            'de-DE': 'wrong data'
          }
        }
      }, 'testField')
    // assertion
    expect(test_getField).toBe('correct data')
  })
})
/* ====================================
    TRANSFORMER
==================================== */
const mockTransformer = async (data): Promise<transformedDataInterface> => {
  // return format
  return <transformedDataInterface>{
    id: 'mock',
    createdAt: 'mock',
    updatedAt: 'mock',
    contentType: 'mock',
    fields: data.fields
  }
}
describe("Testing transformer default fn", () => {
  test("transformer returns an array if only one item is provided", () => {
    // wrapper fn needed so jest can catch error
    return transformer({
      fields: {
        'test': 'data'
      }
    }, (data) => {
      return mockTransformer(data)
    }).then(resultData => {
      // assertion
      expect(resultData).toEqual([{
        "contentType": "mock",
        "createdAt": "mock",
        "fields": {
          "test": 'data',
        },
        "id": "mock",
        "updatedAt": "mock"
      }])
    })

  })
})
