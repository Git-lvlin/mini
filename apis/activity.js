import Request from '../utils/request'

const url = {
  signInfo: '/public/auth/userSign/getSignInfo',
  sign: '/public/auth/userSign/sign',
  queryRecord: '/integral/auth/redPacketRecord/queryRecordList',
  signGood: '/integral/open/redPacketProd/page',
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
  // 获取红包明细
  getQueryRecord(params, option) {
    return Request.post(url.queryRecord, params, option);
  },
  // 获取签到商品列表
  getSignGood(params, option) {
    return Request.get(url.signGood, params, option);
  },
}