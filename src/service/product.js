const HOST = process.env.SERVER_URL
const CREDIT_TOTAL_API = '/api/credits/total'
const PRODUCT_PACKAGES_API = '/api/open/product/packages'
const PRODUCT_GROUPS_API = '/api/open/product/groups'

  const getCreditTotal = (context, params)=> {
    return new Promise(function(resolve, reject) {
      context.$http
        .get(HOST + CREDIT_TOTAL_API, {params:params})
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  const getProductPackages = (context,params)=>{
    return new Promise(function(resolve, reject) {
      context.$http
        .get(HOST + PRODUCT_PACKAGES_API, {params:params})
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  const getProductGroups = (context,params)=>{
    return new Promise(function(resolve, reject) {
      context.$http
        .get(HOST + PRODUCT_GROUPS_API, {params:params})
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
  export  { getCreditTotal,getProductPackages ,getProductGroups}
