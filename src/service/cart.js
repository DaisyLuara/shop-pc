const HOST = process.env.SERVER_URL
const ADD_TO_CART = HOST + '/api/cart'
const GET_CARTS_LIST = HOST + '/api/carts'
const DELETE_CART_PRODUCT = HOST + '/api/carts/'
//加入购物车
const addToCart = (context, params) => {
  return new Promise((resolve, reject) => {
    context.$http
      .post(ADD_TO_CART, params)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
//查看购物车
const getShoppingCartList = (context, params) => {
  return new Promise((resolve, reject) => {
    context.$http
      .get(GET_CARTS_LIST, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
//删除购物车里的商品
const deleteCartProduct = (context, id) => {
  return new Promise((resolve, reject) => {
    context.$http
      .delete(DELETE_CART_PRODUCT + id)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export { addToCart, getShoppingCartList, deleteCartProduct }
