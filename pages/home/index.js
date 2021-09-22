import create from '../../utils/create'
import store from '../../store/index'
import router from '../../utils/router'
import homeApi from '../../apis/home'
import commonApi from '../../apis/common'
import { IMG_CDN } from '../../constants/common'
import { showModal, showToast } from '../../utils/tools'
import { checkSetting } from '../../utils/wxSetting';
import { HTTP_TIMEOUT } from '../../constants/index'

create.Page(store, {
  floorTimer: null,
  touchTimer: null,
  onTimeTimer: null,
  isScroll: false,
  scrollLock: false,
  isFristLoad: true,
  floorTime: new Date().getTime(),
  isMiniExamine: false,
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
    headBackCss: `background-image: url(${IMG_CDN}miniprogram/home/nav_back.png?v=2021)`, 
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
    // 邀请注册成功
    inviteRegister: false,
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

    setTimeout(() => {
      if(this.data.classGoodToTop) { return ;}
      const query = wx.createSelectorQuery()
      query.select('#home_scroll').boundingClientRect()
      query.select('#classGoods').boundingClientRect().exec((res) => {
        if (res && res.length > 1) {
          let scrollToTop = res[0].top;
          let classGoodToTop = res[1].top;
          this.setData({
            scrollToTop,
            classGoodToTop,
            leaveTopL: classGoodToTop - scrollToTop
          });
        }
      })
    }, 1000);
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
    // 2 代表小程序审核版本 3 代表小程序正试版本
    let verifyVersionId = this.isMiniExamine ? 2 : 3;
    if(!!floor) {
      this.floorTimer = setTimeout(() => {
        headBackCss = this.setHeadBack(floor.headData && floor.headData.style || "");
        this.setData({
          floor: floor,
          headBackCss,
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
      this.setData({
        floor: res,
        headBackCss,
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
    // let headBackCss = `background-color: #FC3B18`;
    let headBackCss = `background-image: url('${IMG_CDN}miniprogram/home/nav_back.png?v=2022')`;
    // if(style.backgroundImage) {
    //   headBackCss = `background-image: url(${style.backgroundImage})`
    // } else if(style.backgroundColor) {
    //   headBackCss = `background-color: ${style.backgroundColor}`
    // }
    return headBackCss;
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
  
  // 获取为止权限
  getLocationAuth: async (that) => {
    const locationAuth = await checkSetting('userLocation', true);
    that.setData({
      locationAuth,
    });
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

    // 判断是否在热销商品区域
    // if(this.scrollLock) return;
    // let goodTop = 1000;
    // let query = wx.createSelectorQuery();
    // query.select('#hotGoods').boundingClientRect((rect) => {
    //   goodTop = rect.top;
    //   isOnGoods = goodTop < fixationTop + 20 ? true : false;
    //   this.setData({
    //     isOnGoods,
    //   });
    // }).exec();
    // this.onTimeTimer = setTimeout(() => {
    //   this.scrollLock = false;
    //   clearTimeout(this.onTimeTimer)
    // }, 200);
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

  // 页面滚动到底部
  onReachBottom() {
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