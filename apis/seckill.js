import Request from '../utils/request'

const url = {
  xsmsGoodsList: "/activity/option/xsmsGoodsList",
  xsmsNotice:"/activity/auth/xsmsNotice",
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
  getXsmsGoodsList(params, option) {
    params = getExamine(params);
    return Request.post(url.xsmsGoodsList, params, option);
  },
  getXsmsNotice(params, option) {
    params = getExamine(params);
    return Request.post(url.xsmsNotice, params, option);
  }
}