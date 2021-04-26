import Request from '../utils/request.js'

const url = {
  login: "/member/open/minProgramLogin",
  code: "/member/open/getAuthCode",
  checkBind: "/member/open/checkNumPhoneBlind",
  bindPhone: "/member/open/wxBlind",
  getPhone: "/member/open/memberInfo/minProgramDecrypt"
}

export default {
  // 微信登录
  userLogin(params, option) {
    return Request.post(url.login, params, option);
  },

  // 检查手机是否已被绑定
    checkBindPhone(params, option) {
    return Request.post(url.checkBind, params, option);
  },

  // 获取短信验证码
  getCode(params, option) {
    return Request.post(url.code, params, option);
  },

  // 绑定手机号
  bindPhone(params, option) {
    return Request.post(url.bindPhone, params, option);
  },

  // 解密手机号
  getPhoneNumber(params, option) {
    return Request.post(url.getPhone, params, option);
  },

}