import Request from '../utils/request.js'

const url = {
  floorList: "/cms/open/home/list"
}

export default {
  // 首页楼层通用接口数据
  getFloorList(params, options) {
    return Request.get(url.floorList, params, options)
  },

  // 调用楼层接口
  getFloorCustom(url, params, options) {
    let option = {
      hasBase: true,
      showLoading: false,
      ...options,
    }
    return Request.get(url, params, option)
  }

}