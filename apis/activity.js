import Request from '../utils/request'

const url = {
  signInfo: "/public/auth/userSign/getSignInfo",
  sign: "/public/auth/userSign/sign",
}

export default {
  // 获取签到信息
  getSignInfo(params, option) {
    return Request.post(url.signInfo, params, option);
  },
  // 签到
  userSign(params, option) {
    return Request.post(url.sign, params, option);
  },
}