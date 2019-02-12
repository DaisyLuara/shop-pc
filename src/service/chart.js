const CHART_API = '/api/chart_data'
const STATS_API = '/api/stats'
const EXCEL_API = '/api/coupons_export'
const STATS_TIMES_API = '/api/times_stats'
const CHART_TIMES_API = '/api/chart_data_times'

const HOST = process.env.SERVER_URL

const getChartData = (context, args) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + CHART_API, args)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
const getStaus = (context, args) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + STATS_API, { params: args })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
const getExcelData = (context, args) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + EXCEL_API, { params: args })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
const getTimesChartData = (context, args) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + CHART_TIMES_API, args)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
const getTimesStaus = (context, args) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + STATS_TIMES_API, { params: args })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export {
  getStaus,
  getChartData,
  getExcelData,
  getTimesChartData,
  getTimesStaus
}
