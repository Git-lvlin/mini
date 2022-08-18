import Request from '../utils/request.js'

const url = {
  getpay: "/store/auth/memberShopOperator/payGet",
  createOrder: "/store/auth/memberShopOperator/createOrder",
}

export default {
  getPay(params, option) {
    console.log('getPay ', url.getpay)
    return Request.get(url.getpay, params, option);
  },
  createOrder(params, option) {
    console.log('createOrder ', url.createOrder)
    return Request.post(url.createOrder, params, option);
  },

}
