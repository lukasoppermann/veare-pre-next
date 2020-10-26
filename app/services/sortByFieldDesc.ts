/**
 * @param {array} entries — array of objects
 * @param {function} getFieldToCompare — function that retrives field value to compare
 * @return sorted array
 */
export default (entries, getFieldToCompare): any[] => {
  return entries.sort((a, b) => {
    // get field to compare from object a & b
    a = getFieldToCompare(a)
    b = getFieldToCompare(b)
    // compare fields
    if (a < b) {
      return 1
    }
    if (a > b) {
      return -1
    }
    return 0
  })
}
