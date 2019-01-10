const PICTURE_MEDIA_API = '/api/picture'
const VIDEO_MEDIA_API = '/api/video'
const HOST = process.env.SERVER_URL

const getPictureMediaList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + PICTURE_MEDIA_API, { params: params })
      .then(res => {
        resolve(res.data)
      })
      .catch(e => {
        reject(e)
      })
  })
}
const deletePictureMedia = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .delete(HOST + PICTURE_MEDIA_API, { params: params })
      .then(res => {
        resolve(res.data)
      })
      .catch(e => {
        reject(e)
      })
  })
}
const modifyPictureMedia = (context, id, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(HOST + PICTURE_MEDIA_API + '/' + id, params)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

const getVideoMediaList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + VIDEO_MEDIA_API, { params: params })
      .then(res => {
        resolve(res.data)
      })
      .catch(e => {
        reject(e)
      })
  })
}
const deleteVideoMedia = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .delete(HOST + VIDEO_MEDIA_API, { params: params })
      .then(res => {
        resolve(res.data)
      })
      .catch(e => {
        reject(e)
      })
  })
}
const modifyVideoMedia = (context, id, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(HOST + VIDEO_MEDIA_API + '/' + id, params)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
export {
  getPictureMediaList,
  deletePictureMedia,
  modifyPictureMedia,
  getVideoMediaList,
  deleteVideoMedia,
  modifyVideoMedia
}
