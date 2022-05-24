import create from '../../../../utils/create'
import store from '../../../../store/good'
import router from '../../../../utils/router'
import { getStorageUserInfo, showModal, showToast } from '../../../../utils/tools'
import { IMG_CDN } from '../../../../constants/common'
import goodApi from '../../../../apis/good'

create.Component(store, {
  use: [
    "systemInfo",
    "cartList",
    "goodListTotal",
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
    barIndex: {
      type: Number,
      value: 999,
    },
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
      const {
        cartList
      } = this.data.$;
      let goodList = [];
      let hasStore = false;
      cartList.forEach(item => {
        hasStore = false;
        if(item.isChecked) {
          // goodList[0].goodsInfos.push({
          //   ...this.getGoodOrderInfo(item),
          // });
          goodList.forEach(child => {
            if(item.storeNo === child.storeNo) {
              hasStore = true;
              child.goodsInfos.push({
                ...this.getGoodOrderInfo(item),
              });
            }
          });
          if(!hasStore) {
            goodList.push({
              storeNo: item.storeNo,
              goodsInfos: [{
                ...this.getGoodOrderInfo(item),
              }],
            });
          }
        }
      });
      if(goodList.length < 1) {
        showToast({
          title: "请选择需要下单的商品",
        })
        return ;
      }
      store.data.orderGoodList = goodList;
      wx.setStorageSync("GOOD_LIST", goodList);
      router.push({
        name: "createOrder",
      })
    },
    // 提交订单商品数据
    getGoodOrderInfo(good) {
      return {
        spuId: good.spuId,
        skuId: good.skuId,
        objectId: good.objectId,
        activityId: good.activityId,
        orderType: good.orderType,
        goodsFromType: good.goodsFromType,
        skuNum: good.quantity,
      }
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
      const that = this;
      const {
        cartList
      } = this.store.data;
      if(cartList.length <= 0) {
        showToast({ title: "没有商品呢" });
        return;
      };
      showModal({
        content: "确定清空购物车？",
        ok() {
          const skuIds = [];
          cartList.forEach(item => {
            skuIds.push(item.skuId);
          });
          goodApi.removeCart({
            skuIds,
          }).then(res => {
            that.store.updateCart();
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
