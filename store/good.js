import main from './index'
import goodApi from '../apis/good'
import { showToast } from "../utils/tools"
 
const store = {
  data:{
    systemInfo: main.data.systemInfo,
    userInfo: main.data.userInfo,
    showSpecPopup: false,
    cartList: [],
    cartListTotal: {},
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