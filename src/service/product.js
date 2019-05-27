const HOST = process.env.SERVER_URL
const CREDIT_TOTAL_API = '/api/credits/total'
const OPEN_PRODUCT_PACKAGES_API = '/api/open/product/packages'
const PRODUCT_PACKAGES_API = '/api/product/packages'
const PACKAGES_SKINS_API = '/api/product/projects'
const OPEN_PRODUCT_GROUPS_API = '/api/open/product/groups'
const CART_TOTAL_API = '/api/cart/totals'

const getCreditTotal = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + CREDIT_TOTAL_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

const getProductPackages = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + OPEN_PRODUCT_PACKAGES_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

const getProductGroups = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + OPEN_PRODUCT_GROUPS_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

const getProductProjects = (context, package_id) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + PRODUCT_PACKAGES_API + '/' + package_id + '/projects')
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
const getProjectSkins = (context, project_id) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + PACKAGES_SKINS_API + '/' + project_id + '/skins')
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

const getCartTotals = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + CART_TOTAL_API, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export {
  getCreditTotal,
  getProductPackages,
  getProductGroups,
  getProductProjects,
  getProjectSkins,
  getCartTotals
}
