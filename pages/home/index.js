import create from '../../utils/create'
import store from '../../store/index'
import router from '../../utils/router'
import homeApi from '../../apis/home'
import goodApi from '../../apis/good'
import commonApi from '../../apis/common'
import { IMG_CDN } from '../../constants/common'
import { debounce, showModal, showToast } from '../../utils/tools'
import { checkSetting } from '../../utils/wxSetting';
import { HTTP_TIMEOUT } from '../../constants/index'
import { FLOOR_TYPE } from '../../constants/home'

const deflocationIcon = `${IMG_CDN}miniprogram/location/def_location.png?V=465656`;
const app = getApp();
create.Page(store, {
  floorTimer: null,
  touchTimer: null,
  onTimeTimer: null,
  isScroll: false,
  scrollLock: false,
  isFristLoad: true,
  floorTime: new Date().getTime(),
  isMiniExamine: false,

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
    headBackCss: '', 
    activityAdvert: {},
    locationAuth: false,
    takeSpot: {},
    topSearchHeight: 0,
    showLoadImg: false,
    refresherTriggered: false,
    // 邀请注册成功
    inviteRegister: false,
    // 已滚动高度
    scrolledDistance: 0,
    scrollTop: 0,
    scrollTopDistance: 0,
    // 当前显示的楼层
    isShowFloor: {},
    // 当前显示的楼层距离顶部距离
    floorTopDistance: {},
  },

  onLoad(options) {
    // 系统弹窗
    this.getMiniExamine();
    this.getSystemPopup();
    // 活动弹窗
    // this.getAdvert(2);
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
    // 检查定位权限 获取当前定位
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
    // this.getMiniExamine();
    // 更新tabbar显示
    router.updateSelectTabbar(this, 0);
    debounce(() => {
      this.getRecordScrollTop(0);
    }, 200)();
    app.trackEvent('tab_home');
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
        const inviteRegister = wx.getStorageSync("INVITE_REGISTER") || false;
        if(inviteRegister) {
          this.setData({
            inviteRegister,
          });
          wx.removeStorage({
            key: 'INVITE_REGISTER',
          })
        }
      }
      this.getFloorList(isReload);
      wx.setStorage({
        key: "EXAMINE",
        data: this.isMiniExamine,
      })
    }).catch(err => {
      this.getFloorList(isReload);
    });
  },

  // 获取首页楼层列表
  getFloorList(isReload) {
    let floor = wx.getStorageSync("HOME_FLOOR");
    let headBackCss = "";
    let pageBackCss = "";
    let isShowFloor = {};
    // 2 代表小程序审核版本 3 代表小程序正试版本
    let verifyVersionId = this.isMiniExamine ? 2 : 3;
    if(!!floor) {
      this.floorTimer = setTimeout(() => {
        headBackCss = this.setHeadBack(floor.headData && floor.headData.style || "");
        pageBackCss = this.setHeadBack(floor.backgroundData && floor.backgroundData.style || "");
        this.setData({
          floor: floor,
          headBackCss,
          pageBackCss,
        });
      }, HTTP_TIMEOUT);
    }
    homeApi.getFloorList({
      timeVersion: this.floorTime,
      verifyVersionId,
    }, {
      showLoading: this.isFristLoad,
    }).then(res => {
      if(isReload) {
        this.setData({
          floor: {}
        })
      };
      clearTimeout(this.floorTimer);
      this.isFristLoad = true;
      headBackCss = this.setHeadBack(res.headData && res.headData.style || "");
      pageBackCss = this.setHeadBack(res.backgroundData && res.backgroundData.style || "");
      if(res.floors && res.floors.length) {
        res.floors.forEach(item => {
          isShowFloor[item.floorType] = true;
        })
      }
      this.setData({
        floor: res,
        isShowFloor,
        headBackCss,
        pageBackCss,
        refresherTriggered: false,
      });
      wx.setStorage({ key: "HOME_FLOOR", data: res });
    }).catch(err => {
      clearTimeout(this.floorTimer);
    })
  },

  // 获取系统弹窗
  getSystemPopup() {
    const sysEnv = wx.getStorageSync("SYS_ENV");
    if(sysEnv == "dev") return;
    commonApi.getResourceDetail({
      resourceKey: "SYSTEMPOP",
    }, {
      showLoading: false,
    }).then(res => {
      const data = res.data;
      if(data.state === 1) {
        showModal({
          title: data.title,
          content: data.content,
          showCancel: false,
        });
      }
    });
  },

  // 获取广告图
  getAdvert(type = 2) {
    homeApi.getAdvert({
      type
    }, {
      showLoading: false,
    }).then(res => {
      if(!res.length) return;
      const data = {};
      res.forEach(item => {
        // 活动广告
        if(type === 2) {
          data.activityAdvert = item;
        }
      });
      if(!!data.activityAdvert) {
        this.setData(data);
      }
    });
  },

  // 设置首页头部背景
  setHeadBack(style) {
    let backCss = '';
    if(style.appletBackgroundImage) {
      backCss = `background-image: url(${style.appletBackgroundImage});`
    }else if(style.backgroundImage) {
      backCss = `background-image: url(${style.backgroundImage});`
    } else if(style.backgroundColor) {
      backCss = `background-color: ${style.backgroundColor};`
    }
    return backCss;
  },

  // 点击悬浮图
  onFixation({
    currentTarget
  }) {
    let url = currentTarget.dataset.url;
    if(!url) return;
    router.getUrlRoute(url);
    // router.push({
    //   name: url,
    // })
    // router.push({
    //   name: "webview",
    //   data: {
    //     url: "http%3A%2F%2Fdev-yeahgo-publicmobile.waiad.icu%2Fmenu"
    //   },
    // });
  },
  
  // 获取位置权限
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
      scrollBottom,
    } = this.data;

    this.getRecordScrollTop(detail.scrollTop);
    // 是否滚动到底部
    if(scrollBottom) {
      this.setData({
        scrollBottom: false,
      })
    }
  },

  // 获取楼层距离顶部距离
  getRecordScrollTop(scrollTop) {
    const {
      isShowFloor,
    } = this.data;
    const that = this;
    const query = wx.createSelectorQuery();
    // ShowFloorDistance
    // scrollview距离顶部距离
    query.select('#home_scroll').boundingClientRect();
    if(isShowFloor[FLOOR_TYPE.classGood]) {
      // classGoods（分类商品列表）距离顶部距离
      query.select('#classGoods').boundingClientRect();
    }
    if(isShowFloor[FLOOR_TYPE.classGood2]) {
      // classGoods（分类商品列表）距离顶部距离
      query.select('#classGoods2').boundingClientRect();
    }
    query.exec((res) => {
      const data = {
        scrolledDistance: scrollTop,
        floorTopDistance: {},
      };
      res.forEach(item => {
        // 内容高度
        if (item.id == 'home_scroll') {
          data.scrollTopDistance = item.top;
        }
        // 商品分类高度
        if (item.id == 'classGoods') {
          data.floorTopDistance[FLOOR_TYPE.classGood] = item.top;
        }
        // 商品分类高度 v2
        if (item.id == 'classGoods2') {
          data.floorTopDistance[FLOOR_TYPE.classGood2] = item.top;
        }
      });
      this.setData(data);
    });
  },

  // 设置view 滚动高度
  setScroll({
    detail
  }) {
    const {
      floorType
    } = detail;
    const {
      scrollTopDistance,
      scrolledDistance,
      floorTopDistance,
    } = this.data;
    const {
      systemInfo,
    } = this.store.data;
    let scrollTop = scrolledDistance + floorTopDistance[floorType] - scrollTopDistance + 2;
    this.setData({
      scrollTop,
    })
  },

  // scrollview 滚动触底
  handleScrollBottom() {
    this.setData({
      scrollBottom: true,
    })
  },

  // 下拉刷新
  onPullDownRefresh() {
    wx.removeStorageSync("HOME_FLOOR");
    wx.removeStorageSync("HOME_CACHE");
    setTimeout(() => {
      this.setData({
        refresherTriggered: true,
      }, () => {
        this.getMiniExamine(true);
      });
    }, 500)
  },
  
  // 关闭下载弹窗
  onHideSharePopup() {
    this.setData({
      inviteRegister: false,
    })
  }
})