const POINT_API = '/api/points'
const HOST = process.env.SERVER_URL

export default {
  getPointList(context, params) {
    return new Promise(function(resolve, reject) {
      context.$http
        .get(HOST + POINT_API, { params: params })
        .then(res => {
          resolve(res.data)
        })
        .catch(e => {
          reject(e)
        })
    })
  }
}
