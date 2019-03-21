const DEVICE_API = '/api/device/device'

const HOST = process.env.SERVER_URL

// 设备列表
const getDeviceList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + DEVICE_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export { getDeviceList }