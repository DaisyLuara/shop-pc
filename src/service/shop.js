const HOST = process.env.SERVER_URL
const CREDIT_TOTAL_API = '/api/credits/total'

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
  export  {getCreditTotal}
