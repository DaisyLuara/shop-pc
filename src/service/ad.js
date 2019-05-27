const COUPON_RULES_API = '/api/ad/template'
const COUPON_ITEMS_API = '/api/ad/template_items'
const MEDIA_API = '/api/ad/media'
const ITEMS_ADD_API = '/api/ad/template_items'
const MEDIA_AD_API = '/api/ad/template'

const HOST = process.env.SERVER_URL


//广告模板列表
const getAdList = (context, args) => {
  return new Promise(function (resolve, reject) {
    context.$http
      .get(HOST + COUPON_RULES_API, { params: args })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}


// 增加模版/修改模版名称
const modifyMediaAdName = (context, params) => {
  return new Promise(function (resolve, reject) {
    context.$http
      .post(HOST + MEDIA_AD_API, params)
      .then(response => {
        console.log(response)
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

//子条目列表
const getItemList = (context, id, args) => {
  return new Promise(function (resolve, reject) {
    context.$http
      .get(HOST + COUPON_ITEMS_API + '?' + 'atiid=' + id, { params: args })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
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
//获取新增子条目广告素材列表
const getMaterial = context => {
  return new Promise(function (resolve, reject) {
    context.$http
      .get(HOST + MEDIA_API)
      .then(response => {
        resolve(response.data.data)
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
      .post(HOST + ITEMS_ADD_API, params)
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
  getItemDetail

}