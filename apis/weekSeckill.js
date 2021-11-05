import Request from '../utils/request'

const url = {
  xsmsWeekGoodsList: "/activity/option/xsmsWeekGoodsList",
  xsmsWeekNotice:"/activity/auth/xsmsWeekNotice",
}

export default {
  // 秒杀活动
  getXsmsWeekGoodsList(params, option) {
    return Request.post(url.xsmsWeekGoodsList, params, option);
  },
  getXsmsWeekNotice(params, option) {
    return Request.post(url.xsmsWeekNotice, params, option);
  }
}