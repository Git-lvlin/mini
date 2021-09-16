import Request from '../utils/request.js'

const url = {
  defaultAddress: "/member/auth/memberAddress/findDefaultAddress",
  userInfo: "/member/auth/memberInfo/getUserCenter",
  userData: "/member/auth/memberInfo/getMemberAmountInfo",
  orderCount: "/order/auth/order/userOrderCount",
  updateUserInfo: "/member/auth/memberInfo/modifyMemberInfo",
  getDownLoadImg:"/share/option/shareParam/getDownLoadImg",

  couponList: "/activity/open/myCouponList",
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
  // 获取用户数据
  updateUserInfo(params, option) {
    return Request.post(url.updateUserInfo, params, option);
  },
  // 获取订单数量
  getOrderCount(params, option) {
    return Request.post(url.orderCount, params, option);
  },
  //获取app海报和二维码
  getDownLoadImg(params, option){
    return Request.post(url.getDownLoadImg, params, option);
  },

  // 获取红包列表
  getCouponList(params, option){
    return Request.post(url.couponList, params, option);
  },

}