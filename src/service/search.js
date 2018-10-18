const AREAS_API = '/api/areas/query'
const MARKET_API = '/api/markets/query'
const PROJECT_API = '/api/projects/query'
const POINT_API = '/api/points/query'
const AUTH_API = '/api/weixin_ar_user/query'

const HOST = process.env.SERVER_URL

const getAeraList = context => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + AREAS_API)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
const getMarket = (context, args) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + MARKET_API, { params: args })
      .then(response => {
        resolve(response.data.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
const getAuthList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + AUTH_API, { params: params })
      .then(response => {
        resolve(response.data.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
const getProject = context => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + PROJECT_API)
      .then(response => {
        resolve(response.data.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
const getPoint = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + POINT_API, { params: params })
      .then(response => {
        resolve(response.data.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export { getPoint, getProject, getAuthList, getMarket, getAeraList }
