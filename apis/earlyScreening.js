import Request from '../utils/request'

const url = {
  checkSignCode: "/healthy/auth/aed/checkSignCode",
  signUp: "/healthy/auth/aed/signUp",
  subCompanyInfo: "/healthy/auth/aed/subCompanyInfo",
}

export default {
  checkSignCode(params, option) {
    return Request.post(url.checkSignCode, params, option);
  },
  signUp(params, option) {
    return Request.post(url.signUp, params, option);
  },
  subCompanyInfo(params, option) {
    return Request.post(url.subCompanyInfo, params, option);
  }
}