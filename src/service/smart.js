const SMART_API = '/api/projects'

const HOST = process.env.SERVER_URL

// 标准化节目列表
const getSmartList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + SMART_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export { getSmartList }
