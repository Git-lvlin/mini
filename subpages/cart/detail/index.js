import create from '../../../utils/create'
import store from '../../../store/good'
import goodApi from '../../../apis/good'
import { showModal, showToast, getStorageUserInfo } from '../../../utils/tools'
import util from '../../../utils/util'
import router from '../../../utils/router'

create.Page(store, {
  goodParams: {},

  use: [
    "systemInfo",
    "cartList"
  ],

  computed: {
    quantity: ({
      options,
      store,
    }) => {
      const cartList = store.data.cartList;
      const goodId = options.id;
      let quantity = 0;
      cartList.forEach(item => {
        if(item.spuId === goodId) {
          quantity = item.quantity
        }
      })
      return quantity
    }
  },

  data: {
    good: {},
    stock: 0,
    backTopHeight: 56,
    swiperCurrent: 1,
    showSpec: false,
    detailImg: [],
    isIntensiveGood: false,
    showSettlementBar: false,
    userInfo: "",
    userOtherInfo: "",
  },

  onLoad: function (options) {
    let { systemInfo } = this.store.data;
    let backTopHeight = (systemInfo.navBarHeight - 56) / 2 + systemInfo.statusHeight;
    this.goodParams = options;
    let isIntensiveGood = false;
    if(options.orderType == 15) isIntensiveGood = true;
    let showSettlementBar = !isIntensiveGood;
    this.setData({
      backTopHeight,
      isIntensiveGood,
      showSettlementBar,
    })
    this.getGoodDetail();
    this.getDetailImg();
  },

  onShow() {
    let userInfo = getStorageUserInfo();
    let userOtherInfo = wx.getStorageSync("USER_OTHER_INFO") || "";
    console.log("🚀 ~ onShow ~ userOtherInfo", userOtherInfo)
    this.setData({
      userInfo,
      userOtherInfo,
    })
  },

  onShareAppMessage: function () {

  },

  // 商品详情图片
  getDetailImg() {
    let {
      id
    } = this.goodParams;
    goodApi.getDetailImg({
      spuId: id,
    }).then(res => {
      this.setData({
        detailImg: res.images
      })
    });
  },

  // 商品详情
  getGoodDetail() {
    let {
      activityId,
      objectId,
      orderType,
      id,
    } = this.goodParams
    let params = {
      id, 
    };
    if(orderType == 15) {
      params = {
        ...params,
        activityId,
        objectId,
        orderType,
      }
    }
    goodApi.getGoodDetail(params).then(res => {
      let good = res;
      good.goodsSaleMinPrice = util.divide(good.goodsSaleMinPrice, 100);
      good.goodsMarketPrice = util.divide(good.goodsMarketPrice, 100);
      this.setData({
        good
      })
    });
  },

  // 返回按钮
  onToBack() {
    router.go();
  },

  // 监听swiper当前轮播图
  handleSwiperChange({ detail }) {
    this.setData({
      swiperCurrent: detail.current + 1
    })
  },

  // 增加数量
  addCart() {
    let {
      good
    } = this.data;
    // if(good.isMultiSpec == 1) {
    //   store.onChangeSpecState(true);
    // } else {
      this.updateCart({
        skuId: good.defaultSkuId,
        quantity: 1,
      })
    // }
  },

  // 减少数量
  reduceCart() {
    let {
      good,
      quantity,
    } = this.data;
    if(quantity === 1) {
      showModal({
        content: "您确定要清除该商品？",
        ok: () => {
          this.updateCart({
            skuId: good.defaultSkuId,
            quantity: -1,
          })
        }
      });
      return ;
    }
    this.updateCart({
      skuId: good.defaultSkuId,
      quantity: -1,
    })
  },

  // 更新购物车数量
  updateCart(data, showMsg = false) {
    this.store.addCart(data, showMsg)
  },

  // 跳转确认订单
  onToCreate() {
    console.log("detail data", this.data);
    if(!this.data.userInfo) {
      getStorageUserInfo(true);
      return;
    }
    // if(!this.data.userOtherInfo.isShopMaster) {
    //   showToast({ title: "很抱歉，你不店主不能下单"})
    //   return;
    // }
    let {
      activityId,
      objectId,
      orderType,
    } = this.goodParams;
    let good = this.data.good;
    let data = {
      activityId,
      objectId,
      orderType,
      storeAdress: good.storeAdress,
      storeGoodsInfos: [{
        storeNo: good.storeNo,
        goodsInfos: [{
          spuId: good.id,
          skuId: good.defaultSkuId,
          skuNum: 1,
        }]
      }]
    };
    wx.setStorageSync("CREATE_INTENSIVE", data);
    router.push({
      name: "createOrder",
      data: {
        orderType,
      }
    });
  },

})