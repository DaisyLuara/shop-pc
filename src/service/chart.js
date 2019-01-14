const CHART_API = '/api/chart_data'
const STATS_API = '/api/stats'
const EXCEL_API = '/api/chart_data/export'
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
export { getStaus, getChartData, getExcelData }
