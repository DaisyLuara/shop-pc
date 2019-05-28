const LAUNCH_AD_API = '/api/launch/ad'
const HOST = process.env.SERVER_URL
//广告投放列表
const getLaunchadPutList = (context, params) => {
  return new Promise(function (resolve, reject) {
    context.$http
      .get(HOST + LAUNCH_AD_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
//广告投放列表修改
const editPutlist = (context, attid, params) => {
  return new Promise(function (resolve, reject) {
    context.$http
      .get(HOST + LAUNCH_AD_API + '/' + attid, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 新增广告投放
const saveLaunchPut = (context, params) => {
  return new Promise(function (resolve, reject) {
    context.$http
      .post(HOST + LAUNCH_AD_API, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 修改广告投放
const modifyLaunchPut = (context, id, params) => {
  return new Promise(function (resolve, reject) {
    context.$http
      .patch(HOST + LAUNCH_AD_API + '/' + id, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
//广告投放详情
const getLaunchPutDetail = (context, id, params) => {
  return new Promise(function (resolve, reject) {
    context.$http
      .get(HOST + LAUNCH_AD_API + '/' + id, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export {
  getLaunchadPutList,
  editPutlist,
  saveLaunchPut,
  modifyLaunchPut,
  getLaunchPutDetail
}