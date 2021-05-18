import Request from '../utils/request.js'

const url = {
  floorList: "/cms/open/home/list",
  bannerList: "/cms/open/banner/list",
  intensiveGood: "/activity/open/wholesaleGoodsList",
  hotGood: "/activity/open/tagGoodsList",
}

export default {
  // 首页楼层通用接口数据
  getFloorList(params, options) {
    return Request.get(url.floorList, params, options)
  },

  // 获取banner列表
  getBannerList(params, options) {
    return Request.get(url.bannerList, params, options)
  },

  // 获取集约商品
  getIntensiveGood(params, option) {
    return Request.get(url.intensiveGood, params, option);
  },

  // 获取热销商品
  getHotGood(params, option) {
    return Request.get(url.hotGood, params, option);
  },

  // 调用楼层接口 - 接口
  getFloorCustom(url, params, options) {
    let option = {
      hasBase: true,
      showLoading: false,
      ...options,
    }
    return Request.get(url, params, option)
  }

}