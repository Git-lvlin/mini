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
  createOrder: "/order/auth/createOrder",
  orderAmount: "/order/auth/orderAmount",
  payInfo: "/order/auth/prepayOrder",
  rechargePay: "/financial/auth/pursePayment/pay",
  intensivePay: "/store/auth/wholesale/payOrder",
  orderDetail: "/order/auth/order/orderDetail",
  orderAmount: "/order/auth/orderAmount",
  bondPay: "/store/auth/memberShop/apply/pay",
  orderToken: "/order/auth/orderToken",
  cancelPay: "/payment/open/adaPay/payCancel",
  deliveryDesc: "/goods/auth/getLateDeliveryDesc",

  
  faterRed: "/activity/auth/sendMemberEverydayCoupon",

  freshPay: "/store/auth/order/pay",

  newPayInfo: '/iot/auth/leaseOrder/prepayOrder',
  vipPayInfo: '/store/auth/memberShop/payServiceFee',
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
  // 创建订单
  createOrder(params, option) {
    return Request.post(url.createOrder, params, option);
  },
  // 获取确认订单金额明细
  getOrderAmount(params, option) {
    return Request.post(url.orderAmount, params, option);
  },
  // 获取订单详情
  getOrderDetail(params, option) {
    return Request.get(url.orderDetail, params, option);
  },
  // 获取物流提醒
  getDeliveryDesc(params, option) {
    return Request.post(url.deliveryDesc, params, option);
  },
  
  // 获取支付信息
  getPayInfo(params, option) {
    return Request.post(url.payInfo, params, option);
  },
  // 获取vip支付信息
  getPayInfoVip(params, option) {
    return Request.post(url.vipPayInfo, params, option);
  },
  // 获取氢原子支付信息
  getPayInfoAtom(params, option) {
    return Request.post(url.newPayInfo, params, option);
  },
  // 约卡充值
  getRechargePay(params, option) {
    return Request.post(url.rechargePay, params, option);
  },
  // 生鲜订单
  getInFreshPay(params, option) {
    return Request.post(url.freshPay, params, option);
  },
  // 集约支付信息
  getIntensivePay(params, option) {
    return Request.post(url.intensivePay, params, option);
  },
  // 店铺保证金
  getBondPay(params, option) {
    return Request.post(url.bondPay, params, option);
  },
  // 刷新订单token
  getOrderToken(params, option) {
    return Request.post(url.orderToken, params, option);
  },
  // 用户支付失败 - APP拉起微信支付时，用户没有支付成功
  cancelPay(params, option) {
    return Request.post(url.cancelPay, params, option);
  },

  // 领取每日
  getFaterRed(params, option) {
    return Request.post(url.faterRed, params, option);
  },
}