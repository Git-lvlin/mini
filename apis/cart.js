import Request from '../utils/request.js'

const url = {
  addCart: "/cart/auth/collectCart/addCart",
  myCartList: "/cart/auth/myCart/list",
  removeCart: "/cart/auth/collectCart/removeCart",
  setCartNum: "/cart/auth/collectCart/setCart",
  checkedCart: "/cart/auth/collectCart/checkCart",
  checkedAllCart: "/cart/auth/cart/checkedAllCart",
  cartList: "/cart/auth/collectCart/list",
  subtotal: "/cart/auth/collectCart/subtotal",
  clear: "/cart/auth/collectCart/clearCart",
  clearExpired: "/cart/auth/collectCart/clearExpired",
}

export default {
  // 添加购物车明细
  addCartInfo(params, option) {
    return Request.post(url.addCart, params, option);
  },
  // 移除购物车明细
  removeCart(params, option) {
    return Request.post(url.removeCart, params, option);
  },
  // 设置购物车数量
  setCartNum(params, option) {
    return Request.post(url.setCartNum, params, option);
  },
  // 选中购物车明细
  checkedCart(params, option) {
    return Request.post(url.checkedCart, params, option);
  },
  // 全选购物车明细
  checkedAllCart(params, option) {
    return Request.post(url.checkedAllCart, params, option);
  },
  // 购物车商品列表
  cartList(params, option) {
    return Request.post(url.cartList, params, option);
  },
  // 购物车商品列表汇总
  summaryByCartData(params, option) {
    return Request.post(url.subtotal, params, option);
  },
  // 清空购物车
  clearCart(params, option) {
    return Request.post(url.clear, params, option);
  },
  // 清除失效商品
  clearExpired(params, option) {
    return Request.post(url.clearExpired, params, option);
  },
}