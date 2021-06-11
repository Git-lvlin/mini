import create from '../../../utils/create'
import store from '../../../store/good'
import goodApi from '../../../apis/good'
import { IMG_CDN } from '../../../constants/common'
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
      const goodId = options.spuId;
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
    userInfo: "",
    userOtherInfo: "",
    timeData: {},
    showTeamPopup: false,
    showTogetherPopup: false,
    isActivityGood: 0,
    personalList: [],
    togetherList: [],
    togetherUser: [],
    teamDetail: {},
    wayIcon: `${IMG_CDN}miniprogram/common/def_choose.png`,
    wayIconSelect: `${IMG_CDN}miniprogram/common/choose.png`,
  },

  onLoad: function (options) {
    let { systemInfo } = this.store.data;
    let backTopHeight = (systemInfo.navBarHeight - 56) / 2 + systemInfo.statusHeight;
    // if (!options.spuId && !!options.id) options.spuId = options.id;
    this.goodParams = options;
    let isActivityGood = 1;
    if(!!options.orderType) isActivityGood = options.orderType;
    this.setData({
      backTopHeight,
      isActivityGood,
    })
    this.getGoodDetail();
    this.getDetailImg();
    if(options.orderType == 3) {
      // this.getTogetherList();
      // 拼成用户列表
      this.getTogetherUser();
    }
    this.getDetailRatio();
  },

  onShow() {
    let userInfo = getStorageUserInfo();
    let userOtherInfo = wx.getStorageSync("USER_OTHER_INFO") || "";
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
      orderType,
      spuId
    } = this.goodParams;
    if(orderType == 3) return; 
    goodApi.getDetailImg({
      spuId,
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
      skuId,
      spuId,
    } = this.goodParams
    let params = {
      id: spuId, 
    };
    if(!!orderType) {
      params = {
        ...params,
        orderType,
      }
      if(objectId) params.objectId = objectId;
      if(activityId) params.activityId = activityId;
    }
    if(orderType == 3) {
      params.spuId = spuId;
      params.skuId = skuId;
      goodApi.getPersonalDetail(params).then(res => {
        const good = res.curGoods;
        const personalList = res.personalList.records;
        const detailImg = good.images;
        good.activityPrice = util.divide(good.activityPrice, 100);
        good.goodsSaleMinPrice = util.divide(good.salePrice, 100);
        good.goodsMarketPrice = util.divide(good.marketPrice, 100);
        // good.goodsSaleNum = good.saleNum;
        good.goodsSaleNum = `月售${good.activitySaleNum}件`;
        good.imageList = good.imageUrlList;
        personalList.forEach(item => {
          item.distancetime = item.distancetime * 1000;
        })
        this.setData({
          personalList,
          good,
          detailImg,
        })
      })
    } else {
      goodApi.getGoodDetail(params).then(res => {
        let good = res;
        let selectAddressType = "";
        good.goodsSaleMinPrice = util.divide(good.goodsSaleMinPrice, 100);
        good.goodsMarketPrice = util.divide(good.goodsMarketPrice, 100);
        if(good.sendTypeList) {
          selectAddressType = good.sendTypeList.find(item => item.status == 1);
        }
        this.setData({
          good,
          selectAddressType,
        })
      });
    }
  },

  // 集约切换配送方式
  onChangePickType({
    currentTarget
  }) {
    const current = currentTarget.dataset.data;
    const {
      good,
    } = this.data;
    good.sendTypeList.forEach(item => {
      if(item.type === current.type) {
        item.status = 1;
      } else {
        item.status = 0;
      }
    });
    this.setData({
      good,
      selectAddressType: current, 
    });
  },

  // 获取拼单列表
  getTogetherList() {
    let {
      activityId,
      objectId,
      orderType,
      skuId,
      spuId,
    } = this.goodParams
    goodApi.getTogetherList({
      activityId,
      spuId,
      skuId,
    }).then(res => {
      this.setData({
        togetherList: res.records
      })
    });
  },

  // 拼成用户列表
  getTogetherUser() {
    let {
      skuId,
      spuId,
    } = this.goodParams
    goodApi.getTogetherUser({
      spuId,
      skuId,
    }).then(res => {
      this.setData({
        togetherUser: res.records
      })
    });
  },

  // 获取拼团详情
  getTeamDetail(data) {
    goodApi.getTeamDetail({
      groupId: data.groupId
    }).then(res => {
      const teamDetail = res;
      teamDetail.distancetime = teamDetail.distancetime * 1000;
      this.setData({
        teamDetail,
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

  // 获取比价信息
  getDetailRatio() {
    const {
      spuId,
      skuId
    } = this.goodParams;
    goodApi.getDetailRatio({
      goodsId: spuId,
      skuId,
    }).then(res => {
      const ratioData = res;
      ratioData.AveragePrice = uitl.divide(ratioData.AveragePrice, 100);
      ratioData.goodsPrice = uitl.divide(ratioData.goodsPrice, 100);
      this.setData({
        ratioData: res
      })
    });
  },

  // 跳转确认订单
  onToCreate(event) {
    if(!this.data.userInfo) {
      getStorageUserInfo(true);
      return;
    }
    let {
      activityId,
      objectId,
      orderType,
      spuId,
      skuId,
    } = this.goodParams;
    const {
      selectAddressType,
      good,
    } = this.data;
    const {
      detail,
      currentTarget,
    } = event;
    // if(!this.data.userOtherInfo.isShopMaster && orderType == 15) {
    //   showToast({ title: "很抱歉，你不店主不能下单"})
    //   return;
    // }
    let isActivityCome = false;
    let data = {
      orderType,
      storeGoodsInfos: [{
        storeNo: good.storeNo,
        goodsInfos: [{
          spuId: spuId ? spuId : good.id,
          skuId: skuId ? skuId : good.defaultSkuId,
          skuNum: 1,
          goodsFromType: good.goodsFromType,
        }]
      }]
    };
    // 点击单独购买
    if(currentTarget && currentTarget.dataset.type === "alone") {
      data.orderType = 1;
      orderType = 1;
      isActivityCome = true;
    } else {
      // 活动购买
      if(!!activityId && activityId != undefined) data.activityId = activityId;
      if(!!objectId && objectId != undefined) data.objectId = objectId;
      if(!!good.objectId) data.objectId = good.objectId;
      if(orderType == 3) {
        data.objectId = detail.groupId;
        objectId = detail.groupId;
      }
      if(orderType == 15) {
        data.storeAdress = good.storeAdress;
        data.selectAddressType = selectAddressType;
      }
    }
    wx.setStorageSync("CREATE_INTENSIVE", data);
    router.push({
      name: "createOrder",
      data: {
        orderType,
        isActivityCome,
        activityId: !!activityId ? activityId : "",
        objectId: !!objectId ? objectId : "",
      }
    });
  },

  // 监听拼团剩余时间
  onChangeTime(e) {
    this.setData({
      timeData: e.detail,
    });
  },

  // 打开拼团弹窗
  onOpenTeam() {
    this.setData({
      showTeamPopup: true
    })
  },

  // 监听关闭拼单弹窗
  handleCloseTeamPopup() {
    this.setData({
      showTeamPopup: false
    })
  },

  // 打开拼单用户弹窗
  onOpenTogether(event) {
    let data = {};
    const {
      currentTarget,
      detail,
      type,
    } = event;
    if(type === "tap") {
      data = currentTarget.dataset.data;
    } else if(type === "toBuy") {
      data = detail;
    }
    this.getTeamDetail(data);
    this.setData({
      showTeamPopup: false,
      showTogetherPopup: true
    })
  },

  // 发起拼单
  onPushTogether() {
    const {
      activityId,
      spuId,
      skuId,
    } = this.goodParams;
    goodApi.pushTogether({
      activityId,
      spuId,
      skuId,
    }).then(res => {
      this.onToCreate({
        detail: {
          groupId: res.groupId,
        },
      });
    });
  },

  // 关闭拼单用户弹窗
  handleCloseTogetherPopup() {
    this.setData({
      showTogetherPopup: false
    })
  },

})