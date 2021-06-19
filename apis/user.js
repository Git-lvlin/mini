import Request from '../utils/request.js'

const url = {
  defaultAddress: "/member/auth/memberAddress/findDefaultAddress",
  userInfo: "/member/auth/memberInfo/getUserCenter",
  userData: "/member/auth/memberInfo/getMemberAmountInfo",
  orderCount: "/order/auth/order/userOrderCount"
}

export default {
  // 获取默认地址
  getDefaultAddress(params, option) {
    return Request.post(url.defaultAddress, params, option);
  },
  // 获取用户基本信息
  getUserInfo(params, option) {
    return Request.post(url.userInfo, params, option);
  },
  // 获取用户数据
  getUserData(params, option) {
    return Request.post(url.userData, params, option);
  },
  // 获取订单数量
  getOrderCount(params, option) {
    return Request.post(url.orderCount, params, option);
  },

}