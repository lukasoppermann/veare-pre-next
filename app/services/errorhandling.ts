export const errorLog = error => {
  if (typeof error === 'string') {
    console.error(error)
  } else {
    console.error('An error occured …',
      error.Error || null,
      error.host || null,
      error.errorno || null,
      error.code || null
    )
  }
}
