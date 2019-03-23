const COUPONS_API = '/api/coupons'
const COUPON_RULES_API = '/api/coupon/batches'
const PRIZE_POLICIES_API = '/api/coupon/policies'

const HOST = process.env.SERVER_URL
// 奖品核销列表
const getPrizeVerifyList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + COUPONS_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 奖品核销
const verifyPrize = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + COUPONS_API, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
const getCouponRulesList = (context, args) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + COUPON_RULES_API, { params: args })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 奖品模板列表
const getPrizePolicyList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + PRIZE_POLICIES_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 奖品模板新增
const savePrizePolicy = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + PRIZE_POLICIES_API, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 奖品模板修改
const modifyPrizePolicy = (context, id, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(HOST + PRIZE_POLICIES_API + '/' + id, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 奖品模板详情
const prizePolicyDetails = (context, id, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(HOST + PRIZE_POLICIES_API + '/' + id, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export {
  getPrizeVerifyList,
  verifyPrize,
  modifyPrizeVerify,
  getCouponRulesList,
  getPrizePolicyList,
  savePrizePolicy,
  modifyPrizePolicy,
  prizePolicyDetails
}
