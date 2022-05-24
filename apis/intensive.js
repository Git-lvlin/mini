import Request from '../utils/request'

const url = {
  floorList: "/cms/open/home/list",
  // bannerList: "/cms/open/banner/list",
  bannerList: "/cms/option/banner/list",
  intensiveGood: "/activity/open/wholesaleGoodsList",
  getStoreNotInSkus: "/activity/option/getStoreNotInSkus",
  remindStorekeeperBuy: "/activity/auth/remindStorekeeperBuy",
  hotGood: "/activity/open/tagGoodsList",
  hotGoodV2: "/activity/open/tagGoodsListV2",
  more: "/activity/option/group/personal/list",

  shareInfo: "/share/option/shareParam/queryShareContent",

  advert: "/public/open/adimgs",

  secondHotGoodsList: '/activity/open/secondHotGoodsList',
  
  classGood: '/goods/option/getHomeCategoryList',


  goodsList: '/store/option/v/FreshMemberShop/shopIndexGoodList',
  category: '/store/option/v/FreshMemberShop/shopIndexCategory',
  rec: '/store/option/FreshMemberShop/shopRecGoods',
  love: '/store/option/FreshMemberShop/shopGuessFavourite',

  search: '/search/option/opensearch/shopGoodsSearch',

  storeNo: '/store/auth/memberShop/storeData'
}

const getExamine = (params) => {
  const state = wx.getStorageSync("EXAMINE") || false;
  if(state) {
    params = {
      verifyVersionId: 2,
      ...params
    };
  } else {
    params = {
      verifyVersionId: 3,
      ...params
    };
  }
  return params;
}

const getStoreNo = (p) => {
  let takeSpot = wx.getStorageSync("TAKE_SPOT") || {};
  if(takeSpot.storeNo) {
    p = {
      ...p,
      storeNo: takeSpot.storeNo,
    }
  }
  return p
}


export default {
  // 小程序版本状态
  getExamine,

  // 首页楼层通用接口数据
  getFloorList(params, options) {
    // params.floorVersion = '1.0.2'
    params.floorVersion = '2.0.5'
    return Request.get(url.floorList, params, options)
  },
  // 获取1分钱&特价
  getAcarea(url, params, option) {
    return Request.get(url, params, option);
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

  // 提醒店主采购
  remindStorekeeperBuy(params, option) {
    return Request.post(url.remindStorekeeperBuy, params, option);
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

  // 提醒店主采购
  getMoreList(params, option) {
    return Request.post(url.more, params, option);
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

  // 秒约爆品列表
  getPopularList(params, option) {
    params = getExamine(params);
    return Request.post(url.secondHotGoodsList, params, option);
  },

  // 秒约爆品列表
  getClassGood(params, option) {
    params = getExamine(params);
    return Request.post(url.classGood, params, option);
  },


  // 2.5.2生鲜店商品列表
  getGoodsList(params, option) {
    // params = getExamine(params);
    params = getStoreNo(params)
    return Request.get(url.goodsList, params, option);
  }, 
  // 2.5.2生鲜店分类列表
  getGoodsCategory(params, option) {
    // params = getExamine(params);
    params = getStoreNo(params)
    return Request.get(url.category, params, option);
  },
  // 2.5.2生鲜店为你推荐
  getRecGoods(params, option) {
    // params = getExamine(params);
    params = getStoreNo(params)
    return Request.get(url.rec, params, option);
  },
  // 2.5.2店铺猜你喜欢
  getYouLike(params, option) {
    // params = getExamine(params);
    params = getStoreNo(params)
    return Request.get(url.love, params, option);
  },
  // 2.5.2店内商品搜索
  searchInStore(params, option) {
    params = getStoreNo(params)
    return Request.get(url.search, params, option);
  },

  getStoreNo(params, option) {
    return Request.get(url.storeNo, params, option);
  },
}