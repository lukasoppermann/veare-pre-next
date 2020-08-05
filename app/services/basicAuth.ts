const auth = require('basic-auth')

export default (req, user?: string, password?: string) => {
  // get credentials
  console.error(auth(req))
  const credentials = auth(req)
  // check if all parameters are provided
  if (credentials === undefined || user === undefined || password === undefined) {
    return false
  }
  // validate match
  return credentials.name === user && credentials.pass === password
}
