const AD_API = '/api/ad/open'
const PERMISSIONS_API = '/api/market/permissions'
const PERMISSION_AUTH_API = '/api/market/permission'
const MARKET_EXE_API = '/api/markets/exe'
const MARKET_OWN_API = '/api/markets/owner'
const HOST = process.env.SERVER_URL

const getAdList = (context, args) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + AD_API, { params: args })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
const createAd = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + AD_API, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
const modifyAd = (context, params, id) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(HOST + AD_API + '/' + id, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
const getAd = (context, id) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + AD_API + '/' + id)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 授权列表
const getPermissionsList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + PERMISSIONS_API, { params: params })
      .then(res => {
        resolve(res.data)
      })
      .catch(e => {
        reject(e)
      })
  })
}
// 申请授权
const createPermission = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + PERMISSION_AUTH_API, params)
      .then(res => {
        resolve(res.data)
      })
      .catch(e => {
        reject(e)
      })
  })
}
// 星视度场地列表
const getMarketExe = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + MARKET_EXE_API, { params: params })
      .then(res => {
        resolve(res.data)
      })
      .catch(e => {
        reject(e)
      })
  })
}
// 场地主场地列表
const getMarketOwn = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + MARKET_OWN_API, { params: params })
      .then(res => {
        resolve(res.data)
      })
      .catch(e => {
        reject(e)
      })
  })
}
export {
  getAdList,
  getMarketOwn,
  getMarketExe,
  createPermission,
  getPermissionsList,
  getAd,
  modifyAd,
  createAd
}
