export default (dateString: string): string => {
  const date = new Date(dateString)
  const day = ('0' + date.getDate()).slice(-2)
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const year = date.getFullYear()

  return `${months[parseInt(month) - 1]} ${day}, ${year}`
}
