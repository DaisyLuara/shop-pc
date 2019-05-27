const COUPON_ITEMS_API = '/api/ad/template_items'
const AD_MEDIA_API = '/api/ad/media'
const ITEMS_ADD_API = '/api/ad/template_items'
const MEDIA_AD_API = '/api/ad/template'
const MEDIA_API_QUERY = '/api/ad/medias/query'
const HOST = process.env.SERVER_URL

//广告模板列表
const getAdList = (context, args) => {
  return new Promise(function (resolve, reject) {
    context.$http
      .get(HOST + MEDIA_AD_API, { params: args }).then(response => {
        resolve(response.data)
      }).catch(err => {
        reject(err)
      })
  })
}

// 增加模版名称
const modifyMediaAdName = (context, params) => {
  return new Promise(function (resolve, reject) {
    context.$http
      .post(HOST + MEDIA_AD_API, params)
      .then(response => {
        resolve(response.data)
      }).catch(err => {
        reject(err)
      })
  })
}

//修改模板名称
const editmodifyMediaAdName = (context, id, params) => {
  return new Promise(function (resolve, reject) {
    context.$http
      .patch(HOST + MEDIA_AD_API + '/' + id, params)
      .then(response => {
        resolve(response.data)
      }).catch(err => {
        reject(err)
      })
  })
}

//子条目列表
const getItemList = (context, args) => {
  return new Promise(function (resolve, reject) {
    context.$http
      .get(HOST + COUPON_ITEMS_API, { params: args }).then(response => {
        resolve(response.data)
      }).catch(err => {
        reject(err)
      })
  })
}

//子条目详情
const getItemDetail = (context, id, args) => {
  return new Promise(function (resolve, reject) {
    context.$http
      .get(HOST + COUPON_ITEMS_API + '/' + id, { params: args })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
//广告素材列表
const getMaterial = (context) => {
  return new Promise(function (resolve, reject) {
    context.$http
      .get(HOST + MEDIA_API_QUERY)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
//新增子条目
const saveItemsProject = (context, params) => {
  return new Promise(function (resolve, reject) {
    context.$http
      .post(HOST + ITEMS_ADD_API, params).then(response => {
        resolve(response.data)
      }).catch(err => {
        reject(err)
      })
  })
}
//编辑子条目
const editItemsProject = (context, id, params) => {
  return new Promise(function (resolve, reject) {
    context.$http
      .patch(HOST + ITEMS_ADD_API + "/" + id, params).then(response => {
        resolve(response.data)
      }).catch(err => {
        reject(err)
      })
  })
}

// 修改广告素材
const modifyAdMedia = (context, id, params) => {
  return new Promise(function (resolve, reject) {
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
// 保存广告素材

const saveAdMedia = (context, params) => {
  return new Promise(function (resolve, reject) {
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
// 广告素材详情
const getAdMediaDetail = (context, id, params) => {
  return new Promise(function (resolve, reject) {
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
// 广告素材列表

const getAdMediaList = (context, params) => {
  return new Promise(function (resolve, reject) {
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
export {
  getAdList,
  getItemList,
  getMaterial,
  saveItemsProject,
  modifyMediaAdName,
  editItemsProject,
  getItemDetail,
  getAdMediaList, getAdMediaDetail, saveAdMedia, modifyAdMedia, editmodifyMediaAdName

}
