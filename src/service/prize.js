const COUPONS_API = '/api/coupons'
const COUPON_RULES_API = '/api/coupon/batches'
const PRIZE_POLICIES_API = '/api/coupon/policies'
const PRIZE_POLICIES_ENTRY_API = '/api/policies'
const DELETE_PRIZE_API = '/api/coupon/batches'

const HOST = process.env.SERVER_URL
// 奖品核销列表
const getPrizeVerifyList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(`${HOST}${COUPONS_API}`, { params: params })
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
      .post(`${HOST}${COUPONS_API}`, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 奖品列表
const getCouponRulesList = (context, args) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(`${HOST}${COUPON_RULES_API}`, { params: args })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 奖品新增
const savePrize = (context,  params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(`${HOST}${COUPON_RULES_API}`, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 奖品修改
const modifyPrize = (context, id, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(`${HOST}${COUPON_RULES_API}/${id}`, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 奖品详情
const prizeDetails = (context, id, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(`${HOST}${COUPON_RULES_API}/${id}`, { params: params })
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
      .get(`${HOST}${PRIZE_POLICIES_API}`, { params: params })
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
      .post(`${HOST}${PRIZE_POLICIES_API}`, params)
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
      .patch(`${HOST}${PRIZE_POLICIES_API}/${id}`, params)
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
      .get(`${HOST}${PRIZE_POLICIES_API}/${id}`, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 奖品模板条目列表
const getPrizePolicyEntryList = (context,pid, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(`${HOST}${PRIZE_POLICIES_ENTRY_API}/${pid}/batch_policies`, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 奖品模板条目详情
const prizePolicyEntryDetails = (context,pid, id, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(`${HOST}${PRIZE_POLICIES_ENTRY_API}/${pid}/batch_policies/${id}`, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 奖品模板条目新增
const savePrizePolicyEntry = (context, pid, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(
        `${HOST}${PRIZE_POLICIES_ENTRY_API}/${pid}/batch_policies`,
        params
      )
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 奖品模板条目修改
const modifyPrizePolicyEntry = (context, pid, id, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(
        `${HOST}${PRIZE_POLICIES_ENTRY_API}/${pid}/batch_policies/${id}`,
        params
      )
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 奖品模板条目删除
const deletePrizePolicyEntry = (context, pid, id) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .delete(
        `${HOST}${PRIZE_POLICIES_ENTRY_API}/${pid}/batch_policies/${id}`
      )
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 奖品列表删除
const deletePrize = (context, id) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .delete(`${HOST}${DELETE_PRIZE_API}/${id}`)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export {
  savePrizePolicyEntry,
  modifyPrizePolicyEntry,
  deletePrizePolicyEntry,
  getPrizeVerifyList,
  verifyPrize,
  getCouponRulesList,
  getPrizePolicyList,
  savePrizePolicy,
  modifyPrizePolicy,
  prizePolicyDetails,
  modifyPrize,
  prizeDetails,
  prizePolicyEntryDetails,
  getPrizePolicyEntryList,
  savePrize,
  deletePrize
}
