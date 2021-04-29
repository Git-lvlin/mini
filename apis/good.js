import Request from '../utils/request.js'

const url = {
  category: "/goods/open/category",
  goodList: "/goods/open/list",
  recommends: "/goods/open/recommends",
  detail: "/goods/open/info",
  
  addCart: "/cart/auth/cart/addCart",
  cartList: "/cart/auth/cart/list",
  removeCart: "/cart/auth/cart/removeCart",
  setCartNum: "/cart/auth/cart/setCart",
  checkedCart: "/cart/auth/cart/checkedCart",
  checkedAllCart: "/cart/auth/cart/checkedAllCart",
  subtotal: "/cart/auth/cart/subtotal",
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

  
  // 获取商品详情
  getDetail(params, option) {
    return Request.get(url.detail, params, option);
  },

}