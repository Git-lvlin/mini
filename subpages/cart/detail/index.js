import create from '../../../utils/create'
import store from '../../../store/good'
import goodApi from '../../../apis/good'
import homeApi from '../../../apis/home'
import intensiveApi from '../../../apis/intensive'
import { IMG_CDN, DETAIL_SERVICE_LIST, H5_HOST, webHost } from '../../../constants/common'
import { CODE_SCENE } from '../../../constants/index'
import { showModal, getStorageUserInfo, showToast, objToParamStr, strToParamObj, haveStore, debounce, mapNum } from '../../../utils/tools'
import { getPayInfo } from '../../../utils/orderPay'
import util from '../../../utils/util'
import router from '../../../utils/router'
import commonApis from '../../../apis/common'
import cartApi from "../../../apis/cart";
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const shareBack = '../../../images/good/good_share_back.png'
const shareBtn = '../../../images/good/good_share_btn.png'
const defShareText = '约购超值集约！约着买 更便宜~'
const shareBtn_pt = '../../../images/good/btn.png'
const app = getApp();

create.Page(store, {
  goodParams: {},
  // 规格加载完毕
  specLoaded: false,
  fristLoad: false,
  // 商品异常
  goodOver: false,
  recommendPage: {
    hasNext: false,
    next: "",
    size: 20,
  },
  canvasImg: '',
  indexStoreNo: '',
  use: [
    "systemInfo",
    // "cartList",
    // "cartListTotal",
    // "goodListTotal",
  ],

  shareStoreNo: '',
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
    cartAllData: null,
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
    // 是否显示托管协议 1 是  0 否
    escrowAgreement: 0,
    refuseText: "",
    secJoinUser: [],
    // 店铺信息
    storeInfo: {},
    shareInfo: "",
    stockOver: 1,
    stockOverText: "",
    barTap: {
      top: 0,
      evaluate: 0,
      info: 0,
      recommend: 0,
    },
    // 当前滚动高度
    pageScrollTop: 0,
    // 滚动到指定高度
    scrollToTop: 0,
    // 滚动到某个ID
    scrollToId: '',
    recommendList: [],
    paramId: 1,
    indexObjectId: 0,
    shareInfo_pt: '',
    fiveList: [],
    showHasOrderPopup: false,
    hasOrderData: {},
    currentPages: [],
    inviteCode: '',
    // 是否展示购物车 1=是，0=否
    cartBtnIsShow: 0,
    // {name: "上门提货", type: 2, status: 0}
    // {name: "商家配送", type: 3, status: 0}
    selectAddressType: {},
    isCart: '',
    isAlone: '',
    create: '',
    isHome: '',
    selfStoreNo: '',
    objectId: '',
    showDownTips: false,
    showSharePopup: false,
    checked: false
  },

  lifetimes: {
    show: function () {
      this.updateSelectAddressType('lifetimes show ')
    }
  },
  pageLifetimes: {
    show: function () {
      this.updateSelectAddressType('pageLifetimes show ')
    }
  },
  handleUpdate(res) {
    this.getCartList()
    this.updateSelectAddressType('handleUpdate show ')
    // this.getCartList()
  },
  updateSelectAddressType(name) {
    let data = wx.getStorageSync("CREATE_INTENSIVE")
    if (data.selectAddressType && data.selectAddressType.type) {
      this.setData({
        selectAddressType: data.selectAddressType,
      })
    }
    var good = this.data.good
    if (good && good.sendTypeList && this.data.selectAddressType) {
      good.sendTypeList.forEach(item => {
        if (item.type === this.data.selectAddressType.type) {
          item.status = 1;
        } else {
          item.status = 0;
        }
      })
      this.setData({
        good,
      })
    }
  },
  onLoad(options) {
    const {
      appScene,
    } = app.globalData;
    // 获取进入小程序场景值
    if (CODE_SCENE[appScene]) {
      if (!options.scene) {
        console.log("未获取到解析参数", options);
        this.hanldeGoodsParams(options)
        this.saveShareStoreInfo(options)
      } else {
        this.getShareParam(options);
      }
    } else {
      this.hanldeGoodsParams(options)
      this.saveShareStoreInfo(options)
    }

    this.setData({
      currentPages: getCurrentPages().length
    })
    // this.getCartList()

  },

  onShow() {
    const {
      orderType,
    } = this.goodParams;
    if (orderType) {
      this.hanldeGoodsParams(this.goodParams);
    }
    let userInfo = getStorageUserInfo();
    this.setData({
      userInfo,
    })
    this.getStoreNo();
    app.trackEvent('shopping_detail');

    this.updateSelectAddressType('detail onShow ')
  },

  // 跳转到供应商详情页面
  onToSupplier(e) {
    var id = e.currentTarget.dataset.supplierid
    console.log('onToSupplier id ', id)
    wx.navigateTo({
      url: '/pages/supplier/index?id=' + id,
    })
  },

  // 购物车相关
  onCloseCartPopup() {
    this.setData({ showCartPopup: false })
  },
  openCartPopup() {
    this.setData({ showCartPopup: true })
  },

  // 购物车商品列表
  getCartList() {
    let {
      objectId,
      orderType,
      skuId,
      spuId,
    } = this.goodParams
    return new Promise((resolve) => {
      const params = {}
      if (objectId == '-15') {
        params.subType = 151
      }
      cartApi.cartList(params).then((res) => {
        const { good } = this.data;
        let quantity = 0
        good.quantity = 0
        res.forEach(item => {
          if (item.spuId === spuId) {
            good.quantity = item.quantity
            quantity = item.quantity
            good[item.skuId] = item.quantity
          }
        })
        this.setData({
          good,
          quantity
        })
        resolve(res)
      })
    })
  },
  // 增加购物车 for goods
  increaseCart() {
    let { quantity, skuId, good } = this.data
    if (good.goodsStockNum === 0) {
      Toast('商品库存不足')
      return;
    }
    if (good.isMultiSpec === 1) {
      this.setData({
        specType: "add",
      }, () => {
        // 打开选择规格弹窗
        store.onChangeSpecState(true);
      });
      return;
    }
    const { objectId } = good
    if (!quantity) {
      quantity = 0
    }
    const params = {
      skuId,
      objectId,
      quantity: quantity + 1, // 数量，负数表示减数量
    }
    this.setCartNum(params)
  },
  // 减少购物车 for goods
  decreaseCart() {
    var { quantity, skuId, good } = this.data
    const { objectId } = good
    if (good.isMultiSpec === 1) {
      Toast('请到购物车删除商品')
      return;
    }
    quantity -= 1
    const params = {
      skuId,
      objectId,
      quantity: quantity, // 数量，负数表示减数量
    }

    this.setCartNum(params)
      .then(() => {
        const selectSku = this.data.good
        selectSku.quantity = quantity
        this.setData({
          good: selectSku
        })
      })
  },

  // 设置购物车商品数量
  setCartNum(itemInfo) {
    const { quantity, skuId, objectId } = itemInfo;
    const params = {
      skuId: skuId,
      objectId: objectId,
      quantity: quantity, // 数量，负数表示减数量
    }

    if (objectId == '-15') {
      params.subType = 151
    }

    return new Promise((resolve) => {
      cartApi.setCartNum(params).then((res) => {
        console.log('设置购物车商品数量', res)
        if (res.value) {
          this.setData({
            quantity: quantity
          })
        }
        this.getSummaryByCartData(params)
        resolve(1)
      }).catch((err) => {
        resolve()
      })
    })
  },

  // 选中购物车明细
  checkedCart() {
    const { storeNo, } = this.data
    const params = {
      skuId,
      skuStoreNo: storeNo,
      objectId,
    }
    cartApi.checkedCart(params)
  },
  // 全选购物车明细
  checkedAllCart() {
    const { storeNo, } = this.data
    const params = {
      isChecked,
      skuStoreNo: storeNo,
    }
    cartApi.checkedAllCart(params)
  },
  // 购物车商品列表汇总
  getSummaryByCartData(params) {
    // console.log('on cart getSummaryByCartData')
    return new Promise((resolve) => {
      cartApi.summaryByCartData(params).then((res) => {
        resolve(true)
        console.log('on cart getSummaryByCartData ', res)
        this.setData({
          cartAllData: res
        })
      })
    })
  },
  // 清空购物车
  clearCart() {
    const { storeNo } = this.data
    const params = {
      skuStoreNo: storeNo,
    }
    cartApi.clearCart(params)
  },
  // 清空失效商品
  clearExpired() {
    const { storeNo } = this.data
    const params = {
      skuStoreNo: storeNo,
    }
    cartApi.clearExpired(params)
  },
  // 购物车相关 end

  // 基础数据
  hanldeGoodsParams(options) {
    let { systemInfo } = this.store.data;
    let backTopHeight = (systemInfo.navBarHeight - 56) / 2 + systemInfo.statusHeight;
    this.goodParams = options;
    console.log('goodParams', this.goodParams)
    let isActivityGood = 1;
    if (!!options.orderType) isActivityGood = options.orderType;

    this.setData({
      objectId: options.objectId,
      backTopHeight,
      isActivityGood,
      skuId: options.skuId,
      isCart: options.isCart || '',
      isHome: options.isHome || '',
    }, () => {
      // console.log('isActivityGood', isActivityGood)
    })
    if (options && options.shareStoreNo) {
      this.shareStoreNo = options.shareStoreNo
      app.trackEvent('shopping_detail_share', {
        shareStoreNo: options.shareStoreNo
      });
    }
    if (options && options.inviteCode) {
      wx.setStorageSync("INVITE_INFO", {
        inviteCode: options.inviteCode,
        shareMemberId: options.shareMemberId,
      });
    }
    if (!options.orderType) {
      showModal({
        content: "商品数据有误",
        showCancel: false,
        ok() {
          router.go();
        },
      });
      return;
    }
    if (options.shareMemberId && options.shareStoreNo) {
      this.getGoodDetail({
        shareId: options.shareMemberId,
        shareStoreNo: options.shareStoreNo,
      });
    } else {
      this.getGoodDetail();
    }
    if (options.orderType != 5 && options.orderType != 6) {
      this.getDetailImg();
    }
    if (options.orderType == 3) {
      // this.getTogetherList();
      // 拼成用户列表
      this.getTogetherUser();
    }
  },
  clickShare(e) {
    console.log('e', e)
    if (e && e.detail) {
      console.log('e.detail', e.detail, e.detail.groupId)
      this.setData({
        indexObjectId: e.detail.groupId
      })
    }
  },
  bottomClickShare(e) {
    console.log('e', e)
    if (e && e.currentTarget) {
      console.log('indexObjectId', e.currentTarget.dataset.id)
      this.setData({
        indexObjectId: e.currentTarget.dataset.id
      })
    }
  },
  getStoreNo() {
    // console.log('getStoreNo', this.data.userInfo)
    if (!this.data.userInfo) {
      // getStorageUserInfo(true);
      return;
    }

    if (this.data.userInfo.userType === 0) {
      return;
    }

    return new Promise((resolve) => {
      intensiveApi.getStoreNo({ userType: 1 }, { notErrorMsg: true, showLoading: false }).then((res) => {
        // console.log('getStoreNo-res', res)
        this.setData({
          selfStoreNo: res[0].storeNo
        })
        resolve(res[0])
      }).catch(() => {
        resolve({ storeNo: null })
      })
    })

  },

  // 转发
  async onShareAppMessage({ from }) {
    console.log('from', from)
    console.log('点击分享后this.goodParams', this.goodParams)
    console.log('this.data.selfStoreNo', this.data.selfStoreNo)
    let takeSpot = wx.getStorageSync("TAKE_SPOT") || {};
    let { shareStoreNo, ...rest } = this.goodParams
    let all = {};
    if (this.data.selfStoreNo) {
      all = {
        ...rest,
        shareStoreNo: this.data.selfStoreNo,
      }
    } else {
      if (takeSpot.storeNo) {
        all = {
          ...rest,
          shareStoreNo: takeSpot.storeNo
        }
      } else {
        all = {
          ...rest
        }
      }
    }

    console.log('all', all)
    this.goodParams = all
    const {
      good,
      shareInfo,
      shareInfo_pt
    } = this.data;
    const {
      orderType,
    } = this.goodParams;
    const pathParam = objToParamStr(this.goodParams);
    console.log('good.goodsImageUrl', good.goodsImageUrl)
    let info = {
      // title: '',
      title: good && good.goodsName ? good.goodsName : defShareText,
      path: "/subpages/cart/detail/index?",
      imageUrl: good.goodsImageUrl,
      success(res) {
        console.log(res);
      },
    }
    if (orderType == 3 && from == 'button') {
      info.path = "/subpages/cart/teamDetail/index?";
    }
    if (shareInfo && shareInfo.path && shareInfo_pt) {
      console.log('path', shareInfo.path)
      console.log('indexObjectId', this.data.indexObjectId)
      if (from == 'button') {
        shareInfo_pt.path = shareInfo_pt.path.includes('objectId=0') && from == 'button' ? shareInfo_pt.path.replace('objectId=0', `objectId=${this.data.indexObjectId}`) : shareInfo_pt.path
      }
      info = from == 'button' ? {
        ...info,
        ...shareInfo_pt

      } : {
        ...info,
        ...shareInfo
      }
      console.log('...........shareInfo', shareInfo)
      info.title = info.title == defShareText && good && good.goodsName ? good.goodsName : info.title;
      info.imageUrl = info.imageUrl ? info.imageUrl : good.goodsImageUrl;
      console.log('.....info.imageUrl', info.imageUrl)
    } else {
      info.path = `${info.path}${pathParam}`;
    }
    if (!!this.canvasImg) {
      console.log('this.cancasImg', this.canvasImg);
      info.imageUrl = this.canvasImg;
    }
    app.trackEvent('share_goods_detail', {
      share_type: 'weixin'
    });
    console.log('info', info)
    return info;
  },

  saveShareStoreInfo(param) {
    if ((param.orderType == 32 || param.orderType == 34) && param.shareStoreNo) {
      goodApi.getStoreInfo({
        storeNo: param.shareStoreNo,
      }).then(res => {
        if (res.storeAddress) {
          let takeSpot = {
            ...res.storeAddress,
            selected: 1,
            storeNo: param.shareStoreNo,
            storeName: res.storeName,
          }
          const takeSpotOld = wx.getStorageSync("TAKE_SPOT") || {}
          wx.setStorageSync('OLD_TAKE_SPOT', takeSpotOld)
          wx.setStorageSync('TAKE_SPOT', takeSpot)
        }
      });
    }
  },


  // 解析分享配置
  getShareParam(data) {
    commonApis.getShareParam({
      scene: data.scene,
    }).then(res => {
      // const param = strToParamObj(res);
      console.log('解析分享配置', res)
      const param = res;
      this.setData(param)
      this.hanldeGoodsParams(param)

      this.saveShareStoreInfo(param)
    }).catch(err => {
      this.hanldeGoodsParams(data);
    });
  },

  // 监听页面滚动
  handleScrollView({
    detail
  }) {
    // debounce(() => {
    this.setData({
      pageScrollTop: detail.scrollTop
    })
    // }, 200)();
  },

  // 滚动到底部
  handleScrollBottom() {
    const {
      hasNext
    } = this.recommendPage
    if (hasNext) {
      this.getGoodRecommend(true)
    }
  },

  // 监听点击Bar
  handleBarChange({
    detail
  }) {
    // const {
    //   barTap,
    // } = this.data;
    // const {
    //   systemInfo
    // } = this.store.data;
    // let scrollToTop = 0;
    let scrollToId = '';
    // let topHeight = systemInfo.navTotalHeightPx + 36;
    if (detail == 1) {
      // scrollToTop = barTap.top;
      scrollToId = 'detailTop';
    } else if (detail == 2) {
      // scrollToTop = barTap.evaluate - topHeight;
      scrollToId = 'detailEvaluate';
    } else if (detail == 3) {
      // scrollToTop = barTap.info - topHeight;
      scrollToId = 'detailInfo';
    } else if (detail == 4) {
      // scrollToTop = barTap.recommend - topHeight;
      scrollToId = 'detailRecommend';
    }
    this.setData({
      // scrollToTop,
      scrollToId,
    })
  },

  // 商品详情图片
  getDetailImg() {
    let {
      orderType,
      spuId,
      objectId,
    } = this.goodParams;
    if (orderType == 3) return;
    goodApi.getDetailImg({
      spuId,
      objectId,
    }, { showLoading: false }).then(res => {
      this.setData({
        detailImg: res.images
      })
    });
  },

  // 商品详情  30199 商品不存在
  getGoodDetail(options = {}) {
    const that = this
    let {
      activityId,
      objectId,
      orderType,
      skuId,
      spuId,
    } = this.goodParams
    let params = {
      spuId,
      ...options,
    };
    if (!!skuId) {
      params.skuId = skuId;
    }
    let refuseText = "";
    if (!!orderType) {
      params = {
        ...params,
        orderType,
      }
      if (objectId) params.objectId = objectId;
      if (activityId) params.activityId = activityId;
    }
    // 单约详情
    if (orderType == 3) {
      params.spuId = spuId;
      console.log('商品详情请求前传参orderType3', params)
      goodApi.getPersonalDetail(params).then(res => {
        const good = res;
        const personalList = res.personalList;
        const detailImg = good && good.contentImageList || [];
        if (!good.isMultiSpec) {
          this.specLoaded = true;
        }
        good.activityPrice = util.divide(good.activityPrice, 100);
        good.goodsSaleMinPrice = util.divide(good.salePrice, 100);
        good.goodsMarketPrice = util.divide(good.marketPrice, 100);
        good.gcRemark = `${good.gcRemark}`?.match?.(/<body>(.*)<\/body>/)?.[1]
        console.log('good', good)
        // good.goodsSaleNum = good.saleNum;
        good.goodsSaleNum = `月售${good.activitySaleNum}件`;
        personalList.forEach(item => {
          item.distancetime = item.distancetime * 1000;
        })
        let list = personalList.filter((item, index) => index < 5)
        this.setData({
          personalList,
          fiveList: list,
          good,
          detailImg,
        }, () => {
          this.handleGoodStock();
          this.getDetailAfter();
        })
      }).catch(err => {
        console.log('orderType ', orderType, err)
        this.handleGoodError();
      })
      // orderType == 1 详情
    } else if (orderType == 1) {
      console.log('商品详情请求前传参orderType1', params)
      goodApi.getGoodDetail(params).then(res => {
        let good = res;
        let selectAddressType = {};
        let currentSku = {};
        if (!good.isMultiSpec) {
          this.specLoaded = true;
        }
        good.goodsSaleMinPrice = util.divide(good.goodsSaleMinPrice, 100);
        good.goodsMarketPrice = util.divide(good.goodsMarketPrice, 100);
        good.gcRemark = `${good.gcRemark}`?.match?.(/<body>(.*)<\/body>/)?.[1]
        let data = wx.getStorageSync("CREATE_INTENSIVE")
        if (data.selectAddressType && data.selectAddressType.type) {
          selectAddressType = data.selectAddressType
        } else if (good.sendTypeList) {
          selectAddressType = good.sendTypeList.find(item => item.status == 1);
        }
        if (good.sendTypeList) {
          good.sendTypeList.forEach(item => {
            if (item.type === selectAddressType.type) {
              item.status = 1;
            } else {
              item.status = 0;
            }
          })
        }

        if (good.goodsState == 1) {
          if (good.isMultiSpec == 0) {
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
          refuseText += `${item.areaName}${index != good.refuseArea.length - 1 ? '；' : ''}`;
        });
        that.setData({
          currentSku,
          good,
          refuseText,
          selectAddressType,
        }, () => {
          this.handleGoodStock();
          this.getDetailAfter();
        });
      }).catch(err => {
        console.log('orderType ', orderType, err)
        this.handleGoodError();
      });
      // B端集约
    } else if (orderType == 5 || orderType == 6) {
      this.getBusinessDetail(params);
      // 其他详情
    } else {
      console.log('商品详情请求前传参-其它详情', params)
      goodApi.getGoodDetailNew(params, { showLoading: false }).then(res => {
        let good = res;
        let selectAddressType = {};
        let currentSku = {};
        let nowTime = new Date().getTime();
        if (!good.isMultiSpec) {
          this.specLoaded = true;
        }
        good.gcRemark = `${good.gcRemark}`?.match?.(/<body>(.*)<\/body>/)?.[1]
        good.goodsSaleMinPrice = util.divide(good.salePrice, 100);
        good.goodsMarketPrice = util.divide(good.marketPrice, 100);
        if (good.deadlineTime) {
          good.lastTime = good.deadlineTime - nowTime;
          good.lastTime = good.lastTime > 0 ? good.lastTime : 0;
        }

        let data = wx.getStorageSync("CREATE_INTENSIVE")
        if (data.selectAddressType && data.selectAddressType.type) {
          selectAddressType = data.selectAddressType
        } else if (good.sendTypeList) {
          selectAddressType = good.sendTypeList.find(item => item.status == 1);
        }
        if (good.sendTypeList) {
          good.sendTypeList.forEach(item => {
            if (item.type === selectAddressType.type) {
              item.status = 1;
            } else {
              item.status = 0;
            }
          })
        }
        if (good.goodsState == 1) {
          if (good.isMultiSpec == 0) {
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
          refuseText += `${item.areaName}${index != good.refuseArea.length - 1 ? '；' : ''}`;
        });
        that.setData({
          currentSku,
          good,
          refuseText,
          selectAddressType,
        }, () => {
          this.handleGoodStock();
          this.getDetailAfter();
        });
        if (orderType == 15 || orderType == 16) {

          // 集约用户列表
          // this.getIntensiveUser(good.storeSaleSumNum || 100);
          // 获取商品详情
          const isStore = haveStore(good.storeNo);
          console.log('getStoreNo takeSpot change isStore ', isStore)
          if (isStore) {
            this.getStoreInfo({
              orderType,
              storeNo: good.storeNo,
            });
          }
        }
        // if(orderType == 2 || orderType == 11) {
        this.getSecUser();
        // }
      }).catch(err => {
        console.log('orderType ', err)
        this.handleGoodError({
          isOver: !!err.code == 30199
        });
      });
    }
  },

  // B端详情
  getBusinessDetail(params) {
    const that = this
    console.log('b端详情请求参数', params)
    goodApi.getBusinessDetail(params).then(res => {
      let good = res;
      good.goodsSaleMinPrice = util.divide(good.salePrice, 100);
      good.goodsMarketPrice = util.divide(good.marketPrice, 100);
      good.lastTime = good.deadlineTime - good.currentTime;
      good.gcRemark = `${good.gcRemark}`?.match?.(/<body>(.*)<\/body>/)?.[1]
      this.setData({
        good,
        detailImg: good.contentImageList
      }, () => {
        this.getDetailAfter();
      })
      // 下单用户轮播
      this.getSecUser(15);
    }).catch(err => {
      console.log('orderType ', orderType, err)
      this.handleGoodError();
    })
  },

  // 获取商品详情回调
  getDetailAfter() {
    this.setData({
      cartBtnIsShow: this.data.good.cartBtnIsShow,
    })
    const {
      shareInfo,
    } = this.data;
    let {
      orderType,
    } = this.goodParams
    // 推荐商品
    this.getGoodRecommend();
    if (!shareInfo || !shareInfo.path) {
      if (orderType == 3) {
        this.getShareInfo_pt()
      } else {
        this.getShareInfo();
      }
    }
  },

  // 获取分享参数
  getShareInfo() {
    let userInfo = getStorageUserInfo();
    if (!userInfo) {
      this.downShareImg(1);
      return;
    }
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
    homeApi.getShareInfo(shareParams, {
      showLoading: false,
    }, {
      showLoading: false,
    }).then(res => {
      const shareInfo = {
        title: res.title || defShareText,
        path: res.shareUrl,
        imageUrl: res.thumbData,
      };
      this.setData({
        shareInfo,
      }, () => {
        this.downShareImg(1);
      })
    }).catch(err => {
      this.downShareImg(1);
    });
  },

  // 获取分享参数
  getShareInfo_pt() {
    let userInfo = getStorageUserInfo();
    if (!userInfo) {
      this.downShareImg(2);
      return;
    }
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
      paramId: 3,
      shareParams: this.goodParams,
      ext: this.goodParams,
      sourceType: 1,
    }
    homeApi.getShareInfo(shareParams, {
      showLoading: false,
    }, {
      showLoading: false,
    }).then(res => {
      const shareInfo_pt = {
        title: res.title || defShareText,
        path: res.shareUrl,
        imageUrl: res.thumbData,
      };
      this.setData({
        shareInfo_pt,
      }, () => {
        this.downShareImg(2);
      })
    }).catch(err => {
      this.downShareImg(2);
    });
  },

  // 绘制分享图片
  downShareImg(type) {
    const {
      good,
      shareInfo,
    } = this.data;
    const that = this;
    if (!good.goodsImageUrl) {
      good.goodsImageUrl = good.imageUrl
    }
    let img = shareInfo.imageUrl ? shareInfo.imageUrl : good.goodsImageUrl;
    img = img?.replace(/^http:\/\//i, 'https://');
    let tmpImg = '../../../images/good/logo.png';
    console.log('shareInfo', shareInfo)
    console.log('good', good)
    console.log('绘制分享图片img', img)
    wx.downloadFile({
      url: img,
      success(result) {
        console.log("download img", result.tempFilePath)
        that.drawShareImg(result.tempFilePath, type)
      },
      fail(err) {
        that.drawShareImg(tmpImg, type);
      },
    });
  },

  // 拼团绘制分享图片
  drawShareImg_pt(tmpImg) {
    const {
      good,
    } = this.data;
    const that = this;
    const salePrice = '¥' + parseFloat(good.goodsSaleMinPrice).toFixed(2);
    const marketPrice = '¥' + parseFloat(good.goodsMarketPrice).toFixed(2);
    const marketlength = marketPrice.length;
    const textWidth = marketlength * 8;
    const ctx = wx.createCanvasContext('shareCanvas');
    // ctx.setFillStyle('#f5f5f5')
    // ctx.fillRect(0, 0, 250, 200)
    ctx.drawImage(shareBack, 0, 0, 218, 174);
    ctx.drawImage(shareBtn_pt, 140, 104, 66, 28);
    this.handleBorderRect(ctx, 10, 43, 120, 120, 8, tmpImg);
    ctx.setTextAlign('center')
    ctx.setFillStyle('#DC2D23')
    ctx.setFontSize(17)
    ctx.fillText(salePrice, 171, 70)
    ctx.setFillStyle('#999999')
    ctx.setFontSize(14)
    ctx.fillText(marketPrice, 171, 92)
    ctx.setStrokeStyle('#999999')
    ctx.beginPath();
    ctx.moveTo(172 - textWidth / 2, 87)
    ctx.lineTo(170 + textWidth / 2, 87)
    ctx.closePath();
    ctx.stroke()
    // ctx.strokeRect(171-(textWidth/2), 87, textWidth, 0)
    ctx.draw(true, () => {
      wx.canvasToTempFilePath({
        // destWidth: 436,
        // destHeight: 348,
        canvasId: 'shareCanvas',
        success(res) {
          that.canvasImg = res.tempFilePath;
        }
      })
    });
  },

  // 绘制分享图片
  drawShareImg(tmpImg, type) {
    const {
      good,
    } = this.data;
    if (type === 2) {
      this.drawShareImg_pt(tmpImg)
      return
    }
    const that = this;
    const salePrice = '¥' + parseFloat(good.goodsSaleMinPrice).toFixed(2);
    const marketPrice = '¥' + parseFloat(good.goodsMarketPrice).toFixed(2);
    const marketlength = marketPrice.length;
    const textWidth = marketlength * 8;
    const ctx = wx.createCanvasContext('shareCanvas');
    // ctx.setFillStyle('#f5f5f5')
    // ctx.fillRect(0, 0, 250, 200)
    ctx.drawImage(shareBack, 0, 0, 218, 174);
    ctx.drawImage(shareBtn, 150, 104, 48, 48);
    this.handleBorderRect(ctx, 10, 43, 120, 120, 8, tmpImg);
    ctx.setTextAlign('center')
    ctx.setFillStyle('#DC2D23')
    ctx.setFontSize(17)
    if (good.orderType != 30 && good.orderType != 5) {
      ctx.fillText(salePrice, 171, 70)
      ctx.setFillStyle('#999999')
      ctx.setFontSize(14)
      ctx.fillText(marketPrice, 171, 92)
      ctx.setStrokeStyle('#999999')
      ctx.beginPath();
      ctx.moveTo(172 - textWidth / 2, 87)
      ctx.lineTo(170 + textWidth / 2, 87)
      ctx.closePath();
      ctx.stroke()
    }
    // ctx.strokeRect(171-(textWidth/2), 87, textWidth, 0)
    ctx.draw(true, () => {
      wx.canvasToTempFilePath({
        // destWidth: 436,
        // destHeight: 348,
        canvasId: 'shareCanvas',
        success(res) {
          that.canvasImg = res.tempFilePath;
        }
      })
    });
  },

  handleBorderRect(ctx, x, y, w, h, r, img, color) {
    ctx.save();
    ctx.beginPath();
    // 左上角
    ctx.arc(x + r, y + r, r, Math.PI, 1.5 * Math.PI);
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.lineTo(x + w, y + r);
    // 右上角
    ctx.arc(x + w - r, y + r, r, 1.5 * Math.PI, 2 * Math.PI);
    ctx.lineTo(x + w, y + h - r);
    ctx.lineTo(x + w - r, y + h);
    // 右下角
    ctx.arc(x + w - r, y + h - r, r, 0, 0.5 * Math.PI);
    ctx.lineTo(x + r, y + h);
    ctx.lineTo(x, y + h - r);
    // 左下角
    ctx.arc(x + r, y + h - r, r, 0.5 * Math.PI, Math.PI);
    ctx.lineTo(x, y + r);
    ctx.lineTo(x + r, y);

    // ctx.setFillStyle(color);
    // ctx.fill();
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, x, y, w, h);
    ctx.restore()
  },

  // 获取商品推荐
  getGoodRecommend(isNext) {
    var that = this
    var next = ""
    var size = 20
    if (this.recommendPage && this.recommendPage.next) {
      next = this.recommendPage.next
    }
    if (this.recommendPage && this.recommendPage.size) {
      size = this.recommendPage.size
    }
    let {
      recommendList
    } = this.data;
    goodApi.getUserLike({
      next,
      size,
    }, { showLoading: false }).then(res => {
      if (that.recommendPage && that.recommendPage.hasOwnProperty('hasNext')) {
        that.recommendPage.hasNext = res.hasOwnProperty('hasNext') ? res.hasNext : false;
      } else {
        that.recommendPage = { hasNext: false, next: "" };
      }
      that.recommendPage.next = res.hasOwnProperty('next') ? res.next : '';
      const list = res.records;
      list.forEach(item => {
        item.title = item.goodsName;
        item.salePrice = util.divide(item.goodsSaleMinPrice, 100);
        item.marketPrice = util.divide(item.goodsMarketPrice, 100);
        item.image = item.goodsImageUrl;
        item.spuId = item.id;
        item.skuId = item.defaultSkuId;
      })
      if (isNext) {
        recommendList = recommendList.concat(list);
      } else {
        recommendList = list
      }
      this.setData({
        recommendList
      });
      // 获取nav个点高度
      debounce(() => {
        this.getNavTapHeight();
      }, 700)();
    });
  },

  getNavTapHeight() {
    const {
      barTap
    } = this.data;
    let query = wx.createSelectorQuery();
    query.select('#detailTop').boundingClientRect()
    query.select('#detailInfo').boundingClientRect()
    query.select('#detailRecommend').boundingClientRect()
    query.select('#detailEvaluate').boundingClientRect()
    // debounce(() => {
    query.selectViewport().scrollOffset().exec(res => {
      barTap.top = res[0].top;
      barTap.info = res[1].top;
      barTap.recommend = res[2].top;
      barTap.evaluate = res?.[3]?.top;
      this.setData({
        barTap,
      });
    });
    // }, 1000)();
  },

  // 商详报错处理
  handleGoodError({
    isOver
  }) {
    if (isOver) {
      this.setData({
        stockOver: 1,
        stockOverText: "商品已售罄"
      })
    }
    this.goodOver = true;
    let timer = setTimeout(() => {
      clearTimeout(timer);
      router.go();
    }, 1500);
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
      console.log("getStoreNo takeSpot getStoreInfo", res)
      if (res.storeAddress) {
        let takeSpot = {
          selected: 1,
          storeNo: storeNo,
          storeName: res.storeName,
          address: res.storeAddress.fullAddress,
          longitude: res.storeAddress.longitude,
          latitude: res.storeAddress.latitude,
        }
        const takeSpotOld = wx.getStorageSync("TAKE_SPOT") || {}
        wx.setStorageSync('OLD_TAKE_SPOT', takeSpotOld)
        wx.setStorageSync('TAKE_SPOT', takeSpot)
      }
      this.setData({
        storeInfo: res
      })
      this.getCartList();
      let {
        objectId,
      } = this.goodParams
      const params = {}
      if (objectId == '-15') {
        params.subType = 151
      }
      this.getSummaryByCartData(params)
    });
  },

  // 集约切换配送方式
  onChangePickType({
    currentTarget
  }) {
    const current = currentTarget.dataset.data;
    console.log('onChangePickType ', current);
    const {
      good,
    } = this.data;
    good.sendTypeList.forEach(item => {
      if (item.type === current.type) {
        item.status = 1;
      } else {
        item.status = 0;
      }
    });
    let data2 = wx.getStorageSync("CREATE_INTENSIVE")
    if (data2) {
      data2.selectAddressType = current
      wx.setStorageSync("CREATE_INTENSIVE", data2)
    } else {
      wx.setStorageSync("CREATE_INTENSIVE", { selectAddressType: current })
    }
    console.log('onChangePickType selectAddressType cg', wx.getStorageSync("CREATE_INTENSIVE").selectAddressType)
    this.setData({
      good,
      selectAddressType: current,
    });
  },

  // 秒约参与用户
  getSecUser(value) {
    let {
      orderType,
      spuId,
      objectId,
      activityId,
      skuId,
    } = this.goodParams
    const {
      good,
    } = this.data;
    goodApi.getIntensiveUser({
      orderType,
      saleNum: value || good.goodsSaleNumVal,
      spuId,
      objectId,
      activityId,
      skuId,
    }, {
      showLoading: false,
    }).then(res => {
      let list = res.records;
      // list = list && list.length ? list.slice(0, 5) : [];
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
      spuId,
      objectId,
      activityId,
      skuId,
    } = this.goodParams
    const {
      good,
    } = this.data;
    goodApi.getIntensiveUser({
      orderType,
      saleNum: good.goodsSaleNumVal,
      spuId,
      objectId,
      activityId,
      skuId,
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
    if (!this.specLoaded) {
      return;
    }
    if (stockOverData.stockOver != 0) {
      this.onStockOver(stockOverData.stockOver);
      return;
    }
    if (quantity >= currentSku.buyMaxNum) {
      showToast({ title: `最多购买${currentSku.buyMaxNum}件` });
      return;
    }
    if (quantity < currentSku.buyMinNum) {
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
    if (good.activityId) data.activityId = good.activityId;
    if (good.objectId) data.objectId = good.objectId;
    this.updateCart(data);
  },

  // 减少数量
  reduceCart() {
    let {
      good,
      quantity = 0,
      currentSku,
    } = this.data;
    if (!this.specLoaded) {
      return;
    }
    const minBuy = currentSku.buyMinNum > 1 ? currentSku.buyMinNum : 1;
    if (quantity == minBuy) {
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
      return;
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
      orderType,
      objectId,
    } = this.goodParams;
    let stockOver = 0;
    let stockOverText = "";
    let nowTime = new Date().getTime();
    let stockNum = good.goodsStockNum;
    if (stockNum <= 0) {
      // 已售罄
      stockOver = 1;
      stockOverText = "已售罄"
    } else {
      // B端集约最小购买量一定是步增的倍数，其他不校验
      if (stockNum < good.buyMinNum) {
        stockOver = 2;
        stockOverText = "库存不足"
      }
    }
    if ((orderType == 15 || orderType == 16) && objectId != '-15' && nowTime >= good.deadlineTime) {
      stockOver = 3;
      stockOverText = "活动已结束"
    }
    if (good.goodsState != 1) {
      // 商品已下架 改为 已售罄
      stockOver = 4;
      stockOverText = "商品已售罄"
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
    console.log("checkSpec setCurrentSku detail", this.goodParams.skuId != detail.skuId, detail, '; this.goodParams ', this.goodParams)
    if (detail.skuId) {
      this.setData({
        currentSku: detail,
      })
      if (this.goodParams && this.goodParams.skuId != detail.skuId) {
        this.goodParams.skuId = detail.skuId
        this.hanldeGoodsParams(this.goodParams)
      }
      // , () => {
      //   this.handleGoodStock();
      // }
    }
  },

  // 打开选规格弹窗
  openSpecPopup(e) {
    const {
      good,
      checked
    } = this.data;

    // if (good.entrustInfoNew&&good.entrustInfoNew.length&&!checked) {
    //     showToast({ title: "请勾选阅读并同意《约购平台服务合作协议》" });
    //     return;
    //   }

    if (!this.data.userInfo) {
      getStorageUserInfo(true);
      return;
    }

    if (good.orderType == 30) {
      this.setData({
        showDownTips: true
      })
      return;
    }

    if (good.goodsState != 1) {
      // 商品已下架 改为 已售罄
      showToast({ title: "商品已售罄" });
      return;
    }
    // 单规格拼团购买
    if (!good.isMultiSpec && e?.currentTarget?.dataset?.type == 'create') {
      this.onPushTogether()
      return
    }
    // 单规格单独购买
    if (!good.isMultiSpec && e?.currentTarget?.dataset?.type == 'alone') {
      this.onToCreateOne()
      return
    }
    if (good.isMultiSpec) {
      this.setData({
        specType: "buy",
        isActivityCome: this.goodParams.orderType == 3 ? true : false,
        isAlone: (e?.currentTarget?.dataset?.type === 'alone') ? 1 : '',
        create: (e?.currentTarget?.dataset?.type === 'create') ? 1 : '',
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

  // 拼团单独购买
  onToCreateOne() {
    let isActivityCome = true;
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
      personalList,
    } = this.data;
    let skuNum = good.buyMinNum > 0 ? good.buyMinNum : 1;
    let data = {
      storeGoodsInfos: [{
        storeNo: good.storeNo,
        goodsInfos: [{
          spuId: spuId ? spuId : good.id,
          skuId: skuId ? skuId : currentSku.skuId,
          activityId: activityId || good.activityId || '',
          objectId: objectId || good.objectId || '',
          orderType: isActivityCome ? 2 : orderType,
          skuNum,
          goodsFromType: good.goodsFromType,
          isActivityCome: isActivityCome
        }]
      }]
    };
    wx.setStorageSync("GOOD_LIST", data);
    let p = {
      orderType: isActivityCome ? 2 : orderType,
      activityId: !!activityId ? activityId : "",
      objectId: !!objectId ? objectId : this.goodParams.objectId,
      isActivityCome: isActivityCome,
    }
    if (this.shareStoreNo) {
      p.shareStoreNo = this.shareStoreNo
    }
    router.push({
      name: "createOrder",
      data: p
    });
  },

  // 跳转确认订单
  async onToCreate(e) {
    console.log('selectAddressType e', e)
    if (!this.data.userInfo) {
      getStorageUserInfo(true);
      return;
    }


    let outData = {}
    if (e && e.detail) {
      outData = e.detail
    }
    let isActivityCome = false;
    if (e?.currentTarget?.dataset?.type === 'alone') {
      isActivityCome = true
    }
    if (e?.detail?.isAlone) {
      isActivityCome = true
    }
    if (e?.detail?.create || e?.currentTarget?.dataset?.type) {
      this.onPushTogether()
      return
    }
    let {
      activityId,
      objectId,
      orderType,
      spuId,
      skuId,
      shareStoreNo,
    } = this.goodParams;
    const {
      selectAddressType,
      good,
      currentSku,
      storeInfo,
      personalList,
      checked,
    } = this.data;


    if (good.entrustInfoNew && good.entrustInfoNew.length && !checked) {
      showToast({ title: "请勾选阅读并同意《约购平台服务合作协议》" });
      return;
    }

    // let stockOverData = this.handleGoodStock(currentSku.stockNum);
    // 多规格商品，规格时候已加载
    if (!this.specLoaded) {
      return;
    }
    // if(stockOverData.stockOver != 0) {
    //   // this.onStockOver(stockOverData.stockOver);
    //   return;
    // }
    let skuNum = good.buyMinNum > 0 ? good.buyMinNum : 1;
    // 选择规格回来下单
    if (good.isMultiSpec) {
      skuId = currentSku.skuId;
      skuNum = currentSku.skuNum;
    }


    let data = {
      storeGoodsInfos: [{
        storeNo: good.storeNo,
        goodsInfos: [{
          spuId: spuId ? spuId : good.id,
          skuId: skuId ? skuId : currentSku.skuId,
          activityId: activityId || good.activityId || '',
          objectId: objectId || good.objectId || '',
          orderType: isActivityCome ? 2 : orderType,
          skuNum,
          goodsFromType: good.goodsFromType,
          isActivityCome: isActivityCome,
          shareStoreNo
        }]
      }]
    };

    // 活动购买
    if (orderType == 3 && outData.groupId && !isActivityCome) {
      let params = {
        storeGoodsInfos: [{
          storeNo: good.storeNo,
          goodsInfos: [{
            spuId: spuId ? spuId : good.id,
            skuId: skuId ? skuId : currentSku.skuId,
            activityId: activityId || good.activityId || '',
            objectId: outData.groupId,
            orderType,
            skuNum,
            groupId: outData.groupId,
            goodsFromType: good.goodsFromType,
            isActivityCome: isActivityCome,
            shareStoreNo
          }]
        }]
      };
      console.log('参团', params)
      wx.setStorageSync("CREATE_INTENSIVE", params);
    }

    // 多规格拼团
    if (orderType == 3 && outData?.skuId && outData?.skuNum && !isActivityCome) {
      let params = {
        storeGoodsInfos: [{
          storeNo: good.storeNo,
          goodsInfos: [{
            spuId: spuId ? spuId : good.id,
            skuId: outData.skuId,
            activityId: activityId || good.activityId || '',
            objectId: outData.objectId,
            orderType,
            skuNum: outData.skuNum,
            goodsFromType: good.goodsFromType,
            isActivityCome: isActivityCome,
            shareStoreNo
          }]
        }]
      };
      console.log('多规格拼团', params)
      wx.setStorageSync("CREATE_INTENSIVE", params);
    }

    if (orderType == 15 || orderType == 16) {
      data.storeAdress = storeInfo.storeAddress;
      data.selectAddressType = selectAddressType;
      console.log('15/16 selectAddressType', data)
      wx.setStorageSync("CREATE_INTENSIVE", data);
    } else {
      console.log('其它', data)
      wx.setStorageSync("GOOD_LIST", data);
    }
    let escrowAgreement = e?.detail?.escrowAgreement
    console.log('selectAddressType e ', escrowAgreement)
    let p = {
      orderType: isActivityCome ? 2 : orderType,
      activityId: !!activityId ? activityId : "",
      objectId: !!objectId ? objectId : this.goodParams.objectId,
      isActivityCome: isActivityCome,
      isEscrow: escrowAgreement,
    }
    if (this.shareStoreNo) {
      p.shareStoreNo = this.shareStoreNo
    }

    if (this.goodParams.shareMemberId) {
      p.shareMemberId = this.goodParams.shareMemberId
    }
    console.log('111', p)
    // return
    router.push({
      name: "createOrder",
      data: p
    });
  },

  // 点击立即采购
  onBIntensive() {
    // showModal({
    //   content: "请下载约购APP完成采购",
    //   showCancel: false,
    // })
    this.setData({
      showDownTips: true
    })
  },

  // 监听拼团剩余时间
  onChangeTime(e) {
    console.log('onChangeTime ', e)
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

  // 跳转拼团规则
  onOpenRule() {
    let ENV = wx.getStorageSync("SYS_ENV");
    console.log('ENV', ENV)
    console.log('H5_HOST', H5_HOST)
    console.log('src', webHost[ENV])
    let src = webHost[ENV]
    const { activityId, spuId, skuId } = this.data.good;
    const str = `/web/group-rule?activityId=${activityId}&spuId=${spuId}&skuId=${skuId}`;
    const url = src + str;
    console.log('url', url)
    router.getUrlRoute(url);
    // router.push({
    //   name: "webview",
    //   data: {
    //     url: encodeURIComponent(url),
    //   },
    // })
  },

  // 监听关闭拼单弹窗
  handleCloseTeamPopup() {
    this.setData({
      showTeamPopup: false
    })
  },

  cancel() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定取消订单吗?',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定', that)
          that.cancelOrder()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  cancelOrder() {
    const { hasOrderData } = this.data;
    let params = {
      sumId: hasOrderData.id
    }
    console.log('确认取消订单-params', params)
    goodApi.cancelOrder(params)
    this.onCloseHasOrder()
  },
  hasOrderPay() {
    this.onCloseHasOrder()
    const params = {
      ...this.data.hasOrderData
    }
    router.replace({
      name: "cashier",
      data: params,
    })
  },

  getHasOrder(type) {
    const {
      spuId,
      skuId,
    } = this.goodParams;
    return new Promise((resolve) => {
      const params = {
        checkType: type,
        spuId,
        skuId,
      }
      goodApi.getHasOrderInfo(params).then((res) => {
        console.log('getHasOrderInfo-res', res)
        if (!res.id) {
          resolve(true)
        } else {
          this.setData({
            hasOrderData: res
          }, () => {
            this.openHasOrder()
          })
        }
      })
    })
  },
  // 打开拼单用户弹窗
  async onOpenTogether(event) {
    let data = {};
    const {
      currentTarget,
      detail,
      type,
    } = event;
    if (type === "tap") {
      data = currentTarget.dataset.data;
    } else if (type === "toBuy") {
      data = detail;
    }
    await this.getHasOrder(2)
    this.getTeamDetail(data);
    this.setData({
      showTeamPopup: false,
      showTogetherPopup: true
    })
  },

  // 发起拼单
  async onPushTogether() {
    const {
      activityId,
      spuId,
      skuId,
    } = this.goodParams;
    await this.getHasOrder(1)
    goodApi.pushTogether({
      activityId,
      spuId,
      skuId,
    }).then(res => {
      this.onToCreate({
        detail: {
          groupId: res.groupId
        }
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
    if (id < 123580) return;
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

  // 关闭待支付拼团弹窗
  onCloseHasOrder() {
    this.setData({
      showHasOrderPopup: false,
    });
  },

  // 打开待支付拼团弹窗
  openHasOrder() {
    this.setData({
      showHasOrderPopup: true,
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
    if (!!good.isMultiSpec) {
      if (overType == 1) {
        showToast({ title: `当前规格已售罄，请选择其他规格` });
      } else if (overType == 2) {
        showToast({ title: `当前规格库存不足，请选择其他规格` });
      } else if (overType == 3) {
        // showToast({ title: `活动已结束` });
      }
    }
  },
  specAdd({ detail }) {
    this.setData({
      currentSku: detail,
    })
    const selectSku = this.data.good
    selectSku.quantity = (selectSku[detail.skuId] ? selectSku[detail.skuId] : 0) + detail.quantity
    selectSku.skuId = detail.skuId
    this.setCartNum(selectSku)
      .then(res => {
        selectSku[detail.skuId] = selectSku.quantity
        this.setData({
          good: selectSku
        });
      })
  },
  showDownTipsClose() {
    this.setData({
      showDownTips: false,
    })
  },
  downTips() {
    this.showDownTipsClose()
    this.showSharePopup()
  },
  showSharePopup() {
    this.setData({
      showSharePopup: true,
    })
  },
  onHideSharePopup() {
    this.setData({
      showSharePopup: false,
    })
  },
  toCartList() {
    router.push({
      name: "cartList",
      data: {
        objectId: this.goodParams.objectId
      }
    });
  },
  toWebView2(e) {
    const data = e.currentTarget.dataset.data
    if (data.isJump === 1) {
      router.push({ name: 'webview', data: { url: encodeURIComponent(data.jumpUrl), encode: true } })
    }
  },
  //阅读并同意
  onChangeAgreement(e) {
    console.log('e', e)
    this.setData({
      checked: e.detail
    })
  },
  toWebView(e) {
    const url = e.currentTarget.dataset.url
    router.push({ name: 'webview', data: { url: encodeURIComponent(url), encode: true } })
  },
})
