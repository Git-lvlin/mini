import create from '../../utils/create'
import store from '../../store/index'
import router from '../../utils/router'
import homeApi from '../../apis/home'
import commonApi from '../../apis/common'
import { IMG_CDN } from '../../constants/common'
import { showModal, showToast } from '../../utils/tools'
import { checkSetting } from '../../utils/wxSetting';

create.Page(store, {
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
    headBackCss: `background-image: url(${IMG_CDN}miniprogram/home/nav_back.png)`, 
    activityAdvert: {},
    locationAuth: false,
    takeSpot: {},
  },

  onLoad(options) {
    console.log("home", this.store.data);
    // 系统弹窗
    this.getSystemPopup();
    // 活动弹窗
    this.getAdvert(2);
    let url = "https://www.kdocs.cn/p/115688640900r";
    let route = url.match(/(http|https):\/\/([^/]+)(\S*)/);
    console.log("route", route);
  },

  onReady() {
    let query = wx.createSelectorQuery();
    query.select('#fixation').boundingClientRect((rect) => {
      if(rect) {
        this.setData({
          fixationTop: rect.top
        })
      }
    }).exec();
    this.getLocationAuth(this);
  },

  onShow() {
    const takeSpot = wx.getStorageSync("TAKE_SPOT");
    if(takeSpot) {
      this.setData({
        takeSpot,
      });
    }
    this.getMiniExamine();
    // 更新tabbar显示
    router.updateSelectTabbar(this, 0);
  },

  // 获取审核状态
  getMiniExamine() {
    commonApi.getResourceDetail({
      resourceKey: "MINIEXAMINE",
    }, {
      showLoading: false,
    }).then(res => {
      const data = res.data;
      const miniState = this.isMiniExamine;
      if(data.state == 1 && !miniState) {
        this.isMiniExamine = true;
      } else if(data.state == 0 && miniState) {
        this.isMiniExamine = false;
      }
      this.getFloorList();
      wx.setStorage({
        key: "EXAMINE",
        data: this.isMiniExamine,
      })
    }).catch(err => {
      this.getFloorList();
    });
  },

  // 获取首页楼层列表
  getFloorList() {
    let floor = wx.getStorageSync("HOME_FLOOR");
    let headBackCss = "";
    // 2 代表小程序审核版本 3 代表小程序正试版本
    let verifyVersionId = this.isMiniExamine ? 2 : 3;
    if(!!floor) {
      headBackCss = this.setHeadBack(floor.headData && floor.headData.style || "");
      this.setData({
        floor: floor,
        headBackCss,
      });
      // return ;
    }
    homeApi.getFloorList({
      timeVersion: this.floorTime,
      verifyVersionId,
    }, {
      showLoading: this.isFristLoad,
    }).then(res => {
      this.isFristLoad = true;
      headBackCss = this.setHeadBack(res.headData && res.headData.style || "");
      this.setData({
        floor: res,
        headBackCss,
      });
      wx.setStorage({ key: "HOME_FLOOR", data: res });
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
    let headBackCss = `background-image: url("${IMG_CDN}miniprogram/home/nav_back.png")`;
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
    console.log("🚀 ~ file: index.js ~ line 155 ~ url", url)
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
  onToLocation() {
    const {
      locationAuth,
    } = this.data;
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
  onPageScroll(e) {
    let {
      fixationTop,
      isOnGoods,
      scrollBottom,
    } = this.data;

    if(scrollBottom) {
      this.setData({
        scrollBottom: false,
      })
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

  // 页面滚动到底部
  onReachBottom() {
    this.setData({
      scrollBottom: true,
    })
  }
})