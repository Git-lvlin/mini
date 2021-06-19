import create from '../../utils/create'
import store from '../../store/index'
import router from '../../utils/router'
import homeApi from '../../apis/home'
import dayjs from '../../miniprogram_npm/dayjs/index'
import { IMG_CDN } from '../../constants/common'
import { showModal } from '../../utils/tools'

create.Page(store, {
  touchTimer: null,
  onTimeTimer: null,
  isScroll: false,
  scrollLock: false,
  isFristLoad: true,
  floorTime: new Date().getTime(),

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
    headBackCss: `background-image: url("${IMG_CDN}miniprogram/home/nav_back.png")`, 
    activityAdvert: {},
  },

  onLoad(options) {
    console.log("home", this.store.data);
    // 系统弹窗
    // this.getAdvert(3);
    // 活动弹窗
    this.getAdvert(2);
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
  },

  onShow() {
    this.getFloorList();
    // 更新tabbar显示
    router.updateSelectTabbar(this, 0);
  },

  // 获取首页楼层列表
  getFloorList() {
    let floor = wx.getStorageSync("HOME_FLOOR");
    let headBackCss = "";
    if(!!floor) {
      headBackCss = this.setHeadBack(floor.headData && floor.headData.style || "");
      this.setData({
        floor: floor,
        headBackCss,
      });
      // return ;
    }
    homeApi.getFloorList({
      timeVersion: this.floorTime
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

  // 获取广告图
  getAdvert(type = 2) {
    homeApi.getAdvert({
      type
    }, {
      showLoading: false,
    }).then(res => {
      if(!res.length) return;
      const data = {};
      let systemPopup = "";
      res.forEach(item => {
        // 活动广告
        if(type === 2) {
          data.activityAdvert = item;
        } else if(type === 3) {
          systemPopup = item;
        }
      });
      if(!!data.activityAdvert) {
        this.setData(data);
      }
      // showModal({
      //   title: '112312312',
      //   content: '123123123123',
      // });
      // if(!!systemPopup) {
      // }
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
    // let url = currentTarget.dataset.url;
    // if(!url) return;
    // router.push({
    //   name: url,
    // })
    router.push({
      name: "webview",
      data: {
        url: "http%3A%2F%2Fdev-yeahgo-publicmobile.waiad.icu%2Fmenu"
      },
    });
  },

  // 跳转选择地址
  onToLocation() {
    router.push({
      name: 'location',
    });
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