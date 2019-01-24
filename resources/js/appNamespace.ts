import fetchInject from 'fetch-inject'

window.app = {
  baseUrl: `${window.location.protocol}//${window.location.host}`,
  fetchInject: fetchInject
}
