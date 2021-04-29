import main from './index'
import goodApi from '../apis/good'
import { showToast } from "../utils/tools"
 
const store = {
  data:{
    systemInfo: main.data.systemInfo,
    userInfo: main.data.userInfo,
    // 显示选择规格弹窗
    showSpecPopup: false,
    // 购物车列表
    cartList: [],
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
  // 设置规格弹窗状态
  onChangeSpecState(state) {
    this.data.showSpecPopup = state;
  },
  // 加入购物车
  addCart(data, showMsg) {
    goodApi.addCart({
      quantity: data.quantity,
      skuId: data.skuId
    }, {
      showLoading: false
    }).then(res => {
      if(showMsg) showToast({ title: "添加成功" });
      // let cartList = store.data.cartList;
      // cartList.push(data);
      // store.data.cartList = cartList;
      store.updateCart();
    })
  },
  getCartTotal() {
    goodApi.getCartTotal({}, {
      showLoading: false,
    }).then(res => {
      store.data.cartListTotal = res;
    })
  },
  getCartList() {
    goodApi.getCartList({}, {
      showLoading: false,
    }).then(res => {
      store.data.cartList = res;
    })
  },
  updateCart() {
    store.getCartList();
    store.getCartTotal();
  },
}

export default store