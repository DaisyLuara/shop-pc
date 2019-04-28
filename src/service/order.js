const HOST = process.env.SERVER_URL

const ORDER_API = '/api/order'
const ORDERS_API = '/api/orders'

const submitOrder = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .post(HOST + ORDER_API, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

const getOrderList = (context, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + ORDERS_API, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

const getOrderDetailList = (context, id, params) => {
  return new Promise(function(resolve, reject) {
    context.$http
      .get(HOST + ORDERS_API + '/' + id, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export { submitOrder, getOrderList, getOrderDetailList }
