const COUPON_RULES_API = ''
const COUPON_ITEMS_API = ''
const PROJECT_API = ''
const ITEMS_PROJECT_API = ''


//广告模板列表
const getAdList = (context, args) => {
    return new Promise(function(resolve, reject) {
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
  //子条目列表
const getItemList = (context, args) => {
    return new Promise(function(resolve, reject) {
      context.$http
        .get(HOST + COUPON_ITEMS_API, { params: args })
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
  //获取子条目广告素材名称
  const getMaterial = context => {
    return new Promise(function(resolve, reject) {
      context.$http
        .get(HOST + PROJECT_API)
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
    return new Promise(function(resolve, reject) {
      context.$http
        .post(HOST + ITEMS_PROJECT_API, params)
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
    saveItemsProject
  }