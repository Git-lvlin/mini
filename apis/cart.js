import Request from '../utils/request.js'

const url = {
  addressList: "/member/auth/memberAddress/findAddressList",
  defaultAddress: "/member/auth/memberAddress/findDefaultAddress",
  addAddress: "/member/auth/memberAddress/addAddress",
  removeAddress: "/member/auth/memberAddress/remove",
  updateAddress: "/member/auth/memberAddress/updateAddress",
  province: "/member/open/area/findAllProvinces",
  area: "/member/open/area/findChildren",

  confirmOrder: "/order/auth/confirmOrder",
  orderAmount: "/order/auth/orderAmount",
}

export default {
  // 获取省份
  getProvince(params, option) {
    return Request.post(url.province, params, option);
  },
  // 获取城市及市区
  getArea(params, option) {
    return Request.post(url.area, params, option);
  },
  // 获取地址列表
  getAddressList(params, option) {
    return Request.post(url.addressList, params, option);
  },
  // 获取默认地址
  getDefaultAddress(params, option) {
    return Request.post(url.defaultAddress, params, option);
  },
  // 添加新地址
  addAddress(params, option) {
    return Request.post(url.addAddress, params, option);
  },
  // 移除地址
  removeAddress(params, option) {
    return Request.post(url.removeAddress, params, option);
  },
  // 更新地址
  updateAddress(params, option) {
    return Request.post(url.updateAddress, params, option);
  },


  // 获取确认订单明细
  getConfirmInfo(params, option) {
    return Request.post(url.confirmOrder, params, option);
  },
  // 获取确认订单金额明细
  getOrderAmount(params, option) {
    return Request.post(url.orderAmount, params, option);
  },

}