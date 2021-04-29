import Request from '../utils/request.js'

const url = {
  defaultAddress: "/member/auth/memberAddress/findDefaultAddress",
}

export default {
  // 获取默认地址
  getDefaultAddress(params, option) {
    return Request.post(url.defaultAddress, params, option);
  },

}