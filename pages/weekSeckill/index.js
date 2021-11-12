import router from "../../utils/router";
import seckillApi from '../../apis/weekSeckill';
import create from '../../utils/create.js'
import store from '../../store/index'
import homeApi from '../../apis/home'
import { getStorageUserInfo } from '../../utils/tools'
import routes from '../../constants/routes'

const app = getApp();

create.Page(store, {
  use: [
    'systemInfo'
  ],
  data: {
    timeData: {},
    seckillData: {},
    itemIndex: 0,
    active: 0,
    tomorrow: {},
    showTop: false,
    isFixed: false,
    shareInfo: "",
  },
  iconChange(e) {
    this.setData({
      itemIndex: e.detail.current
    })
  },
  // 返回上一页
  onBack() {
    router.go();
  },
  tabChange(event) {
    this.setData({
      active: event.detail.index
    }, () => {
      // let code = event.detail.index + 1
      // this.getUserIcon(code)
    })

  },
  setFixed({ detail}) {
    this.setData({
      isFixed: detail,
    })
  },
  goTop(){
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  onChange(e) {
    this.setData({
      timeData: e.detail,
    });
  },
  onRemind({ detail  }) {
    this.getUserIcon(detail);
  },
  getUserIcon(code) {
    let param = {
      indexVersion: 1,
      next: 0,
      size: 99,
      type: code
    }
    
    seckillApi.getXsmsWeekGoodsList(param).then(res => {
      if (code === 2) {
        this.setData({
          tomorrow: res
        })
        wx.setStorage({
          key: "WEEK_SECKILL_TOMORROW",
          data: res,
        })
      } else {
        this.setData({
          seckillData: res
        })
        wx.setStorage({
          key: "WEEK_SECKILL_TODAY",
          data: res,
        })
      }

    })
  },
  
  onLoad: function (options) {
    const tomorrow = wx.getStorageSync("WEEK_SECKILL_TOMORROW") || false;
    const today = wx.getStorageSync("WEEK_SECKILL_TODAY") || false;
    this.setData({
      seckillData: today
    })
    this.setData({
      tomorrow: tomorrow
    })
    this.getUserIcon(1)
    this.getUserIcon(2)

    

    app.trackEvent('home_spikeWeek');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 更新tabbar显示
    // router.updateSelectTabbar(this, 1);
    let userInfo = getStorageUserInfo();
    if (!!userInfo) {
      this.getShareInfo();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getUserIcon(1)
    this.getUserIcon(2)
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  // 获取分享参数
  getShareInfo() {

    const shareParams = {
      "contentType": 6,
      "paramId": 6,
      "shareType": 1,
      "sourceType": 6
    }

    homeApi.getShareInfo(shareParams, {
      showLoading: false,
    }, {
      showLoading: false,
    }).then(res => {
      const shareInfo = {
        title: res.title || "每周优选好货抢不停,周末大狂欢,每周有好货每周都上新",
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
      shareInfo,
    } = this.data;

    let info = {
      title: "每周优选好货抢不停,周末大狂欢,每周有好货每周都上新",
      path: routes.weekSeckill.path,
    }

    if (shareInfo) {
      info = {
        ...info,
        ...shareInfo
      }
    }
    return info;
  },
})