// import transformer, { getField, __testing } from '../../app/transformer/transformer'
import { __testing, getField } from '../../app/transformer/transformer'
/* global test expect */
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

  test("getField should throw error if fieldName does not exist", () => {
    // wrapper fn needed so jest can catch error
    const catchError = () => {
      // @ts-ignore
      getField({
        fields: {
          'testField': 20
        }
      // @ts-ignore
    }, 'wrongFieldName')
    }
    // assertion
    expect(catchError).toThrowError(new Error(`Invalid fieldName provided: "wrongFieldName"`))
  })

  test.todo("getField should return default value if provided & field is null")
  test.todo("getField should return value for fieldName in only the first language")
})
// export const getField = (data, fieldName: string, defaultValue: any = null) => {
//   const field = data.fields[fieldName]
//   if (typeof field !== 'object') {
//     return defaultValue || null
//   }
//   return field[Object.keys(field)[0]]
// }
