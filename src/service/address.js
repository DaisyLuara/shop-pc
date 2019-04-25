const HOST = process.env.SERVER_URL
const AREAS_API = '/api/open/areas'
const MARKETS_API = '/api/open/markets'
const POINTS_API = '/api/open/points'

  const getOpenAears = (context, params)=> {
    return new Promise(function(resolve, reject) {
      context.$http
        .get(HOST + AREAS_API, {params:params})
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  const getOpenMarkets = (context,params)=>{
    return new Promise(function(resolve, reject) {
      context.$http
        .get(HOST + MARKETS_API, {params:params})
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  const getOpenPoints = (context,params)=>{
    return new Promise(function(resolve, reject) {
      context.$http
        .get(HOST + POINTS_API, {params:params})
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
  export  { getOpenAears,getOpenMarkets,getOpenPoints}