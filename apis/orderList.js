import Request from '../utils/request'

const url = {
  userOrderList: "/order/auth/order/userOrderList",
}

export default {
  userOrderList(params, option) {
    return Request.post(url.userOrderList, params, option);
  }
}