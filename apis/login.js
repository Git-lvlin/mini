import Request from '../utils/request.js'

const url = {
  login: "member/open/minProgramLogin",
  code: "member/open/getAuthCode"
}

export const userLogin = (params, option) => {
  return Request.post(url.login, params, option);
}

export const getCode = (params, option) => {
  return Request.post(url.code, params, option);
}