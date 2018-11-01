const CUSTOMER_API = '/api/customer'
const PASSWORD = '/api/password/reset'

const HOST = process.env.SERVER_URL

export default {
  getCustomer(context, params) {
    return new Promise(function(resolve, reject) {
      context.$http
        .get(HOST + CUSTOMER_API, { params: params })
        .then(res => {
          resolve(res.data)
        })
        .catch(e => {
          reject(e)
        })
    })
  },
  modifyCustomer(context, params) {
    return new Promise(function(resolve, reject) {
      context.$http
        .patch(HOST + CUSTOMER_API, params)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 修改密码
  modifyPassword(context, params) {
    return new Promise((resolve, reject) => {
      context.$http
        .post(HOST + PASSWORD, params)
        .then(result => {
          resolve(result.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
