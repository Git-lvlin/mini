import main from './index'
import goodApi from '../apis/good'
import { showToast, mapNum } from "../utils/tools"
import util from "../utils/util"


// 设置规格弹窗状态
const onChangeSpecState = (state) => {
  this.data.showSpecPopup = state;
}

// 加入购物车
const addCart = (data, showMsg) => {
  goodApi.addCart(data, {
    showLoading: false
  }).then(res => {
    if(showMsg) showToast({ title: "添加成功" });
    // let cartList = store.data.cartList;
    // cartList.push(data);
    // store.data.cartList = cartList;
    store.updateCart();
  })
}

// 设置商品数
const setCartNum = (data) => {
  goodApi.setCartNum(data, {
    showLoading: false
  }).then(res => {
    store.updateCart();
  });
}

// 购物车汇总数据
const getCartTotal = () => {
  goodApi.getCartTotal({}, {
    showLoading: false,
  }).then(res => {
    let cartListTotal = res;
    cartListTotal.subtotal = util.divide(cartListTotal.subtotal, 100);
    cartListTotal.subtotalPromotion = util.divide(cartListTotal.subtotalPromotion, 100);
    cartListTotal.freight = util.divide(cartListTotal.freight, 100);
    store.data.cartListTotal = cartListTotal;
  })
}

// 获取购物车商品列表
const getCartList = () => {
  goodApi.getCartList({}, {
    showLoading: false,
  }).then(res => {
    let cartList = mapNum(res)
    store.data.cartList = cartList;
  })
}

// 按店铺获取商品列表
const getStoreCartList = () => {
  goodApi.getStoreCartList({}, {
    showLoading: false,
  }).then(res => {
    let list = res.stores;
    list.forEach(item => {
      item.skus = mapNum(item.skus)
    });
    store.data.storeCartList = list;
  })
}

// 更新购物车数据
const updateCart = () => {
  store.getCartList();
  store.getStoreCartList();
  store.getCartTotal();
}

// 获取用户信息
const getUserInfo = () => {
  return main.data.userInfo
}
 
const store = {
  data:{
    systemInfo: main.data.systemInfo,
    userInfo: main.data.userInfo,
    userOtherInfo: main.data.userOtherInfo,
    // 显示选择规格弹窗
    showSpecPopup: false,
    // 购物车列表
    cartList: [],
    // 按店铺购物车列表
    storeCartList: [],
    // 购物车汇总数据
    cartListTotal: {
      "quantity": 0,
      "subtotal": 0,
      "subtotalPromotion": 0,
      "freight": 0,
      "checkedQuantity": 0
    },
    // 确认订单提交的商品数据
    orderGoodList: [],
  },
  onChangeSpecState,
  addCart,
  setCartNum,
  getCartTotal,
  getCartList,
  getStoreCartList,
  updateCart,
  getUserInfo,
  //调试开关，打开可以在 console 面板查看到 store 变化的 log
  debug: true,
  //当为 true 时，无脑全部更新，组件或页面不需要声明 use
  updateAll: false,
}

export default store