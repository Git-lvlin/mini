import Request from '../utils/request.js'

const url = {
  category: "/goods/open/category",
  goodList: "/goods/open/list",
  recommends: "/goods/open/recommends",
  
  addCart: "/cart/auth/cart/addCart",
  cartList: "/cart/auth/cart/list",
  myCartList: "/cart/auth/myCart/list",
  removeCart: "/cart/auth/cart/removeCart",
  setCartNum: "/cart/auth/cart/setCart",
  checkedCart: "/cart/auth/cart/checkedCart",
  checkedAllCart: "/cart/auth/cart/checkedAllCart",
  subtotal: "/cart/auth/cart/subtotal",

  detail: "/goods/option/info",
  detailImg: "/goods/open/detailImages",
  skuList: "/goods/open/skus",
  checkSku: "/goods/option/goodsSpecList",
  personalDetail: "/activity/option/group/personal/goodsInfo",
  pushTogether: "/activity/auth/group/createSingle",
  memberList: "/activity/option/group/personal/memberList",
  teamDetail: "/activity/option/group/personal/info",
  posterDetail: "/activity/option/group/poster",
  togetherUser: "/activity/option/group/personal/memberDynamic",
  
  detailRatio: "/contestprice/auth/contestprice/GetSimpleGoodsInfo",

  searchHistory: "/search/auth/UserSearchHistory/getUserKeyword",
  clearSearchHistory: "/search/auth/userSearchHistory/clearUserKeyword",
  hotSearch: "/search/auth/HotKeyword/index",
  searchList: "/search/option/opensearch/index",
  associationList: "/search/option/opensearch/getSuggest",

  storeDetail: "/store/option/storeShop/show",
  storeGood: "/store/option/storeShop/salePage",

  nearbyStore: "/store/option/memberShop/nearby",
}

export default {
  // 获取一级二级分类
  getCategory(params, option) {
    return Request.get(url.category, params, option);
  },
  // 获取分类商品列表
  getGoodsList(params, option) {
    return Request.get(url.goodList, params, option);
  },
  // 获取分类推荐商品列表
  getRecommends(params, option) {
    return Request.get(url.recommends, params, option);
  },

  // 获取购物车列表
  getCartList(params, option) {
    return Request.post(url.cartList, params, option);
  },
  // 按店铺获取购物车列表
  getStoreCartList(params, option) {
    return Request.post(url.myCartList, params, option);
  },
  // 添加到购物车
  addCart(params, option) {
    return Request.post(url.addCart, params, option);
  },
  // 商品移除出购物车
  removeCart(params, option) {
    return Request.post(url.removeCart, params, option);
  },
  // 设置商品数量 - 购物车
  setCartNum(params, option) {
    return Request.post(url.setCartNum, params, option);
  },
  // 购物车 选中商品明细
  checkedCart(params, option) {
    return Request.post(url.checkedCart, params, option);
  },
  // 购物车 全选商品明细
  checkedAllCart(params, option) {
    return Request.post(url.checkedAllCart, params, option);
  },
  // 购物车 汇总明细
  getCartTotal(params, option) {
    return Request.post(url.subtotal, params, option);
  },

  
  // 获取详情图片
  getDetailImg(params, option) {
    return Request.get(url.detailImg, params, option);
  },
  // 获取商品详情
  getGoodDetail(params, option) {
    return Request.get(url.detail, params, option);
  },
  // 获取sku列表
  getSkuList(params, option) {
    return Request.get(url.skuList, params, option);
  },
  // 选择sku
  getCheckSku(params, option) {
    return Request.post(url.checkSku, params, option);
  },
  // 获取单约详情
  getPersonalDetail(params, option) {
    return Request.post(url.personalDetail, params, option);
  },
  // 发起拼团
  pushTogether(params, option) {
    return Request.post(url.pushTogether, params, option);
  },
  // 获取单约列表
  getTogetherList(params, option) {
    return Request.post(url.memberList, params, option);
  },
  // 单约团详情
  getTeamDetail(params, option) {
    return Request.post(url.teamDetail, params, option);
  },
  // 获取拼团海报详情
  getPosterDetail(params, option) {
    return Request.post(url.posterDetail, params, option);
  },
  // 获取已拼单用户
  getTogetherUser(params, option) {
    return Request.post(url.togetherUser, params, option);
  },

  // 获取详情比价信息
  getDetailRatio(params, option) {
    return Request.get(url.detailRatio, params, option);
  },

  // 获取搜索历史
  getSearchHistory(params, option) {
    return Request.post(url.searchHistory, params, option);
  },
  // 清空搜索历史
  clearSearchHistory(params, option) {
    return Request.post(url.clearSearchHistory, params, option);
  },
  // 热门搜索
  getHotSearch(params, option) {
    return Request.post(url.hotSearch, params, option);
  },
  // 搜索商品列表
  getSearchList(params, option) {
    return Request.post(url.searchList, params, option);
  },
  // 搜索联想
  getAssociationList(params, option) {
    return Request.post(url.associationList, params, option);
  },

  // 获取店铺详情
  getStoreDetail(params, option) {
    return Request.get(url.storeDetail, params, option);
  },
  // 获取店铺商品
  getStoreGood(params, option) {
    return Request.get(url.storeGood, params, option);
  },
  // 获取一定范围内的店铺数
  getNearbyStore(params, option) {
    return Request.get(url.nearbyStore, params, option);
  },

}