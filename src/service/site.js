const POINTS_API = '/api/points'

const HOST = process.env.SERVER_URL

// 点位列表
const getPointList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + POINTS_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export { getPointList }
