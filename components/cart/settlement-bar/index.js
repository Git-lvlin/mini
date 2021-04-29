import create from '../../../utils/create'
import store from '../../../store/good'
import router from '../../../utils/router'
import { getStorageUserInfo, showModal } from '../../../utils/tools'
import { IMG_CDN } from '../../../constants/common'
import goodApi from '../../../apis/good'

create.Component(store, {
  use: [
    "systemInfo",
    "cartList",
    "cartListTotal",
  ],

  // store 属性计算
  computed: {
    selectAll() {
      let state = true;
      this.cartList.forEach(item => {
        if(!item.isChecked) {
          state = false
        }
      })
      return state;
    }
  },

  properties: {
    classPopupState: {
      type: Boolean,
      value: true,
    }
  },

  data: {
    showClassPopup: false,
    bottomBarHeight: 104,
    icon: IMG_CDN + "miniprogram/cart/select_icon.png",
    selectIcon: IMG_CDN + "miniprogram/cart/selected_icon.png",
  },

  ready() {
    const {
      systemInfo
    } = this.data.$;
    let bottomBarHeight = systemInfo.bottomBarHeight + 104;
    this.setData({
      bottomBarHeight
    });

    
  },

  pageLifetimes: {
    show() {
      let userInfo = getStorageUserInfo();
      if(!!userInfo) {
        this.store.getCartList();
        this.store.getCartTotal();
      }
    },

    hide() {},
  },

  methods: {
    // 检查是否有登录
    checkLogin(showLogin) {
      let userInfo = getStorageUserInfo(showLogin);
      return !!userInfo ? true : false;
    },
    // 打开购物车
    onOpenCart() {
      if(!this.checkLogin(true)) return ;
      this.setData({
        showClassPopup: !this.data.showClassPopup,
      })
    },
    // 关闭购物车
    onCloseCart() {
      this.setData({
        showClassPopup: false,
      })
    },
    // 跳转下单
    onToCreateOrder() {
      if(!this.checkLogin(true)) return ;
      router.push({
        name: "createOrder"
      })
    },
    // 勾选或取消商品
    onSelectGood({
      currentTarget
    }) {
      let {
        id: skuId,
        checked: isChecked,
      } = currentTarget.dataset;
      goodApi.checkedCart({
        skuId,
      }).then(res => {
        this.store.updateCart();
      })
    },
    // 清空购物车
    onClearCart() {
      showModal({
        content: "确定清空购物车？",
        ok() {
          goodApi.checkedAllCart({
            isChecked: false,
          }).then(res => {
            this.store.updateCart();
          })
        }
      })
    },
    // 购物车全选
    onSelectCard() {
      let selectAll = this.data.selectAll;
      goodApi.checkedAllCart({
        isChecked: !selectAll,
      }).then(res => {
        this.store.updateCart();
      })
    }
  }
})
