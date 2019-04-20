const PROJECT_API = '/api/projects/query'
const POINT_API = '/api/points/query'
const COMPANY_API = '/api/companies/query'
const COUPON_BATCHES_API = '/api/coupon_batches/query'
const TEMPLATES_API = '/api/projects/templates/query'
const AUTHORIZER_API = '/api/wechat/authorizer/query'
const PRIZE_POLICY_API = '/api/policy/query'
const HOST = process.env.SERVER_URL

// 已授权节目
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
// 已授权点位
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

// 节目模版
const getTemplate = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + TEMPLATES_API, { params: params })
      .then(response => {
        resolve(response.data.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 授权链接
const getAuthorizer = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + AUTHORIZER_API, { params: params })
      .then(response => {
        resolve(response.data.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 客户查询
const getCompanies = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + COMPANY_API, { params: params })
      .then(response => {
        resolve(response.data.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 优惠券规则查询
const getCouponBatches = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + COUPON_BATCHES_API, { params: params })
      .then(response => {
        resolve(response.data.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 奖品投放模版查询
const getPirzeTemplate = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + PRIZE_POLICY_API, { params: params })
      .then(response => {
        resolve(response.data.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export {
  getPoint,
  getProject,
  getCouponBatches,
  getCompanies,
  getTemplate,
  getAuthorizer,
  getPirzeTemplate
}
