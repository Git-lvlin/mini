import Request from '../utils/request'

const url = {
  xsmsWeekGoodsList: "/activity/option/xsmsWeekGoodsList",
  xsmsWeekNotice:"/activity/auth/xsmsWeekNotice",
}
const getExamine = (params) => {
  const state = wx.getStorageSync("EXAMINE") || false;
  if(state) {
    params = {
      verifyVersionId: 2,
      ...params
    };
  }
  return params;
}
export default {
  // 秒杀活动
  getXsmsWeekGoodsList(params, option) {
    params = getExamine(params);
    return Request.post(url.xsmsWeekGoodsList, params, option);
  },
  getXsmsWeekNotice(params, option) {
    params = getExamine(params);
    return Request.post(url.xsmsWeekNotice, params, option);
  }
}