import create from '../../utils/create'
import store from '../../store/index'
import router from '../../utils/router'
import homeApi from '../../apis/home'
import intensiveApi from '../../apis/intensive'
import commonApi from '../../apis/common'
import { IMG_CDN } from '../../constants/common'
import { showModal, showToast } from '../../utils/tools'
import { checkSetting } from '../../utils/wxSetting';
import { HTTP_TIMEOUT } from '../../constants/index'

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

  use: [
    "userInfo",
    "systemInfo"
  ],
  
  data: {
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
    recommendData: [],
    remindData: [],
    recommendData: [],
  },

  onLoad(options) {
    this.getMiniExamine();
    const timer = setTimeout(() => {
      clearTimeout(timer);
      this.setData({
        showLoadImg: true
      });
    });
  },

  onReady() {
    let query = wx.createSelectorQuery();
    const {
      systemInfo,
    } = this.store.data;
    query.select('#fixation').boundingClientRect((rect) => {
      if(rect) {
        this.setData({
          fixationTop: rect.top,
        })
      }
    }).exec();
    this.getLocationAuth(this);
    query.select('#top_search').boundingClientRect((rect) => {
      if(rect) {
        this.setData({
          topSearchHeight: rect.height,
          navigationBarHeight:systemInfo.navBarHeight+(systemInfo.rpxRatio*rect.height)
        })
      }
    }).exec();
  },

  onShow() {
    const takeSpot = wx.getStorageSync("TAKE_SPOT");
    if(takeSpot) {
      this.setData({
        takeSpot,
      });
    }
    // 更新tabbar显示
    router.updateSelectTabbar(this, 2);
    app.trackEvent('tab_intensive');
    this.init()
  },

  // 初始化
  init() {
    Promise.all([this.getBannerData(),this.getIntensiveData(), this.getRecommendData()]).then((res) => {
      this.setData({
        refresherTriggered: false,
      })
    })
  },

  // 商品列表
  getAllGoodsList() {
    const params = {
      storeNo: 'store_m_124356',
      page: 1,
      size: 99,
      gcid1: 0,
    }
    intensiveApi.getGoodsList(params).then((res) => {
      console.log('getGoodsList-res', res);
    })
  },
  // 查询商品分类
  getGoodsCategory() {
    const params = {
      storeNo: 'store_m_124356'
    }
    intensiveApi.getGoodsCategory(params).then((res) => {
      console.log('getGoodsCategory-res', res);
    })
  },
  // 推荐商品列表
  getRecGoods() {
    const params = {
      storeNo: 'store_m_124356'
    }
    intensiveApi.getRecGoods(params).then((res) => {
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
      homeApi.getBannerList(params).then((res) => {
        this.setData({
          bannerData: res
        }, () => {
          reject()
        })
      });
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
      homeApi.getIntensiveGood(params).then(res => {
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
    const f = wx.getStorageSync('EXAMINE') || false;
    if (f) {
      return
    }
    let spot = wx.getStorageSync("TAKE_SPOT") || {};
    let params = {
      page: 1,
      size: 99,
      storeNo: spot.storeNo || '',
    }
    return new Promise((reject) => {
      homeApi.getStoreNotInSkus(params).then(res => {
        this.setData({
          recommendData: res
        }, () => {
          reject()
        })
      });
    })
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
      if(data.state == 1 && !miniState) {
        // 审核
        this.isMiniExamine = true;
      } else if(data.state == 0) {
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
    if(locationAuth) {
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
    }).then(res => {
      let list = [];
      let fullAddress = "";
      let tempData = {};
      if(res.length > 0) {
        const MarkData = res[0];
        fullAddress = "";
        for(let str in MarkData.areaInfo) {
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
  onToLocation: async function() {
    let {
      locationAuth,
    } = this.data;
    let auth = false;
    if(!locationAuth) {
      auth = await checkSetting('userLocation', true);
      if(auth) {
        locationAuth = true;
        this.setData({
          locationAuth,
        });
      }
    }
    if(!locationAuth) {
      showModal({
        content: "需要您授权地理位置才可使用",
        ok(){
          wx.openSetting({
            success(result) {
              if(result.errMsg === "openSetting:ok") {
                const {
                  authSetting,
                } = result;
                let state = authSetting['scope.userLocation'];
                if(state) {
                  router.push({
                    name: 'location',
                  });
                } else {
                  showToast('您没有授权成功呢！');
                }
              }
            },
            fail(err) {
              showToast('您没有授权成功呢！');
            },
          });
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
      name: 'search',
    });
  },

  // 监听触控移动
  handleTouchMove(event) {
    if(this.isScroll) return;
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
    if(scrollBottom) {
      this.setData({
        scrollBottom: false,
      })
    }
    //滚动条距离顶部高度
    let scrollTop = detail.scrollTop;
    if(!this.isSetScroll) {
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
})