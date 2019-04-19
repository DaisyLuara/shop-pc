import { Message, MessageBox } from 'element-ui'
const HOST = process.env.SERVER_URL
//简单注册  获取手机验证码
const VERTIFY_API = '/api/verificationCodes'
const SAMPLE_LOGIN = '/api/authorizations/register'
export default {
  getVertify(context, params) {
    return new Promise(function(resolve, reject) {
      context.$http
        .post(HOST + VERTIFY_API, params)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getSampleLogin(context, params) {
    return new Promise(function(resolve, reject) {
      context.$http
        .put(HOST + SAMPLE_LOGIN, params)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
