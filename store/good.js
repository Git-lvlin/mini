import main from './index'
import goodApi from '../apis/good'
import cartApi from '../apis/order'
import { showToast, mapNum } from "../utils/tools"
import util from "../utils/util"

// 默认汇总数据
const defCartTotal = {
  "quantity": 0,
  "subtotal": 0,
  "subtotalPromotion": 0,
  "freight": 0,
  "checkedQuantity": 0
}

// 设置规格弹窗状态
const onChangeSpecState = (state) => {
  store.data.showSpecPopup = state;
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
    store.updateCart(true);
  });
}

// 购物车汇总数据
const getCartTotal = () => {
  goodApi.getCartTotal({}, {
    showLoading: false,
  }).then(res => {
    let goodListTotal = res;
    goodListTotal.subtotal = util.divide(goodListTotal.subtotal, 100);
    goodListTotal.subtotalPromotion = util.divide(goodListTotal.subtotalPromotion, 100);
    goodListTotal.freight = util.divide(goodListTotal.freight, 100);
    store.data.goodListTotal = goodListTotal;
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

// 获取购物车总金额
const getStoreGoodsTotle = (storeList) => {
  let storeGoodsInfos = [];
  let storeGood = {};
  let checkedQuantity = 0;
  storeList.forEach(item => {
    storeGood = {
      storeNo: item.storeNo,
      goodsInfos: []
    };
    item.skus.forEach(child => {
      if(child.isChecked) {
        checkedQuantity += 1;
        storeGood.goodsInfos.push({
          objectId: child.objectId,
          activityId: child.activityId,
          orderType: child.orderType,
          spuId: child.spuId,
          skuId: child.skuId,
          skuNum: child.quantity,
        });
      }
    });
    if (storeGood.goodsInfos.length) {
      storeGoodsInfos.push(storeGood);
    }
  });
  if(!storeGoodsInfos.length) {
    store.data.cartListTotal = {
      subtotal: 0,
      subtotalPromotion: 0,
      freight: 0,
      checkedQuantity: 0,
    };
    return ;
  }
  cartApi.getConfirmInfo({
    storeGoodsInfos,
    fromCart: 1,
  }).then(res => {
    let cartListTotal = res;
    cartListTotal.subtotal = util.divide(cartListTotal.totalAmount || 0, 100);
    cartListTotal.subtotalPromotion = util.divide(cartListTotal.payAmount || 0, 100);
    cartListTotal.freight = util.divide(cartListTotal.shippingFeeAmount || 0, 100);
    cartListTotal.checkedQuantity = checkedQuantity;
    store.data.cartListTotal = cartListTotal;
  });
}

// 按店铺获取商品列表
const getStoreCartList = () => {
  goodApi.getStoreCartList({}, {
    showLoading: false,
  }).then(res => {
    let list = res.stores;
    getStoreGoodsTotle(list);
    list.forEach(item => {
      item.skus = mapNum(item.skus)
    });
    store.data.storeCartList = list;
  })
}

// 更新购物车数据
const updateCart = (isCart = false) => {
  // if(!isCart) {
    getCartList();
    getCartTotal();
  // } else {
    getStoreCartList();
  // }
}

// 获取用户信息
const getUserInfo = () => {
  return main.data.userInfo
}

// 清空购物车数据
const clearCart = () => {
  store.data.cartList = [];
  store.data.storeCartList = [];
  store.data.goodListTotal = { ...defCartTotal };
  store.data.cartListTotal = { ...defCartTotal };
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
    // 商品汇总数据
    goodListTotal: { ...defCartTotal },
    // 购物车汇总数据
    cartListTotal: { ...defCartTotal },
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
  clearCart,
  //调试开关，打开可以在 console 面板查看到 store 变化的 log
  debug: true,
  //当为 true 时，无脑全部更新，组件或页面不需要声明 use
  updateAll: false,
}

export default store