import create from '../../../utils/create'
import store from '../../../store/good'
import goodApi from '../../../apis/good'
import commonApi from '../../../apis/common'
import homeApi from '../../../apis/home'
import { IMG_CDN, DETAIL_SERVICE_LIST } from '../../../constants/common'
import { CODE_SCENE } from '../../../constants/index'
import { showModal, getStorageUserInfo, showToast, objToParamStr, strToParamObj, haveStore, debounce } from '../../../utils/tools'
import util from '../../../utils/util'
import router from '../../../utils/router'
import commonApis from '../../../apis/common'

const app = getApp();
create.Page(store, {
  goodParams: {},
  // 规格加载完毕
  specLoaded: false,
  fristLoad: false,

  use: [
    "systemInfo",
    // "cartList",
    // "cartListTotal",
    // "goodListTotal",
  ],

  computed: {
    // quantity: ({
    //   options,
    //   store,
    // }) => {
    //   const cartList = store.data.cartList;
    //   const goodId = options.spuId;
    //   let quantity = 0;
    //   cartList.forEach(item => {
    //     if(item.spuId === goodId) {
    //       quantity = item.quantity
    //     }
    //   })
    //   return quantity
    // }
  },

  data: {
    skuId: "",
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
    intensiveUser: [],
    currentSku: {},
    teamDetail: {},
    serviceList: DETAIL_SERVICE_LIST,
    wayIcon: `${IMG_CDN}miniprogram/common/def_choose.png`,
    wayIconSelect: `${IMG_CDN}miniprogram/common/choose.png`,
    intensiveBack: `${IMG_CDN}miniprogram/cart/jiyue_back.png?v=20211126`,
    // buy 立即购买  add 添加到购物车
    specType: "buy",
    refuseText: "",
    secJoinUser: [],
    // 店铺信息
    storeInfo: {},
    shareInfo: "",
    stockOver: 1,
    stockOverText: "",
  },

  onLoad(options) {
    const {
      appScene,
    } = app.globalData;
    // 获取进入小程序场景值
    if(CODE_SCENE[appScene]) {
      if(!options.scene) {
        console.log("未获取到解析参数", options);
        this.hanldeGoodsParams(options)
      } else {
        this.getShareParam(options);
      }
    }else{
      this.hanldeGoodsParams(options)
    }
    let userInfo = getStorageUserInfo();
    if(!!userInfo && !!options.orderType) {
      this.getShareInfo();
    }
  },

  onShow() {
    const {
      orderType,
    } = this.goodParams;
    debounce(() => {
      if(!this.data.good.imageList && !this.data.good.goodsName) {
        this.hanldeGoodsParams(this.goodParams);
      }
    }, 3000)();
    let userInfo = getStorageUserInfo();
    this.setData({
      userInfo,
    })
    app.trackEvent('shopping_detail');
  },

  // 基础数据
  hanldeGoodsParams(options){
    let { systemInfo } = this.store.data;
    let backTopHeight = (systemInfo.navBarHeight - 56) / 2 + systemInfo.statusHeight;
    this.goodParams = options;
    let isActivityGood = 1;
    if(!!options.orderType) isActivityGood = options.orderType;
    this.setData({
      backTopHeight,
      isActivityGood,
      skuId: options.skuId,
    })
    if(options && options.inviteCode) {
      wx.setStorageSync("INVITE_INFO", {
        inviteCode: options.inviteCode,
        shareMemberId: options.shareMemberId,
      });
    }
    if(!options.orderType) {
      showModal({
        content: "商品数据有误",
        showCancel: false,
        ok() {
          router.go();
        },
       });
      return;
    }
    this.getGoodDetail();
    if(options.orderType != 5 && options.orderType != 6) {
      this.getDetailImg();
    }
    if(options.orderType == 3) {
      // this.getTogetherList();
      // 拼成用户列表
      this.getTogetherUser();
    }
  },

  // 获取分享参数
  getShareInfo() {
    const {
      orderType,
      spuId,
      activityId,
    } = this.goodParams;
    this.goodParams.activityId = !!activityId ? activityId : 0;
    const shareParams = {
      shareType: 1,
      contentType: 1,
      shareObjectNo: spuId,
      paramId: 1,
      shareParams: this.goodParams,
      ext: this.goodParams,
      sourceType: 1,
    }
    if(orderType == 3 || orderType == 4) {
      shareParams.paramId = 3;
    }
    homeApi.getShareInfo(shareParams, {
      showLoading: false,
    }, {
      showLoading: false,
    }).then(res => {
      const shareInfo = {
        title: res.title || "约购超值集约！快来体验吧～",
        path: res.shareUrl,
        imageUrl: res.thumbData,
      };
      this.setData({
        shareInfo,
      })
    });
  },

  // 转发
  onShareAppMessage() {
    const {
      good,
      shareInfo,
    } = this.data;
    const {
      orderType,
    } = this.goodParams;
    const pathParam = objToParamStr(this.goodParams);
    let info = {
      title: "约购超值集约！快来体验吧～",
      path: "/subpages/cart/detail/index?",
      imageUrl: good.goodsImageUrl,
    }
    if(orderType == 3 || orderType == 4) {
      info.path = "/subpages/cart/teamDetail/index?";
    }
    if(shareInfo && shareInfo.path) {
      info = {
        ...info,
        ...shareInfo
      }
      info.imageUrl = info.imageUrl ? info.imageUrl : good.goodsImageUrl;
    } else {
      info.path = `${info.path}${pathParam}`;
    }
    app.trackEvent('share_goods_detail', {
      share_type: 'weixin'
    });
    return info;
  },

  // 解析分享配置
  getShareParam(data) {
    commonApis.getShareParam({
      scene: data.scene,
    }).then(res => {
      // const param = strToParamObj(res);
      const param = res;
      this.setData(param)
      this.hanldeGoodsParams(param)
    }).catch(err => {
      this.hanldeGoodsParams(data);
    });
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
      spuId,
    };
    if(!!skuId) {
      params.skuId = skuId;
    }
    let refuseText = "";
    if(!!orderType) {
      params = {
        ...params,
        orderType,
      }
      if(objectId) params.objectId = objectId;
      if(activityId) params.activityId = activityId;
    }
    // 单约详情
    if(orderType == 3) {
      params.spuId = spuId;
      goodApi.getPersonalDetail(params).then(res => {
        const good = res.curGoods;
        const personalList = res.personalList;
        const detailImg = good && good.images || [];
        if(!good.isMultiSpec) {
          this.specLoaded = true;
        }
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
        }, () => {
          this.handleGoodStock();
        })
      })
    // 秒约，C端集约，1688详情
    } else if(orderType == 1) {
      goodApi.getGoodDetail(params).then(res => {
        let good = res;
        let selectAddressType = "";
        let currentSku = {};
        if(!good.isMultiSpec) {
          this.specLoaded = true;
        }
        good.goodsSaleMinPrice = util.divide(good.goodsSaleMinPrice, 100);
        good.goodsMarketPrice = util.divide(good.goodsMarketPrice, 100);
        if(good.sendTypeList) {
          selectAddressType = good.sendTypeList.find(item => item.status == 1);
        }
        if(good.goodsState == 1) {
          if(good.isMultiSpec == 0) {
            currentSku = {
              skuId,
              buyMaxNum: good.buyMaxNum,
              buyMinNum: good.buyMinNum,
              stockNum: good.goodsStockNum,
              skuName: good.skuName,
              skuNum: good.buyMinNum > 1 ? good.buyMinNum : 1,
            };
          }
        }
        good.refuseArea && good.refuseArea.forEach((item, index) => {
          refuseText += `${item.areaName}${index != good.refuseArea.length - 1? '；' : ''}`;
        });
        this.setData({
          currentSku,
          good,
          refuseText,
          selectAddressType,
        }, () => {
          this.handleGoodStock();
        });
      });
    // B端集约
    } else if(orderType == 5 || orderType == 6) {
      this.getBusinessDetail(params);
    // 其他详情
    } else {
      goodApi.getGoodDetailNew(params).then(res => {
        let good = res;
        let selectAddressType = "";
        let currentSku = {};
        let nowTime = new Date().getTime();
        if(!good.isMultiSpec) {
          this.specLoaded = true;
        }
        good.goodsSaleMinPrice = util.divide(good.salePrice, 100);
        good.goodsMarketPrice = util.divide(good.marketPrice, 100);
        if(good.deadlineTime) {
          good.lastTime = good.deadlineTime - nowTime;
          good.lastTime = good.lastTime > 0 ? good.lastTime : 0;
        }
        if(good.sendTypeList) {
          selectAddressType = good.sendTypeList.find(item => item.status == 1);
        }
        if(good.goodsState == 1) {
          if(good.isMultiSpec == 0) {
            currentSku = {
              skuId,
              buyMaxNum: good.buyMaxNum,
              buyMinNum: good.buyMinNum,
              stockNum: good.goodsStockNum,
              skuName: good.skuName,
              skuNum: good.buyMinNum > 1 ? good.buyMinNum : 1,
            };
          }
        }
        good.refuseArea && good.refuseArea.forEach((item, index) => {
          refuseText += `${item.areaName}${index != good.refuseArea.length - 1? '；' : ''}`;
        });
        this.setData({
          currentSku,
          good,
          refuseText,
          selectAddressType,
        }, () => {
          this.handleGoodStock();
        });
        if(orderType == 15 || orderType == 16) {
          // 集约用户列表
          this.getIntensiveUser(good.storeSaleSumNum || 100);
          // 获取商品详情
          const isStore = haveStore(good.storeNo);
          if(isStore) {
            this.getStoreInfo({
              orderType,
              storeNo: good.storeNo,
            });
          }
        }
        if(orderType == 2 || orderType == 11) {
          this.getSecUser();
        }
      });
    }
  },

  // B端详情
  getBusinessDetail(params) {
    goodApi.getBusinessDetail(params).then(res => {
      let good = res;
      good.goodsSaleMinPrice = util.divide(good.salePrice, 100);
      good.goodsMarketPrice = util.divide(good.marketPrice, 100);
      good.lastTime = good.deadlineTime - good.currentTime;
      this.setData({
        good,
        detailImg: good.contentImageList
      })
      // 下单用户轮播
      this.getSecUser(15);
    })
  },

  // 集约获取店铺信息
  getStoreInfo({
    orderType,
    storeNo,
  }) {
    goodApi.getStoreInfo({
      orderType,
      storeNo,
    }).then(res => {
      this.setData({
        storeInfo: res
      })
    });
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

  // 秒约参与用户
  getSecUser(value) {
    let {
      orderType,
    } = this.goodParams
    const {
      good,
    } = this.data;
    goodApi.getIntensiveUser({
      orderType,
      saleNum: value || good.goodsSaleNumVal,
    }, {
      showLoading: false,
    }).then(res => {
      const list = res.records.slice(0, 5);
      this.setData({
        secJoinUser: list
      })
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
    }, {
      showLoading: false
    }).then(res => {
      this.setData({
        togetherUser: res.records
      })
    });
  },

  // 获取参与集约用户列表
  getIntensiveUser(num) {
    let {
      orderType,
    } = this.goodParams
    const {
      good,
    } = this.data;
    goodApi.getIntensiveUser({
      orderType,
      saleNum: good.goodsSaleNumVal,
    }, {
      showLoading: false
    }).then(res => {
      this.setData({
        intensiveUser: res
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

  // 点击跳转比价详情
  onToPriceDetail({
    detail
  }) {
    router.replace({
      name: "priceDetail",
      data: {
        id: detail.contestGoodsId,
      }
    })
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
      good,
      quantity = 0,
      currentSku,
    } = this.data;
    let stockOverData = this.handleGoodStock(currentSku.stockNum);
    if(!this.specLoaded) {
      return;
    }
    if(stockOverData.stockOver != 0) {
      this.onStockOver(stockOverData.stockOver);
      return;
    }
    if(quantity >= currentSku.buyMaxNum) {
      showToast({ title: `最多购买${currentSku.buyMaxNum}件`});
      return;
    }
    if(quantity < currentSku.buyMinNum) {
      quantity = currentSku.buyMinNum;
      // showToast({ title: `至少购买${quantity}件`});
    } else {
      quantity = 1
    }
    let data = {
      skuId: currentSku.skuId,
      quantity,
      orderType: good.orderType,
      goodsFromType: good.goodsFromType,
    }
    if(good.activityId) data.activityId = good.activityId;
    if(good.objectId) data.objectId = good.objectId;
    this.updateCart(data);
  },

  // 减少数量
  reduceCart() {
    let {
      good,
      quantity = 0,
      currentSku,
    } = this.data;
    if(!this.specLoaded) {
      return;
    }
    const minBuy = currentSku.buyMinNum > 1 ? currentSku.buyMinNum : 1;
    if(quantity == minBuy) {
      quantity = -currentSku.buyMinNum;
      showModal({
        content: "您确定要清除该商品？",
        ok: () => {
          this.updateCart({
            skuId: currentSku.skuId,
            quantity,
          })
        }
      });
      return ;
    }
    this.updateCart({
      skuId: currentSku.skuId,
      quantity: -1,
    })
  },

  // 多规格更新购物车数量
  specUpdateCart({
    detail,
  }) {
    this.updateCart(detail, true);
  },

  // 更新购物车数量
  updateCart(data, showMsg = false) {
    this.store.addCart(data, showMsg);
  },

  // 判断是否还有库存
  handleGoodStock() {
    const {
      good,
    } = this.data;
    const {
      orderType
    } = this.goodParams;
    let stockOver = 0;
    let stockOverText = "";
    let nowTime = new Date().getTime();
    let stockNum = good.goodsStockNum;
    if(stockNum <= 0) {
      // 已售罄
      stockOver = 1;
      stockOverText = "已售罄"
    } else {
      // B端集约最小购买量一定是步增的倍数，其他不校验
      if(stockNum < good.buyMinNum) {
        stockOver = 2;
        stockOverText = "库存不足"
      }
    }
    if((orderType == 15 || orderType == 16) && nowTime >= good.deadlineTime) {
      stockOver = 3;
      stockOverText = "活动已结束"
    }
    if(good.goodsState != 1) {
      stockOver = 4;
      stockOverText = "商品已下架"
    }
    let result = {
      stockOver,
      stockOverText
    };
    this.setData(result);
    return result; 
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
      ratioData.AveragePrice = util.divide(ratioData.AveragePrice, 100);
      ratioData.goodsPrice = util.divide(ratioData.goodsPrice, 100);
      this.setData({
        ratioData: res
      })
    });
  },

  // 多规格设置当前sku
  setCurrentSku({ detail }) {
    this.specLoaded = true;
    if(detail.skuId) {
      this.setData({
        currentSku: detail,
      })
      // , () => {
      //   this.handleGoodStock();
      // }
    }
  },

  // 打开选规格弹窗
  openSpecPopup(event) {
    if(!this.data.userInfo) {
      getStorageUserInfo(true);
      return;
    }
    const {
      good,
    } = this.data;
    if(good.goodsState != 1) {
      showToast({ title: "商品已下架" });
      return;
    }
    if(good.isMultiSpec) {
      this.setData({
        specType: "buy",
      }, () => {
        // 打开选择规格弹窗
        store.onChangeSpecState(true);
      });
    } else {
      this.onToCreate()
    }

    // this.setData({
    //   specType: "buy",
    // });
    // // 打开选择规格弹窗
    // store.onChangeSpecState(true);
  },

  // 跳转确认订单
  onToCreate() {
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
      currentSku,
      storeInfo,
    } = this.data;
    let stockOverData = this.handleGoodStock(currentSku.stockNum);
    // 多规格商品，规格时候已加载
    if(!this.specLoaded) {
      return;
    }
    if(stockOverData.stockOver != 0) {
      // this.onStockOver(stockOverData.stockOver);
      return;
    }
    let skuNum = good.buyMinNum > 0 ? good.buyMinNum : 1;
    // 选择规格回来下单
    if(good.isMultiSpec) {
      skuId = currentSku.skuId;
      skuNum = currentSku.skuNum;
    }
    let isActivityCome = false;
    let data = {
      storeGoodsInfos: [{
        storeNo: good.storeNo,
        goodsInfos: [{
          spuId: spuId ? spuId : good.id,
          skuId: skuId ? skuId : currentSku.skuId,
          activityId: activityId || good.activityId || '',
          objectId: objectId || good.objectId || '',
          orderType,
          skuNum,
          goodsFromType: good.goodsFromType,
        }]
      }]
    };
    // 活动购买
    if(orderType == 3) {
      data.objectId = currentSku.groupId;
      objectId = currentSku.groupId;
    }
    if(orderType == 15 || orderType == 16) {
      data.storeAdress = storeInfo.storeAddress;
      data.selectAddressType = selectAddressType;
      wx.setStorageSync("CREATE_INTENSIVE", data);
    } else {
      wx.setStorageSync("GOOD_LIST", data);
    }
    router.push({
      name: "createOrder",
      data: {
        orderType,
        activityId: !!activityId ? activityId : "",
        objectId: !!objectId ? objectId : "",
      }
    });
  },

  // 点击立即采购
  onBIntensive() {
    showModal({
      content: "请下载约购APP完成采购",
      showCancel: false,
    })
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

  // 点击跳转店铺
  onToStore() {
    const {
      good,
    } = this.data;
    let id = good.storeNo.slice(8, good.storeNo.length);
    id = +id;
    if(id < 123580) return;
    router.push({
      name: "store",
      data: {
        storeNo: good.storeNo,
      },
    })
  },

  // 点击跳转店铺
  onToCart() {
    router.goTabbar("cart");
  },

  // 打开不销售区域弹窗
  openAreaPopup() {
    this.setData({
      showAreaPopup: true,
    });
  },

  // 关闭不销售区域弹窗
  onCloseArea() {
    this.setData({
      showAreaPopup: false,
    });
  },

  // 商品已售罄
  onStockOver(state) {
    let {
      stockOver,
      good,
    } = this.data;
    const overType = state !== undefined && typeof state === 'number' ? state : stockOver;
    let errText = !!good.isMultiSpec ? "当前规格" : "商品";
    let errTextAfter = !!good.isMultiSpec ? "，请选择其他规格" : "";
    if(!!good.isMultiSpec) {
      if(overType == 1) {
        showToast({ title: `当前规格已售罄，请选择其他规格` });
      } else if(overType == 2) {
        showToast({ title: `当前规格库存不足，请选择其他规格` });
      } else if(overType == 3) {
        // showToast({ title: `活动已结束` });
      }
    }
  },
})