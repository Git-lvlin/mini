import Request from '../utils/request.js'

const url = {
  login: "/member/open/minProgramLogin",
  code: "/member/open/getAuthCode",
  checkBind: "/member/open/checkNumPhoneBlind",
  bindPhone: "/member/open/wxBlind",
}

// 微信登录
export const userLogin = (params, option) => {
  return Request.post(url.login, params, option);
}

// 检查手机是否已被绑定
export const checkBindPhone = (params, option) => {
  return Request.post(url.checkBind, params, option);
}

// 获取短信验证码
export const getCode = (params, option) => {
  return Request.post(url.code, params, option);
}

// 绑定手机号
export const bindPhone = (params, option) => {
  return Request.post(url.bindPhone, params, option);
}

export default {
  userLogin,
  checkBindPhone,
  getCode,
  bindPhone,
}