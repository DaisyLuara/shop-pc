const LAUNCH_PROJECT_API = '/api/launch/projects'
const LAUNCH_WECHAT_API = '/api/launch/wechat'
const LAUNCH_PRIZE_API = '/api/launch/policies'

const HOST = process.env.SERVER_URL

// 节目投放列表
const getLaunchProjectList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + LAUNCH_PROJECT_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 新增投放
const saveLaunchProject = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + LAUNCH_PROJECT_API, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 修改投放
const modifyLaunchProject = (context, id, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(HOST + LAUNCH_PROJECT_API + '/' + id, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 授权链接投放列表
const getLaunchWechatList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + LAUNCH_WECHAT_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 新增授权投放
const saveLaunchWechat = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + LAUNCH_WECHAT_API, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 修改授权投放
const modifyLaunchWechat = (context, id, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(HOST + LAUNCH_WECHAT_API + '/' + id, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 授权链接投放详情
const getLaunchWechatDetail = (context, id, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + LAUNCH_WECHAT_API + '/' + id, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 奖品投放列表
const getLaunchPirzeList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + LAUNCH_PRIZE_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 新增奖品投放
const saveLaunchPirze = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + LAUNCH_PRIZE_API, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 修改奖品投放
const modifyLaunchPirze = (context, id, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .patch(HOST + LAUNCH_PRIZE_API + '/' + id, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 奖品投放详情
const getLaunchPirzeDetail = (context, id, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + LAUNCH_PRIZE_API + '/' + id, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export {
  getLaunchProjectList,
  saveLaunchProject,
  modifyLaunchProject,
  getLaunchWechatList,
  saveLaunchWechat,
  modifyLaunchWechat,
  getLaunchWechatDetail,
  getLaunchPirzeList,
  saveLaunchPirze,
  modifyLaunchPirze,
  getLaunchPirzeDetail
}
