import create from "../../../utils/create";
import store from "../../../store/good";
import { IMG_CDN } from "../../../constants/common";
import goodApi from "../../../apis/good";
import cartApi from "../../../apis/cart";
import router from "../../../utils/router";
import { showModal, showToast } from "../../../utils/tools";
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

create.Component(store, {
  options: {
    addGlobalClass: true,
  },
  properties: {
    data: {
      type: Object,
      value: {},
    },
    show: {
      type: Boolean,
      value: false,
      observer(now, old) {
        if (now !== old) {
          this.getCartList()
        }
      }
    },
    store: {
      type: Object,
      value: {},
    },
    jump: {
      type: Boolean,
      value: true
    },
    aPrice: {
      type: String,
      value: '00'
    },
    zPrice: {
      type: String,
      value: '00'
    },
    goodNum: {
      type: Number,
      value: 0
    },
    info: {
      type: Object,
      value: {},
      observer(now, old) {
        if (now !== old) {
          console.log('now', now, old)
          if (now) {
            this.infoChange(now)
          }
        }
      }
    },
  },
  lifetimes: {
    ready() {
      // this.getCartList()
      this.updateSelectAddressType('lifetimes read');
    },
  },
  pageLifetimes: {
    ready() {
      this.updateSelectAddressType('pageLifetimes read');
    }
  },
  data: {
    notSelectIcon: `${IMG_CDN}miniprogram/common/def_choose.png`,
    selectIcon: `${IMG_CDN}miniprogram/common/choose.png`,
    aPrice: '00',
    zPrice: '00',
    popupType: false,
    checkoutAll: false,
    cartGoodsOne: null,
    cartGoodsTwo: null,
    // {name: "上门提货", type: 2, status: 0}
    // {name: "商家配送", type: 3, status: 0}
    selectAddressType: {},
    deletePopupShow: false,
    inTitle: '删除商品',
    inContent: '确定删除该商品吗？',
    confirmText: '删除',
    deletePopupShowAll: false,
  },

  methods: {
    updateSelectAddressType(name) {
      let data = wx.getStorageSync("CREATE_INTENSIVE")
      console.log(name, ' selectAddressType 35 cart-popup', this.data.selectAddressType)
      if (data.selectAddressType && data.selectAddressType.type) {
        this.setData({
          selectAddressType: data.selectAddressType,
        }, () => {
          console.log(name, ' selectAddressType 35 cart-popup', this.data.selectAddressType)
        })
      }
    },

    // 跳转详情
    onGood({
      currentTarget
    }) {
      let {
        spuId,
        skuId,
        activityId,
        objectId,
        orderType,
      } = currentTarget.dataset.data;
      router.push({
        name: 'detail',
        data: {
          spuId,
          skuId,
          activityId,
          objectId,
          orderType,
          isCart: 1,
        }
      });
    },
    //  切换配送、自提状态
    checkSelf() {
      let data2 = wx.getStorageSync("CREATE_INTENSIVE")
      if (data2) {
        console.log('selectAddressType  before', data2.selectAddressType)
        var current = {"type": 3} // 配送
        if (data2 && data2.selectAddressType && data2.selectAddressType.type == 3) {
          current = {"type": 2} // 自提
        }
        data2.selectAddressType = current
        wx.setStorageSync("CREATE_INTENSIVE", data2)
      } else {
        wx.setStorageSync("CREATE_INTENSIVE", {selectAddressType: current})
      }
      this.setData({
        selectAddressType: current,
      })
      // this.triggerEvent("check", !this.data.isSelf);
      // this.setData({
      //   isSelf: !this.data.isSelf
      // })
    },
    // 选中购物车明细
    checkedItem(e) {
      const {skuId, objectId} = e.currentTarget.dataset.item;
      const clickIndex = e.currentTarget.dataset.index;
      const params = {
        skuId,
        objectId,
      }
      cartApi.checkedCart(params).then((res) => {
        let one = this.data.cartGoodsOne;
        one[clickIndex].isChecked = res.value;
        this.setData({
          cartGoodsOne: one
        })
        // 设置完还需要更新购物车汇总数据
        this.toUpdateCartAll()
      })
    },
    // 删除失效商品
    invalidGoodDelete(e) {
      let {index, item} = e.currentTarget.dataset;
      let {cartGoodsTwo} = this.data;
      cartGoodsTwo[index].quantity = 0;
      this.setData({
        deleteData: cartGoodsTwo[index]
      }, () => {
        this.showCartsPopup()
      })
      // return new Promise((resolve) => {
      //   const {skuId, objectId} = e.currentTarget.dataset.item;
      //   // const clickIndex = e.currentTarget.dataset.index;
      //   const params = {
      //     skuId,
      //     objectId,
      //   }
      //   cartApi.clearExpired(params).then((res) => {
      //     console.log('删除失效商品', res)
      //     this.getCartList()
      //     resolve()
      //     // let one = this.data.cartGoodsOne;
      //     // one[clickIndex].isChecked = res.value;
      //     // this.setData({
      //     //   cartGoodsOne: one
      //     // })
      //   })
      // })
    },
    // 购物车商品列表详情
    getCartList() {
      cartApi.cartList().then((res) => {
        console.log('购物车商品列表', res)
        let one = res.filter(item => item.goodsState)
        let two = res.filter(item => !item.goodsState)
        this.setData({
          cartGoodsOne: one,
          cartGoodsTwo: two
        })
      })
    },
    // 一键清空失效商品
    clearExpiredAll() {
      cartApi.clearExpired().then(() => {
        this.getCartList()
        this.setData({
          deletePopupShowAll:false
        })
      })
    },
    // 设置购物车商品数量
    setCartNum(itemInfo) {
      const that = this
      const { quantity, skuId, objectId } = itemInfo;
      const params = {
        skuId: skuId,
        objectId: objectId,
        quantity: quantity,
      }
      cartApi.setCartNum(params).then((res) => {
        // console.log('设置购物车商品数量 226', res)
        if (res.value) {
          that.getCartList()
          // 设置完还需要更新购物车汇总数据
          that.toUpdateCartAll()
          that.onCloseCartsPopup()
        }
      })
    },
    toUpdateCartAll() {
      this.getSummaryByCartData()
    },
    // 购物车商品列表汇总
    getSummaryByCartData() {
      cartApi.summaryByCartData().then((res) => {
        console.log('购物车汇总数据', res)
        this.triggerEvent("change", res);
        // this.setData({
        //   cartAllData: res
        // })
      })
    },
    onStepChangeAdd(e) {
      // Toast.loading({ forbidClick: true });
      let {index, item} = e.currentTarget.dataset;
      let {buyMaxNum, quantity, unit} = item;
      let {cartGoodsOne} = this.data;
      if (quantity + 1 > buyMaxNum) {
        Toast(`该商品最多购买${buyMaxNum}${unit}`);
        return
      }
      cartGoodsOne[index].quantity = quantity + 1
      this.setCartNum(cartGoodsOne[index]);
      setTimeout(() => {
        Toast.clear();
        this.setData({
          cartGoodsOne: cartGoodsOne
        });
      }, 300);
    },
    onStepChangeDelete(e) {
      let {index, item} = e.currentTarget.dataset;
      let {buyMinNum, quantity, unit} = item;
      let {cartGoodsOne} = this.data;
      if (quantity == 0) {
        return
      }

      let num = quantity - 1;
      if (num < buyMinNum) {
        num = 0
      }
      cartGoodsOne[index].quantity = num;
      if (num === 0) {
        this.setData({
          deleteData: cartGoodsOne[index]
        })
        this.showCartsPopup()
        return
      }
      // Toast.loading({ forbidClick: true });
      this.setCartNum(cartGoodsOne[index]);
      // if ((buyMinNum>1) && (quantity - 1 < buyMinNum)) {
      //   Toast(`该商品${buyMinNum}${unit}起购`);
      // }
      setTimeout(() => {
        Toast.clear();
        this.setData({
          cartGoodsOne: cartGoodsOne,
        });
      }, 300);
    },
    // 全选
    onCheckoutAll() {
      const params = {
        isChecked: !this.data.checkoutAll
      }
      cartApi.checkedAllCart(params).then((res) => {
        console.log('全选购物车明细', res.value)
        this.toUpdateCartAll()
        this.getCartList()
        this.setData({
          checkoutAll: res.value
        })
      })
    },
    onCloseCartsPopup() {
      this.setData({
        deletePopupShow: false
      })
    },
    onCloseCartsPopupAll() {
      this.setData({
        deletePopupShowAll: false
      })
    },
    confirDelete() {
      this.setCartNum(this.data.deleteData);
    },
    confirDeleteAll() {
      this.setCartNum(this.data.deleteData);
    },
    showCartsPopup() {
      this.setData({
        deletePopupShow: true
      })
    },
    showCartsPopupAll() {
      this.setData({
        deletePopupShowAll: true
      })
    },
    onClose() {
      this.triggerEvent("close", false);
    },
    onToOrder() {
      const {
        groupId,
      } = this.data.data;
      this.triggerEvent("jump", {
        groupId
      });
    },
    // onShowPopup() {
    //   if (!this.data.popupType) {
    //     this.getCartList()
    //   }
    //   this.setData({
    //     popupType: !this.data.popupType
    //   })
    // },
    infoChange(data) {
      if (data && data.subtotalPromotion) {
        let price = (data.subtotalPromotion/100).toString();
        let a = '';
        let z = '';
        if (price.includes('.')) {
          a = price.split('.')[0];
          z = price.split('.')[1];
          if (z.length < 2) {
            z = z + '0';
          }
        } else {
          a = price;
          z = '00';
        }
        this.setData({
          aPrice: a,
          zPrice: z
        })
      }
    },
    
    // 店铺全选
    onChooseAll() {
      const {
        store
      } = this.data;
      goodApi.checkedAllCart({
        isChecked: !store.isChecked,
        storeNo: store.storeNo,
      }).then(res => {
        this.store.updateCart(true);
      })
    },
    // 商品单选
    onChooseGood({
      currentTarget
    }) {
      const {
        id
      } = currentTarget.dataset;
      goodApi.checkedCart({
        skuId: id
      }).then(res => {
        this.store.updateCart(true);
      })
    },
    // 商品数变化
    handleStockChange({ detail }) {
      const {
        good,
      } = detail;
      let data = {
        spuId: good.spuId,
        skuId: good.skuId,
        quantity: detail.num,
        orderType: good.orderType,
        goodsFromType: good.goodsFromType,
      };
      if(good.activityId) data.activityId = good.activityId;
      if(good.objectId) data.objectId = good.objectId;
      if(detail.type === "add") {
        this.store.addCart(data);
      }
      if(detail.type === "set") {
        this.store.setCartNum(data);
      }
    },
    // 用于点击阻止事件冒泡
    onNum() {},
    // 点击跳转店铺
    onToShop() {
      const {
        store,
      } = this.data;
      let id = store.storeNo.slice(8, store.storeNo.length);
      id = +id;
      if(id < 123580) return;
      router.push({
        name: "store",
        data: {
          storeNo: store.storeNo,
        },
      })
    },
    // 跳转商详
    onToDetail({
      currentTarget,
    }) {
      const {
        good,
      } = currentTarget.dataset;
      router.push({
        name: "detail",
        data: {
          activityId: good.activityId,
          objectId: good.objectId,
          orderType: good.orderType,
          skuId: good.skuId,
          spuId: good.spuId,
        },
      })
    },
    // 点击删除商品
    onDelete({
      currentTarget,
    }) {
      const {
        good,
      } = currentTarget.dataset;
      showModal({
        content: "您确定要删除？",
        ok() {
          goodApi.removeCart({
            skuIds: [good.skuId],
          }).then(res => {
            showToast({ title: "删除成功" });
            store.updateCart(true);
          });
        },
      })
    },
    // 点击移除购物车
    removeCart({
      currentTarget,
    }) {
      const {
        good,
      } = currentTarget.dataset
      const that = this
      showModal({
        content: "您确定要删除？",
        ok() {
          const { skuStoreNo, objectId, skuId} = good
          console.log("on cart removeCart good", good)
          const params = {
            objectIds: [objectId], // 业务id数组
            skuIds: [skuId], //
            skuStoreNo,
          }
          console.log("on cart removeCart params", params)
          cartApi.removeCart(params).then(res => {
            showToast({ title: "删除成功" });
            that.getCartList();
            that.toUpdateCartAll()
            // that.onClose();
          });
        },
      })
    },
  }
})
