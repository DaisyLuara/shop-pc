const AD_API = '/api/ad/open'
const PERMISSIONS_API = '/api/market/permissions'
const PERMISSION_AUTH_API = '/api/market/permission'
const MARKET_EXE_API = '/api/markets/exe'
const MARKET_OWN_API = '/api/markets/owner'
const HOST = process.env.SERVER_URL
export default {
  getAdList(context, args) {
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
  },
  createAd(context, params) {
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
  },
  modifyAd(context, params, id) {
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
  },
  getAd(context, id) {
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
  },
  // 授权列表
  getPermissionsList(context, params) {
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
  },
  // 申请授权
  createPermission(context, params) {
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
  },
  // 星视度场地列表
  getMarketExe(context, params) {
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
  },
  // 场地主场地列表
  getMarketOwn(context, params) {
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
}
