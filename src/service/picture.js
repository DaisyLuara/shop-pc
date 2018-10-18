import { router } from '../main'
const MEDIA_API = '/api/media'
const HOST = process.env.SERVER_URL

export default {
  getMediaList(context, params) {
    return new Promise(function(resolve, reject) {
      context.$http
        .get(HOST + MEDIA_API, { params: params })
        .then(res => {
          resolve(res.data)
        })
        .catch(e => {
          reject(e)
        })
    })
  },
  deleteMedia(context, params) {
    return new Promise(function(resolve, reject) {
      context.$http
        .delete(HOST + MEDIA_API, { params: params })
        .then(res => {
          resolve(res.data)
        })
        .catch(e => {
          reject(e)
        })
    })
  },
  modifyMedia(context, id, params) {
    return new Promise(function(resolve, reject) {
      context.$http
        .patch(HOST + MEDIA_API + '/' + id, params)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}
