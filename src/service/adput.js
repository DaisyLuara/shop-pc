const LAUNCH_ADPUT_API = ""

//广告投放列表
const getLaunchadPutList = (context, params) => {
    return new Promise(function(resolve, reject) {
      context.$http
        .get(HOST + LAUNCH_ADPUT_API, { params: params })
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
  export{
    getLaunchadPutList
  }