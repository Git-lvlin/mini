import create from '../../../utils/create'
import store from '../../../store/good'
import router from '../../../utils/router'
import homeApi from '../../../apis/home'
import goodApi from "../../../apis/good";
import cartApi from "../../../apis/cart";
import Toast from '@vant/weapp/toast/toast';

create.Page(store, {
  touchTimer: null,
  isScroll: false,
  objectId: '',
  use: [
    "userInfo",
    "systemInfo"
  ],

  data: {
    scrolling: false,
    scrollBottom: false,
    showLoadImg: false,
    refresherTriggered: false,
    // 已滚动高度
    scrollTop: 0,
    deletePopupShow: false,
    deletePopupShowAll: false,
    sendStatus: 'close',
    selectAddressType: {
      type: 2
    },
    selectSku: {}
  },

  onLoad(options) {
    console.log(this.data)
    this.objectId = options.objectId
  },

  onReady() {


  },

  onShow() {
    this.getCartList()
    this.getSummaryByCartData()
    this.updateSelectAddressType()
    this.getStoreInfo()
    this.getStoreDeliveryStatus()
  },

  // 监听触控移动
  handleTouchMove(event) {
    if (this.isScroll) return;
    this.isScroll = true;
    this.setData({
      scrolling: true,
    });
    clearTimeout(this.touchTimer);
    this.touchTimer = null;
  },

  handleTouchEnd(event) {
    this.touchTimer = setTimeout(() => {
      this.isScroll = false;
      this.setData({
        scrolling: false,
      });
    }, 400);
  },

  // 监听页面滚动
  // onPageScroll(e) {
  onViewScroll({
    detail
  }) {

  },
  handleScrollBottom() {

  },

  // 下拉刷新
  onPullDownRefresh() {
    setTimeout(() => {
      this.setData({
        refresherTriggered: true,
      }, () => {
        this.getCartList()
        this.getSummaryByCartData()
      });
    }, 500)

  },

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

  getStoreInfo() {
    let takeSpot = wx.getStorageSync("TAKE_SPOT") || {}
    goodApi.getStoreInfo({
      orderType: 15,
      storeNo: takeSpot.storeNo,
    }).then(res => {
      this.setData({
        storeInfo: res
      })
    });
  },

  updateSelectAddressType() {
    let data = wx.getStorageSync("CREATE_INTENSIVE")
    if (data.selectAddressType && data.selectAddressType.type) {
      this.setData({
        selectAddressType: data.selectAddressType,
      })
    }
  },

  remove() {

    const objectIds = []
    const skuIds = []
    const params = {
      objectIds, // 业务id数组
      skuIds, // 商品skuid数组
    }

    this.data.cartGoodsOne.forEach(item => {
      if (item.isChecked) {
        objectIds.push(item.objectId)
        skuIds.push(item.skuId)
      }
    })

    if (this.objectId == '-15') {
      params.subType = 151
    }

    cartApi.removeCart(params)
      .then(_ => {
        this.getCartList()
        this.toUpdateCartAll()
        this.onCloseCartsPopupAll()
      })
  },

  // 设置购物车商品数量
  setCartNum(itemInfo,cb) {
    const that = this
    const { quantity, skuId, objectId } = itemInfo;
    const params = {
      skuId: skuId,
      objectId: objectId,
      quantity: quantity,
    }

    if (this.objectId == '-15') {
      params.subType = 151
    }

    cartApi.setCartNum(params).then((res) => {
      this.getCartList()
      this.toUpdateCartAll()
      cb && cb()
    })
  },

  toUpdateCartAll() {
    this.getSummaryByCartData()
  },
  // 购物车商品列表汇总
  getSummaryByCartData() {
    const params = {}
    if (this.objectId == '-15') {
      params.subType = 151
    }
    cartApi.summaryByCartData(params).then((res) => {
      if (res.checkedQuantity === res.quantity) {
        this.setData({
          checkoutAll: true
        })
      } else {
        this.setData({
          checkoutAll: false
        })
      }
      this.setData({
        cartAllData: res
      })
    })
  },

  // 购物车商品列表详情
  getCartList() {
    const params = {}
    if (this.objectId == '-15') {
      params.subType = 151
    }
    cartApi.cartList(params).then((res) => {
      this.setData({
        refresherTriggered: false,
      })
      let one = res.filter(item => item.goodsState)
      let two = res.filter(item => !item.goodsState)
      this.setData({
        cartGoodsOne: one,
        cartGoodsTwo: two
      })
    })
  },

  onStepChangeAdd(e) {
    // Toast.loading({ forbidClick: true });
    let { index, item } = e.currentTarget.dataset;
    let { buyMaxNum, quantity, unit } = item;
    let { cartGoodsOne } = this.data;
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
  checkedItem(e) {
    const { skuId, objectId } = e.currentTarget.dataset.item;
    const clickIndex = e.currentTarget.dataset.index;
    const params = {
      skuId,
      objectId,
    }

    if (objectId=='-15') {
      params.subType = 151
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
  onStepChange(e) {
    let { index, item } = e.currentTarget.dataset;
    let { buyMaxNum, unit } = item;
    let { cartGoodsOne } = this.data;
    const quantity = e.detail

    cartGoodsOne[index].quantity = quantity;

    if (quantity > buyMaxNum) {
      Toast(`最多只能买${buyMaxNum}${unit}哦`);
      cartGoodsOne[index].quantity = buyMaxNum;
      this.setData({
        cartGoodsOne: cartGoodsOne,
      });
      return;
    }

    if (quantity > 100) {
      cartGoodsOne[index].quantity = 100;
      this.setData({
        cartGoodsOne: cartGoodsOne,
      });
    }

    this.setCartNum(cartGoodsOne[index]);
    setTimeout(() => {
      this.setData({
        cartGoodsOne: cartGoodsOne,
      });
    }, 300);
  },
  clearExpiredAll() {
    const params = {}
    if (this.objectId == '-15') {
      params.subType = 151
    }
    cartApi.clearExpired(params).then(() => {
      this.getCartList()
      Toast('删除成功')
    })
  },
  // 全选
  onCheckoutAll() {
    const params = {
      isChecked: !this.data.checkoutAll,
    }
    if (this.objectId == '-15') {
      params.subType = 151
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

  onCloseCartsPopupAll() {
    this.setData({
      deletePopupShowAll: false
    })
  },

  showCartsPopupAll() {
    if (this.data.cartAllData.checkedQuantity === 0) {
      return
    }
    this.setData({
      deletePopupShowAll: true
    })
  },
  getStoreDeliveryStatus() {
    cartApi.getStoreDeliveryStatus()
      .then(res => {
        this.setData({
          sendStatus: res.sendStatus
        })
      })
  },
  checkSelf() {
    if (this.data.sendStatus === 'close') {
      return;
    }
    let data2 = wx.getStorageSync("CREATE_INTENSIVE")
    if (data2) {
      var current = { "type": 3 } // 配送
      if (data2 && data2.selectAddressType && data2.selectAddressType.type == 3) {
        current = { "type": 2 } // 自提
      }
      data2.selectAddressType = current
      wx.setStorageSync("CREATE_INTENSIVE", data2)
    } else {
      wx.setStorageSync("CREATE_INTENSIVE", { selectAddressType: current })
    }
    this.setData({
      selectAddressType: current,
    })
  },
  overlimit(e) {
    const detail = e.detail
    if (detail === 'minus') {
      Toast('最少购买1件哦');
    }

    if (detail === 'plus') {
      Toast('已达到最大购买数量');
    }
  },

  handleSubmitData(submitData) {
    let goodsInfos = [];
    let len = submitData.length;
    for (let i = 0; i < len; i++) {
      let { spuId, skuId, buyMinNum, activityId, objectId, orderType, goodsFromType, quantity } = submitData[i];
      // let num = buyMinNum > 0 ? buyMinNum : 1;
      let obj = {
        spuId,
        skuId,
        activityId,
        objectId,
        orderType,
        skuNum: quantity,
        goodsFromType,
        isActivityCome: false
      }
      goodsInfos.push(obj)
    }
    return goodsInfos
  },
  showSpec(e) {
    const data = e.currentTarget.dataset.data

    if (!data.isMultiSpec || data.isMultiSpec=='0') {
      return
    }

    this.setData({
      selectSku: data
    }, () => {
      store.onChangeSpecState(true);
    })
  },
  createOrder() {

    if (!this.data.cartAllData.checkedQuantity) {
      Toast('您还没有选择商品喔')
      return;
    }

    let goodsInfos = this.handleSubmitData(this.data.cartGoodsOne);
    let takeSpot = wx.getStorageSync("TAKE_SPOT") || {}

    const {
      selectAddressType,
      storeInfo,
    } = this.data;
    let data = {
      storeGoodsInfos: [{
        storeNo: takeSpot?.storeNo,
        goodsInfos,
      }]
    };
    data.storeAdress = storeInfo.storeAddress;
    data.selectAddressType = selectAddressType;
    let cacheData = wx.getStorageSync("CREATE_INTENSIVE")
    if (cacheData.selectAddressType && cacheData.selectAddressType.type) {
      data.selectAddressType = cacheData.selectAddressType
    }
    wx.setStorageSync("CREATE_INTENSIVE", data);
    let p = {
      orderType: 15,
      activityId: '',
      objectId: this.objectId,
      isActivityCome: false,
    }
    router.push({
      name: "createOrder",
      data: p
    });
  },

  specAdd({ detail }) {
    const selectSku = this.data.selectSku
    if (selectSku.skuId != detail.skuId) {
      selectSku.quantity = 0
      this.setCartNum(selectSku,()=>{
        selectSku.quantity = (selectSku.quantity || 0) + detail.quantity
        selectSku.skuId = detail.skuId
        this.setCartNum(selectSku)
      })
    } else {
      selectSku.quantity = (selectSku.quantity || 0) + detail.quantity
      selectSku.skuId = detail.skuId
      this.setCartNum(selectSku)
    }
  }

})