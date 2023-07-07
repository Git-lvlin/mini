import Request from '../utils/request'

const url = {
  getOwnerList: "/healthy/auth/aed/getOwnerList",
  getProcess: "/healthy/auth/aed/getProcess",
}

export default {
  getOwnerList(params, option) {
    return Request.post(url.getOwnerList, params, option);
  },
  getProcess(params, option) {
    return Request.post(url.getProcess, params, option);
  }
}