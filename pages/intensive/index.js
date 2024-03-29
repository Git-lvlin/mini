import create from '../../utils/create'
import store from '../../store/good'
import router from '../../utils/router'
import homeApi from '../../apis/home'
import intensiveApi from '../../apis/intensive'
import commonApi from '../../apis/common'
import { IMG_CDN } from '../../constants/common'
import { showModal, showToast } from '../../utils/tools'
import { checkSetting } from '../../utils/wxSetting';
import { HTTP_TIMEOUT } from '../../constants/index';
import goodApi from "../../apis/good";
import cartApi from "../../apis/cart";
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
const app = getApp();
create.Page(store, {
  floorTimer: null,
  touchTimer: null,
  onTimeTimer: null,
  isScroll: false,
  scrollLock: false,
  isFristLoad: true,
  floorTime: new Date().getTime(),
  isMiniExamine: false, // true 2 代表小程序审核版本, false 3 代表小程序正试版本
  // 是否是点击设置滚动高度
  isSetScroll: false,
  tabActiveArrOri: [0, 1, 2, 3, 4],

  use: [
    "userInfo",
    "systemInfo"
  ],

  data: {
    cartAllData: null,
    cartAllData3: null,
    fixationTop: 600,
    isOnGoods: false,
    scrolling: false,
    scrollBottom: false,
    floor: {},
    activityAdvert: {},
    locationAuth: false,
    takeSpot: {},
    topSearchHeight: 0,
    showLoadImg: false,
    refresherTriggered: false,
    scrollTop: 0,
    leaveTop: 0,
    scrollToTop: 0,
    //导航栏初始化距顶部的距离
    classGoodToTop: 0,
    leaveTopL: 0,
    //是否固定顶部
    isFixedTop: false,
    bannerData: {},
    intensiveData: null,
    remindData: [],
    recommendData: [],
    goodsData2: [],
    goodsData3: [],
    goodsData4: [],
    goodsData5: [],
    // storeNo: 'store_m_123942', // 测试用店铺号
    storeNo: '', // 测试用店铺号
    classData: null,
    classData2: [],
    goodsData: null,
    tabIndexId: 0,
    tabIndexId2: 0,
    tabIndexId3: 0,
    goodsNum: 0,
    value: 0,
    showCartPopup: false,
    tabActive: 1,
    height1: 500,
    height2: 500,
    wholesaleStatus: [],
    tabActiveArr: [0, 1, 2, 3, 4],
    selectSku: null,
    showModalFlag: true,
    invalidList: [
      {
        name: 'dasdasdasd',
        price: 11111,
        value: 0,
      },
      {
        name: 'dasdasdasd',
        price: 11111,
        value: 0,
      },
    ],
    cartList: [],
    hasClass: false,
    hasClass3: false,
  },

  onLoad(options) {

  },

  onReady() {
    let query = wx.createSelectorQuery();
    const {
      systemInfo,
    } = this.store.data;
    query.select('#fixation').boundingClientRect((rect) => {
      if (rect) {
        this.setData({
          fixationTop: rect.top,
        })
      }
    }).exec();
    this.getLocationAuth(this);
    query.select('#top_search').boundingClientRect((rect) => {
      if (rect) {
        this.setData({
          topSearchHeight: rect.height,
          navigationBarHeight: systemInfo.navBarHeight + (systemInfo.rpxRatio * rect.height)
        })
      }
    }).exec();
  },

  onShow() {
    const takeSpotOld = wx.getStorageSync("OLD_TAKE_SPOT");
    if (takeSpotOld) {
      wx.setStorageSync("TAKE_SPOT", takeSpotOld);
      wx.removeStorageSync('OLD_TAKE_SPOT')
    }
    let takeSpot = wx.getStorageSync("TAKE_SPOT");
    console.log('takeSpot', takeSpot)
    if (takeSpot.storeNo !== this.data.storeNo) {
      this.setData({
        takeSpot,
        storeNo: takeSpot.storeNo,
        tabIndexId: 0,
        tabIndexId2: 0
      });
    }

    // 更新tabbar显示
    router.updateSelectTabbar(this, 2);
    app.trackEvent('tab_intensive');
    // this.getMiniExamine();
    const timer = setTimeout(() => {
      clearTimeout(timer);
      this.setData({
        showLoadImg: true
      });
    });
    if (takeSpot) {
      this.init()
    } else if (this.data.showModalFlag) {
      showModal({
        content: '请选择自提点',
        confirmText: '去选择',
        ok: () => {
          this.setData({
            showModalFlag: false,
          })
          this.onToLocation()
        }
      })
    }
  },

  // 初始化
  init(id = '') {
    Promise.all([this.getAllGoodsList(this.data.tabIndexId), this.getGoodsCategory(), this.getBannerData()]).then((res) => {
      this.setData({
        refresherTriggered: false,
      })
    })

    this.tabActiveArrOri = [0, 1, 2, 3, 4]

    this.shopIndexCategory()
    this.getAllGoodsList2(this.data.tabIndexId2)
    this.getWholesaleStatus()

    this.getAllGoodsList3(this.data.tabIndexId3);
    this.getGoodsCategory3()

    this.getAllGoodsList4();
    this.getAllGoodsList5();
    this.selectComponent('#tabs').resize()
  },

  getWholesaleStatus() {
    intensiveApi.getWholesaleStatus({}, { showLoading: false })
      .then(res => {
        const arr = [];
        let index = 0
        res.forEach((item, i) => {
          arr.push(item.id)

          if (item.defaultSelected) {
            index = i
          }
        })
        this.setData({
          wholesaleStatus: arr,
          // tabActive: index,
        })
      })
  },

  onCloseCartPopup() {
    this.setData({ showCartPopup: false })
  },
  openCartPopup() {
    this.setData({ showCartPopup: true })
  },
  // 设置购物车明细
  addCart() {
    const { storeNo, } = this.data
    const params = {
      quantity, // 数量，负数表示减数量
      skuId,
      orderType,
      objectId,
      activityId,
      skuStoreNo: storeNo
    }
    cartApi.addCartInfo(params)
  },
  // 移除购物车明细
  removeCart() {
    const { storeNo, } = this.data
    const params = {
      objectIds, // 业务id数组
      skuIds, // 商品skuid数组
      skuStoreNo: storeNo
    }
    cartApi.removeCart(params)
  },
  // 设置购物车商品数量
  setCartNum(itemInfo) {
    const { value, skuId, objectId } = itemInfo;
    console.log('itemInfo', itemInfo)
    const params = {
      skuId: skuId,
      objectId: objectId,
      quantity: value,
      subType: 151
    }
    if (itemInfo.objectId != '-15') {
      delete params.subType
    }
    return new Promise((resolve) => {
      cartApi.setCartNum(params).then((res) => {
        console.log('设置购物车商品数量', res)
        if (itemInfo.objectId != '-15') {
          this.getAllGoodsList()
        } else {
          this.getAllGoodsList3()
        }
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
    return new Promise((resolve) => {
      cartApi.summaryByCartData(params, { showLoading: false }).then((res) => {
        resolve(true)
        if (params?.subType) {
          this.setData({
            cartAllData3: {
              ...res,
              checkedSkuQuantity: params.length,
            }
          })
        } else {
          this.setData({
            cartAllData: {
              ...res,
              checkedSkuQuantity: params.length,
            }
          })
        }
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

  onGood2({
    currentTarget
  }) {
    let {
      spuId,
      skuId,
      activityId,
      objectId,
      orderType,
    } = currentTarget.dataset.data;
    const { storeNo } = this.data
    router.push({
      name: 'detail',
      data: {
        spuId,
        skuId,
        activityId,
        objectId,
        orderType,
        isCart: 1,
        shareStoreNo: storeNo,
      }
    });
  },

  remindStoreBuyNotice(e) {
    const {
      data,
    } = e.currentTarget.dataset;
    intensiveApi.remindStoreBuyNotice({
      skuId: data.skuId,
      spuId: data.spuId,
      wsId: data.wsId
    }, { showLoading: false })
      .then(res => {
        this.getAllGoodsList5()
      })
  },

  handleUpdate(res) {
    this.init(this.data.tabIndexId)
  },

  // 购物车商品列表
  getCartList(params = {}) {
    const refreshToken = wx.getStorageSync("REFRESH_TOKEN");
    if (!refreshToken) {
      this.setData({
        cartList: []
      })
      return Promise.resolve([])
    }

    return new Promise((resolve) => {
      cartApi.cartList(params, { showLoading: false }).then((res) => {
        console.log('购物车商品列表', res)
        this.setData({
          cartList: res
        })
        resolve(res)
      })
    })
  },
  // 商品列表
  async getAllGoodsList(gcId1) {
    const params = {
      page: 1,
      size: 999,
      gcId1: gcId1 || 0,
    }
    const resolveData = await this.getCartList();
    const spuIds = []
    return new Promise((resolve) => {
      intensiveApi.getGoodsList(params, { showLoading: false }).then((res) => {
        let list = res.records.map((item) => {
          let p = (item.salePrice / 100).toString();
          let a = '';
          let z = '';
          let v = 0;
          if (p.includes('.')) {
            a = p.split('.')[0]
            z = p.split('.')[1]
          } else {
            a = p
          }

          const obj = {
            ...item,
            aPrice: a,
            zPrice: z,
            value: v,
          }

          resolveData.map(cartItem => {
            spuIds.push(cartItem.spuId)
            if (cartItem.spuId == item.spuId) {
              obj.value += cartItem.quantity
              obj[cartItem.skuId] = cartItem.quantity
            }
          })
          return obj
        })
        if (list.length === 0) {
          this.tabActiveArrOri = this.tabActiveArrOri.filter(item => item !== 2)
          this.setData({
            tabActive: this.tabActiveArrOri[0]
          }, () => {
            setTimeout(() => {
              this.selectComponent('#tabs').resize()
            }, 1000);
          })

        }
        this.getSummaryByCartData({ length: [...new Set(spuIds)].length });
        if (gcId1 == 0) {
          if (list.length > 6) {
            this.setData({ hasClass: true })
          } else {
            this.setData({ hasClass: false })
          }
        }
        this.setData({
          goodsData: list,
        }, () => {
          resolve(true)
        })
      })
    })
  },
  async getAllGoodsList3(gcId1) {
    const params = {
      page: 1,
      size: 999,
      gcId1: gcId1 || 0,
    }
    const resolveData = await this.getCartList({ subType: 151 });
    const spuIds = []
    return new Promise((resolve) => {
      intensiveApi.getGoodsList3(params, { showLoading: false }).then((res) => {
        let list = res.records.map((item) => {
          let p = (item.salePrice / 100).toString();
          let a = '';
          let z = '';
          let v = 0;
          if (p.includes('.')) {
            a = p.split('.')[0]
            z = p.split('.')[1]
          } else {
            a = p
          }

          const obj = {
            ...item,
            aPrice: a,
            zPrice: z,
            value: v,
            type: 3,
          }

          resolveData.map(cartItem => {
            spuIds.push(cartItem.spuId)
            if (cartItem.spuId == item.spuId) {
              obj.value += cartItem.quantity
              obj[cartItem.skuId] = cartItem.quantity
            }
          })
          return obj
        })
        if (gcId1 == 0) {
          if (list.length > 6) {
            this.setData({ hasClass3: true })
          } else {
            this.setData({ hasClass3: false })
          }
        }

        if (list.length === 0) {
          this.tabActiveArrOri = this.tabActiveArrOri.filter(item => item !== 0)
          this.setData({
            tabActive: this.tabActiveArrOri[0]
          }, () => {
            setTimeout(() => {
              this.selectComponent('#tabs').resize()
            }, 1000);
          })
        }

        this.getSummaryByCartData({ subType: 151, length: [...new Set(spuIds)].length })
        this.setData({
          goodsData3: list,
        }, () => {
          resolve(true)
        })
      })
    })
  },
  async getAllGoodsList4() {
    const storeInfo = wx.getStorageSync("TAKE_SPOT")
    const _this = this;
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
      success(result) {
        const params = {
          latitude: result.latitude,
          longitude: result.longitude,
        }
        // const resolveData = await this.getCartList();
        return new Promise((resolve) => {
          intensiveApi.getGoodsList4(params, { showLoading: false }).then((res) => {
            let list = res.map((item) => {
              let p = (item.salePrice / 100).toString();
              let a = '';
              let z = '';
              let v = 0;
              if (p.includes('.')) {
                a = p.split('.')[0]
                z = p.split('.')[1]
              } else {
                a = p
              }

              return {
                ...item,
                aPrice: a,
                zPrice: z,
                value: v,
              }
            })

            if (list.length === 0) {
              this.tabActiveArrOri = this.tabActiveArrOri.filter(item => item !== 3)
              this.setData({
                tabActive: this.tabActiveArrOri[0]
              }, () => {
                setTimeout(() => {
                  this.selectComponent('#tabs').resize()
                }, 1000);
              })
            }
            _this.setData({
              goodsData4: list,
            }, () => {
              resolve(true)
            })
          })
        })
      }
    })

  },
  async getAllGoodsList5() {
    const params = {
      page: 1,
      size: 999,
    }
    // const resolveData = await this.getCartList();
    return new Promise((resolve) => {
      intensiveApi.getGoodsList5(params, { showLoading: false }).then((res) => {
        let list = res.records.map((item) => {
          let p = (item.salePrice / 100).toString();
          let a = '';
          let z = '';
          let v = 0;
          if (p.includes('.')) {
            a = p.split('.')[0]
            z = p.split('.')[1]
          } else {
            a = p
          }

          return {
            ...item,
            aPrice: a,
            zPrice: z,
            value: v,
          }
        })
        if (list.length === 0) {
          this.tabActiveArrOri = this.tabActiveArrOri.filter(item => item !== 4)
          this.setData({
            tabActive: this.tabActiveArrOri[0]
          }, () => {
            setTimeout(() => {
              this.selectComponent('#tabs').resize()
            }, 1000);
          })
        }
        this.setData({
          goodsData5: list,
        }, () => {
          resolve(true)
        })
      })
    })
  },
  getAllGoodsList2(gcId1) {
    const { storeNo } = this.data
    const params = {
      page: 1,
      size: 999,
      gcId2: gcId1 || 0,
      storeNo,
    }
    intensiveApi.shopIndexGoods(params, { showLoading: false }).then((res) => {
      let list = res.records.map((item) => {
        let p = (item.salePrice / 100).toString();
        let a = '';
        let z = '';
        let v = 0;
        if (p.includes('.')) {
          a = p.split('.')[0]
          z = p.split('.')[1]
        } else {
          a = p
        }
        return {
          ...item,
          aPrice: a,
          zPrice: z,
          value: v,
        }
      })

      if (list.length === 0) {
        this.tabActiveArrOri = this.tabActiveArrOri.filter(item => item !== 1)
        this.setData({
          tabActive: this.tabActiveArrOri[0]
        }, () => {
          setTimeout(() => {
            this.selectComponent('#tabs').resize()
          }, 1000);
        })
      }

      this.setData({
        goodsData2: list,
      }, () => {
        const query = wx.createSelectorQuery()
        query.select('#tabs').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec((res) => {
          if (res[0] && res[0].hasOwnProperty('height')) {
            this.setData({
              height1: res[0].height,
              height2: res[0].height,
            })
          }
        })
      })
    })
  },
  // 查询商品分类
  getGoodsCategory() {
    const { storeNo } = this.data
    const params = {
      storeNo
    }
    return new Promise((resolve) => {
      intensiveApi.getGoodsCategory(params, { showLoading: false }).then((res) => {
        console.log('getGoodsCategory-res', res);
        this.setData({
          classData: res.records
        }, () => {
          resolve(true)
        })
      })
    })
  },
  getGoodsCategory3() {
    const { storeNo } = this.data
    const params = {
      storeNo
    }
    return new Promise((resolve) => {
      intensiveApi.getGoodsCategory3(params, { showLoading: false }).then((res) => {
        this.setData({
          classData3: res.records
        }, () => {
          resolve(true)
        })
      })
    })
  },
  shopIndexCategory() {
    const { storeNo } = this.data
    intensiveApi.shopIndexCategory({ storeNo }, { showLoading: false })
      .then(res => {
        this.setData({
          classData2: res.records
        })
      })
  },
  // 推荐商品列表
  getRecGoods() {
    const { storeNo } = this.data
    const params = {
      storeNo
    }
    intensiveApi.getRecGoods(params, { showLoading: false }).then((res) => {
      console.log('getRecGoods-res', res);
    })
  },

  // 获取banner
  getBannerData() {
    let params = {
      useType: 5,
      location: 2,
    }
    return new Promise((reject) => {
      homeApi.getBannerList(params, { showLoading: false }).then((res) => {
        this.setData({
          bannerData: res
        }, () => {
          reject()
        })
      });
    })

  },

  async onStepChangeAdd(e) {
    let { index, item, type } = e.currentTarget.dataset;
    let { buyMaxNum, value, unit, stockNum, isMultiSpec } = item;
    if (isMultiSpec === 1) {
      store.onChangeSpecState(true)
      this.setData({
        selectSku: null,
      }, () => {
        this.setData({
          selectSku: {
            ...item,
            type,
            index,
          }
        })
      })
    } else {
      // Toast.loading({ forbidClick: true });
      let { goodsData3, goodsData } = this.data;
      let data = goodsData;
      if (type == 3) {
        data = goodsData3
      }
      if (buyMaxNum > stockNum) {
        buyMaxNum = stockNum
      }
      if (value + 1 > buyMaxNum) {
        Toast(`该商品最多购买${buyMaxNum}${unit}`);
        return
      }
      data[index].value = value + 1
      const yes = await this.setCartNum(data[index]);
      if (!yes) {
        return
      }
      setTimeout(() => {
        Toast.clear();
        if (type == 3) {
          this.setData({
            goodsData3: data
          });
        } else {
          this.setData({
            goodsData: data
          });
        }
      }, 300);
    }

  },
  specAdd({ detail }) {
    const selectSku = this.data.selectSku

    let { goodsData3, goodsData } = this.data;
    let data = goodsData;
    if (selectSku.type == 3) {
      data = goodsData3
    }

    data[selectSku.index].value = selectSku.value + detail.quantity
    selectSku.value = (selectSku[detail.skuId] ? selectSku[detail.skuId] : 0) + detail.quantity
    selectSku.skuId = detail.skuId

    this.setCartNum(selectSku)
      .then(res => {
        if (selectSku.type == 3) {
          this.setData({
            goodsData3: data
          });
        } else {
          this.setData({
            goodsData: data
          });
        }
      })

  },
  onStepChangeDelete(e) {
    // Toast.loading({ forbidClick: true });
    let { index, item } = e.currentTarget.dataset;
    let { buyMinNum, value, unit, isMultiSpec } = item;
    if (isMultiSpec === 1) {
      Toast('请到购物车删除商品')
      return;
    }
    let data = this.data.goodsData
    if (item.type === 3) {
      data = this.data.goodsData3
    }
    if (value == 0) {
      return
    }
    let num = value - 1;
    data[index].value = num;
    if ((buyMinNum > 1) && (value - 1 < buyMinNum)) {
      Toast(`该商品${buyMinNum}${unit}起购`);
    }
    this.setCartNum(data[index]);
    setTimeout(() => {
      Toast.clear();
      if (item.type === 3) {
        this.setData({
          goodsData3: data
        });
      } else {
        this.setData({
          goodsData: data
        });
      }

    }, 300);
  },
  checkTab(e) {
    const {
      gcId1,
    } = e.currentTarget.dataset.class;
    this.getAllGoodsList(gcId1)
    this.setData({
      tabIndexId: gcId1
    })
    wx.createSelectorQuery()
      .select('#scroll-view1')
      .node()
      .exec((res) => {
        const scrollView = res[0].node;
        scrollView.scrollTo({ top: 0 });
      })
  },
  checkTab2(e) {
    const {
      gcId2,
    } = e.currentTarget.dataset.class;
    // this.getAllGoodsList(gcId2)
    this.setData({
      tabIndexId2: gcId2
    })
    this.getAllGoodsList2(gcId2)
    wx.createSelectorQuery()
      .select('#scroll-view2')
      .node()
      .exec((res) => {
        const scrollView = res[0].node;
        scrollView.scrollTo({ top: 0 });
      })
  },
  checkTab3(e) {
    const {
      gcId1,
    } = e.currentTarget.dataset.class;
    // this.getAllGoodsList(gcId2)
    this.setData({
      tabIndexId3: gcId1
    })
    this.getAllGoodsList3(gcId1)
    wx.createSelectorQuery()
      .select('#scroll-view2')
      .node()
      .exec((res) => {
        const scrollView = res[0].node;
        scrollView.scrollTo({ top: 0 });
      })
  },

  // 获取集约列表
  getIntensiveData() {
    let spot = wx.getStorageSync("TAKE_SPOT") || {};
    let params = {
      storeNo: spot.storeNo || '',
      page: 1,
      size: 99,
    }
    return new Promise((reject) => {
      homeApi.getIntensiveGood(params, { showLoading: false }).then(res => {
        this.setData({
          intensiveData: res
        }, () => {
          reject()
        })
      });
    })
  },

  // 提醒采购商品列表
  getRecommendData() {
    // const f = wx.getStorageSync('EXAMINE') || false;
    // console.log('提醒采购商品f', f)
    // if (f) {
    //   return
    // }
    let spot = wx.getStorageSync("TAKE_SPOT") || {};
    let params = {
      page: 1,
      size: 99,
      storeNo: spot.storeNo || '',
    }
    homeApi.getStoreNotInSkus(params, { showLoading: false }).then(res => {
      console.log('提醒采购商品列表', res)
      this.setData({
        recommendData: res
      })
    });
  },

  // 获取审核状态
  getMiniExamine(isReload = false) {
    commonApi.getResourceDetail({
      resourceKey: "MINIEXAMINE",
    }, {
      showLoading: false,
    }).then(res => {
      const data = res.data;
      const miniState = this.isMiniExamine;
      if (data.state == 1 && !miniState) {
        // 审核
        this.isMiniExamine = true;
      } else if (data.state == 0) {
        // 正式版
        this.isMiniExamine = false;
      }
      this.init(isReload);
      wx.setStorage({
        key: "EXAMINE",
        data: this.isMiniExamine,
      })
    }).catch(err => {
      this.init(isReload);
    });
  },

  // 获取为止权限
  getLocationAuth: async (that) => {
    const locationAuth = await checkSetting('userLocation', true);
    that.setData({
      locationAuth,
    });
    if (locationAuth) {
      // 自动选择附近的一个店铺
      const takeSpot = wx.getStorageSync("TAKE_SPOT");
      !takeSpot && wx.getLocation({
        type: 'gps84',
        altitude: false,
        success(result) {
          let data = {
            latitude: result.latitude,
            longitude: result.longitude,
          }
          that.getNearbyStore(data);
        },
        fail(err) {

        },
      });
    }
  },

  // 附近店铺
  getNearbyStore(data) {
    goodApi.getNearbyStore({
      radius: 50000,
      unit: 'm',
      limit: 200,
      ...data,
    }, { showLoading: false }).then(res => {
      let list = [];
      let fullAddress = "";
      let tempData = {};
      if (res.length > 0) {
        const MarkData = res[0];
        fullAddress = "";
        for (let str in MarkData.areaInfo) {
          fullAddress += MarkData.areaInfo[str];
        }
        fullAddress += MarkData.address;
        MarkData.fullAddress = fullAddress;
        tempData = {
          ...MarkData,
          width: 23,
          height: 32,
          id: 10,
          selected: true,
          iconPath: deflocationIcon,
        }
        wx.setStorage({
          key: "TAKE_SPOT",
          data: tempData,
        });
        this.setData({
          takeSpot: tempData,
        });
      }
    })
  },

  // 跳转选择地址
  onToLocation: async function () {
    let {
      locationAuth,
    } = this.data;
    let auth = false;
    if (!locationAuth) {
      auth = await checkSetting('userLocation', true);
      if (auth) {
        locationAuth = true;
        this.setData({
          locationAuth,
        });
      }
    }
    if (!locationAuth) {
      showModal({
        content: "需要您授权地理位置才可使用",
        ok: () => {
          wx.openSetting({
            success(result) {
              this.setData({
                showModalFlag: true,
              })
              if (result.errMsg === "openSetting:ok") {
                const {
                  authSetting,
                } = result;
                let state = authSetting['scope.userLocation'];
                if (state) {
                  router.push({
                    name: 'location',
                  });
                } else {
                  showToast('您没有授权成功呢！');
                }
              }
            },
            fail: (err) => {
              this.setData({
                showModalFlag: true,
              })
              showToast('您没有授权成功呢！');
            },
          });
        },
        cancel: () => {
          this.setData({
            showModalFlag: true,
          })
        }
      })

    } else {
      router.push({
        name: 'location',
      });
    }
  },

  // 跳转搜索
  onToSearch() {
    router.push({
      name: 'storeSearch',
    });
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
    let {
      fixationTop,
      isOnGoods,
      scrollBottom,
      scrollToTop,
      classGoodToTop,
    } = this.data;

    // this.getRecordScrollTop();
    if (scrollBottom) {
      this.setData({
        scrollBottom: false,
      })
    }
    //滚动条距离顶部高度
    let scrollTop = detail.scrollTop;
    if (!this.isSetScroll) {
      // 判断'滚动条'滚动的距离 和 '元素在初始时'距顶部的距离进行判断
      let isSatisfy = scrollTop >= (classGoodToTop - scrollToTop - 5) ? true : false;
      // let isSatisfy = navbarInitTop < 138 ? true : false;
      // 为了防止不停的setData, 这儿做了一个等式判断。 只有处于吸顶的临界值才会不相等
      if (this.data.isFixedTop === isSatisfy) {
        return false
      }
      this.setData({
        isFixedTop: isSatisfy
      })
    } else {
      this.isSetScroll = false;
    }
  },


  // 获取楼层距离顶部距离
  getRecordScrollTop() {
    const query = wx.createSelectorQuery();
    query.select('#home_scroll').boundingClientRect();
    query.select('#classGoods').boundingClientRect().exec((res) => {
      console.log("🚀 ~ file: index.js ~ line 417 ~ query.select ~ res", res[0])
      console.log("🚀 ~ file: index.js ~ line 417 ~ query.select ~ res", res[1])
      if (res && res.length > 1) {
        let scrollToTop = res[0].top;
        let classGoodToTop = res[1].top;
        // this.setData({
        //   scrollToTop,
        //   classGoodToTop,
        //   leaveTopL: classGoodToTop - scrollToTop,
        // });
      }
    });
  },

  // 设置view 滚动高度
  setScroll() {
    const {
      scrollToTop,
      classGoodToTop,
    } = this.data;
    const {
      systemInfo,
    } = this.store.data;
    let scrollTop = classGoodToTop - scrollToTop;
    // 滚动监听不准确
    this.isSetScroll = true;
    this.setData({
      scrollTop,
    })
  },

  // 更新置顶状态
  setIsFixedTop({
    detail,
  }) {
    this.setData({
      isFixedTop: detail
    })
  },

  handleScrollBottom() {
    console.log('111')
    this.setData({
      scrollBottom: true,
    })
  },

  // 下拉刷新
  onPullDownRefresh() {
    setTimeout(() => {
      this.setData({
        refresherTriggered: true,
      }, () => {
        this.getMiniExamine(true);
      });
    }, 500)
  },

  tabChange(event) {
    this.setData({
      tabActive: event.detail.name
    })
  },
})
