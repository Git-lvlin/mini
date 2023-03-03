import Request from '../utils/request'

const url = {
  createStartOrder: "/iot/auth/device/doctor/createStartOrder",
  editUser: "/healthy/auth/doctor/editUser",
  getPackage: "/healthy/auth/doctor/getPackage",
  getUser: "/healthy/auth/doctor/getUser",
  reportList: "/healthy/auth/doctor/reportList",
  scan: "/iot/auth/device/doctor/scan",
  getConfig: "/healthy/auth/doctor/getConfig",
}

export default {
  createStartOrder(params, option) {
    return Request.post(url.createStartOrder, params, option);
  },
  editUser(params, option) {
    return Request.post(url.editUser, params, option);
  },
  getPackage(params, option) {
    return Request.post(url.getPackage, params, option);
  },
  getUser(params, option) {
    return Request.post(url.getUser, params, option);
  },
  scan(params, option) {
    return Request.post(url.scan, params, option);
  },
  reportList(params, option) {
    return Request.post(url.reportList, params, option);
  },
  getConfig(params, option) {
    return Request.post(url.getConfig, params, option);
  },
}