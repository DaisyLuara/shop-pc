const AUTHORIZER_API = '/api/wechat/authorizer'

const HOST = process.env.SERVER_URL

// 授权列表
const getAuthorizationList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + AUTHORIZER_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export { getAuthorizationList }
