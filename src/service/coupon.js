const COUPONS_API = '/api/coupons'
const HOST = process.env.SERVER_URL

const getCouponList = (context, params) => {
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
const verifyCoupon = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + COUPONS_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
const modifyCoupon = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(HOST + COUPONS_API, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export { getCouponList, verifyCoupon, modifyCoupon }
