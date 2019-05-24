const AD_MEDIA_API = '/api/ad/media'

const HOST = process.env.SERVER_URL
// 广告素材列表
const getAdMediaList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + AD_MEDIA_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
const getAdMediaDetail = (context, id, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(`${HOST}${AD_MEDIA_API}/${id}`, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
const saveAdMedia = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + AD_MEDIA_API, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
const modifyAdMedia = (context, id, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(`${HOST}${AD_MEDIA_API}/${id}`, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export { getAdMediaList, getAdMediaDetail, saveAdMedia, modifyAdMedia }
