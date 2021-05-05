import Request from '../utils/request.js'

const url = {
  floorList: "/cms/open/home/list"
}

export default {
  // 首页楼层通用接口数据
  getFloorList(params, optipns) {
    return Request.get(url.floorList, params, optipns)
  }
}