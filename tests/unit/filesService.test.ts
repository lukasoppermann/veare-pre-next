import { revFile, embedFile, revisionedFiles } from '../../app/services/files'

describe("revisionedFiles", () => {
  test("add files to revisionedFiles", () => {
    expect(revisionedFiles().css['css/style.css']).toBe(undefined)
    expect(revisionedFiles({
      'css/style.css': 'test',
    }).css['css/style.css']).toBe('test')
    expect(revisionedFiles().css['css/style.css']).toBe('test')
  })

  test("update files to revisionedFiles ", () => {
      expect(revisionedFiles().css['css/style.css']).toBe('test')
      expect(revisionedFiles({
        'css/style.css': 'css/style-f99403de4da7b8dfd5d2a7f48e0d5edd.css',
        'js/script.js': 'js/script-f99403de4da7b8dfd5d2a7f48e0d5edd.js',
        'media/image.png': 'media/image-f99403de4da7b8dfd5d2a7f48e0d5edd.png',
        'media/file-for-test.txt': './tests/unit/data/file-for-test.txt'
      }).css['css/style.css']).toBe('css/style-f99403de4da7b8dfd5d2a7f48e0d5edd.css')
      expect(revisionedFiles().css['css/style.css']).toBe('css/style-f99403de4da7b8dfd5d2a7f48e0d5edd.css')
  })
})

describe("revFile", () => {
  test("Retrieve missing file", () => {
    expect(revFile('js/missing.js')).toBe(null)
  })

  test("Retrieve files", () => {
    expect(revFile('css/style.css')).toBe('css/style-f99403de4da7b8dfd5d2a7f48e0d5edd.css')
    expect(revFile('js/script.js')).toBe('js/script-f99403de4da7b8dfd5d2a7f48e0d5edd.js')
    expect(revFile('media/image.png')).toBe('media/image-f99403de4da7b8dfd5d2a7f48e0d5edd.png')
  })
})

describe("embedFile", () => {
  test("embedFile missing file", () => {
    expect(embedFile('js/missing.js')).toBe(undefined)
  })

  test("embedFile revisioned file", () => {
    //@ts-ignore
    let string = embedFile('media/file-for-test.txt').toString('utf8')
    expect(string.trim()).toBe('success')
  })

  test("embedFile not revisioned file", () => {
    //@ts-ignore
    let string = embedFile('./tests/unit/data/file-for-test.txt').toString('utf8')
    expect(string.trim()).toBe('success')
  })
})
