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
  detailNew: "/goods/option/goodsInfo",
  detailImg: "/goods/open/detailImages",
  skuList: "/goods/open/skus",
  checkSku: "/goods/option/goodsSpecList",
  intensiveUser: "/goods/option/goodsRandomVirtual",
  personalDetail: "/activity/option/group/personal/goodsInfo",
  pushTogether: "/activity/auth/group/createSingle",
  checkout: "/activity/auth/group/personal/checkMemberOrder",
  memberList: "/activity/option/group/personal/memberList",
  teamDetail: "/activity/option/group/personal/info",
  posterDetail: "/activity/option/group/poster",
  togetherUser: "/activity/option/group/personal/memberDynamic",
  
  detailRatio: "/contestprice/auth/contestprice/GetSimpleGoodsInfo",
  priceDetail: "/contestprice/open/contestprice/GetContestDetail",
  priceGoodList: "/contestprice/open/contestprice/GetHotGoodsList",

  searchHistory: "/search/auth/UserSearchHistory/getUserKeyword",
  clearSearchHistory: "/search/auth/userSearchHistory/clearUserKeyword",
  hotSearch: "/search/open/HotKeyword/index",
  searchList: "/search/option/opensearch/index",
  associationList: "/search/open/opensearch/getSuggest",
  userLike:"/goods/option/userLike",

  storeInfo: "/goods/option/goodsDetailStoreInfo",
  storeDetail: "/store/option/storeShop/show",
  storeGood: "/store/option/storeShop/salePage",

  businessDetail: "/store/option/v2/wholesale/productDetail",

  nearbyStore: "/store/option/memberShop/nearby",

  commentTotal: "/cms/option/comment/findAllCount",
  detailComment: "/cms/option/comment/getTwoComment",
  commentList: "/cms/option/comment/getComment",
  commentListTotal: "/cms/option/comment/findCount",
  commentDetail: "/cms/option/comment/findCommentDetail",
  fabulous: "/cms/auth/comment/point",

  cancel: "/order/auth/cancelOrder",
}

export default {
  // 取消订单
  cancelOrder(params, option) {
    return Request.post(url.cancel, params, option);
  },
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
  // 获取商品详情 - 旧
  getGoodDetail(params, option) {
    return Request.get(url.detail, params, option);
  },
  // 获取商品详情（秒约、c端集约、1688） - 新
  getGoodDetailNew(params, option) {
    return Request.post(url.detailNew, params, option);
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
  // 检查待支付订单
  getHasOrderInfo(params, option) {
    return Request.post(url.checkout, params, option);
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
  // 获取参与集约用户
  getIntensiveUser(params, option) {
    return Request.post(url.intensiveUser, params, option);
  },
  

  // 获取详情比价信息
  getDetailRatio(params, option) {
    return Request.get(url.detailRatio, params, option);
  },
  // 获取详情比价信息
  getPriceDetail(params, option) {
    return Request.get(url.priceDetail, params, option);
  },
  // 获取详情比价信息
  getPriceGoodList(params, option) {
    return Request.get(url.priceGoodList, params, option);
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
  //获取猜你喜欢商品列表
  getUserLike(params, option) {
    return Request.get(url.userLike, params, option);
  },

  // 获取店铺详情 - 商品详情页面
  getStoreInfo(params, option) {
    return Request.post(url.storeInfo, params, option);
  },
  // 获取店铺详情 - 店铺详情页面
  getStoreDetail(params, option) {
    return Request.get(url.storeDetail, params, option);
  },
  // 获取店铺商品
  getStoreGood(params, option) {
    return Request.get(url.storeGood, params, option);
  },

  // B端集约详情
  getBusinessDetail(params, option) {
    return Request.get(url.businessDetail, params, option);
  },

  // 获取一定范围内的店铺数
  getNearbyStore(params, option) {
    return Request.get(url.nearbyStore, params, option);
  },

  // 获取商品详情评价总数
  getCommentTotal(params, option) {
    return Request.post(url.commentTotal, params, option);
  },
  // 获取商品详情评价
  getDetailComment(params, option) {
    return Request.post(url.detailComment, params, option);
  },
  // 获取评价列表评价各类型总数
  getCommentListTotal(params, option) {
    return Request.post(url.commentListTotal, params, option);
  },
  // 获取评价列表评价
  getCommentList(params, option) {
    return Request.post(url.commentList, params, option);
  },
  // 获取评价列表评价
  setFabulous(params, option) {
    return Request.post(url.fabulous, params, option);
  },
  // 获取评价详情
  getCommentDetail(params, option) {
    return Request.post(url.commentDetail, params, option);
  },

  
}