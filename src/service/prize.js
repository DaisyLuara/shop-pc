const COUPON_RULES_API = '/api/coupon/batches'

const HOST = process.env.SERVER_URL

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

export { getCouponList, verifyCoupon, modifyCoupon, getCouponRulesList }
