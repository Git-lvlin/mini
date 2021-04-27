import Request from '../utils/request.js'

const url = {
  category: "/goods/open/category",
  goodList: "/goods/open/list",
  recommends: "/goods/open/recommends",
  
  cartList: "/cart/auth/cart/list",
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

}