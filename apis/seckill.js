import Request from '../utils/request'

const url = {
  xsmsGoodsList: "/activity/option/xsmsGoodsList",
}

export default {
  // 秒杀活动
  getXsmsGoodsList(params, option) {
    return Request.post(url.xsmsGoodsList, params, option);
  },
}