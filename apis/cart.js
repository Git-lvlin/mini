import Request from '../utils/request.js'

const url = {
  addressList: "/member/auth/memberAddress/findAddressList",
  defaultAddress: "/member/auth/memberAddress/findDefaultAddress",
  addAddress: "/member/auth/memberAddress/addAddress",
  removeAddress: "/member/auth/memberAddress/remove",
  updateAddress: "/member/auth/memberAddress/updateAddress",
  orderAmount: "/order/auth/orderAmount",
  province: "/member/open/area/findAllProvinces",
  area: "/member/open/area/findChildren"
}

export default {
  // 获取地址列表
  getProvince(params, option) {
    return Request.post(url.province, params, option);
  },
  // 获取地址列表
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
  // 获取默认地址
  addAddress(params, option) {
    return Request.post(url.addAddress, params, option);
  },
  // 获取默认地址
  removeAddress(params, option) {
    return Request.post(url.removeAddress, params, option);
  },
  // 获取默认地址
  updateAddress(params, option) {
    return Request.post(url.updateAddress, params, option);
  },

  // 获取确认订单金额明细
  getOrderAmount(params, option) {
    return Request.post(url.orderAmount, params, option);
  },

}