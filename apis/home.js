import Request from '../utils/request.js'

const url = {
  floorList: "/cms/open/home/list",
  bannerList: "/cms/open/banner/list",
  intensiveGood: "/activity/open/wholesaleGoodsList",
  getStoreNotInSkus: "/activity/option/getStoreNotInSkus",
  hotGood: "/activity/open/tagGoodsList",
  hotGoodV2: "/activity/open/tagGoodsListV2",

  shareInfo: "/share/option/shareParam/queryShareContent",

  advert: "/public/open/adimgs",
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
  // 首页楼层通用接口数据
  getFloorList(params, options) {
    // params.floorVersion = '1.0.2'
    params.floorVersion = '2.0.0'
    return Request.get(url.floorList, params, options)
  },

  // 获取banner列表
  getBannerList(params, options) {
    params = getExamine(params);
    return Request.get(url.bannerList, params, options)
  },

  // 获取集约商品
  getIntensiveGood(params, option) {
    return Request.get(url.intensiveGood, params, option);
  },

  // 获取提醒店主商品列表
  getStoreNotInSkus(params, option) {
    return Request.post(url.getStoreNotInSkus, params, option);
  },

  // 获取热销商品
  getHotGood(params, option) {
    params = getExamine(params);
    let takeSpot = wx.getStorageSync("TAKE_SPOT") || {};
    if(takeSpot.storeNo) {
      params = {
        ...params,
        storeNo: takeSpot.storeNo,
      }
    }
    return Request.get(url.hotGoodV2, params, option);
  },

  // 调用楼层接口 - 接口
  getFloorCustom(url, params, options) {
    let option = {
      hasBase: true,
      showLoading: false,
      ...options,
    }
    params = getExamine(params);
    return Request.get(url, params, option)
  },

  // 获取分享参数
  getShareInfo(params, options) {
    let option = {
      showLoading: false,
      ...options,
    }
    return Request.post(url.shareInfo, params, option);
  },

  // 获取首页广告
  getAdvert(params, option) {
    return Request.post(url.advert, params, option);
  },
}