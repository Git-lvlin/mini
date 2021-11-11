import router from "../../utils/router";
import seckillApi from '../../apis/seckill';

const app =  getApp();
Page({
  data: {
    timeData: {},
    seckillData: {},
    itemIndex: 0,
    active: 0,
    tomorrow: {},
    showTop: false,
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
      active: event.detail.name
    }, () => {
      let code = event.detail.name?'tomorrow':'today'
      this.getUserIcon(code, 1)
    })

  },
  onChange(e) {
    this.setData({
      timeData: e.detail,
    });
  },
  getUserIcon(code, type) {
    const tomorrow = wx.getStorageSync("SECKILL_TOMORROW") || false;
    const today = wx.getStorageSync("SECKILL_TODAY") || false;
    if (code === 'tomorrow' && tomorrow && type) {
      this.setData({
        tomorrow: tomorrow
      })
      return
    }
    if (code === 'today' && today && type) {
      this.setData({
        seckillData: today
      })
      return
    }

    let param = {
      indexVersion: 1,
      verifyVersionId: 1,
      next: 0,
      size: 99,
      dayCode: code
    }
    seckillApi.getXsmsGoodsList(param).then(res => {
      if (code === 'tomorrow') {
        this.setData({
          tomorrow: res
        })
        wx.setStorage({
          key: "SECKILL_TOMORROW",
          data: res,
        })
      } else {
        this.setData({
          seckillData: res
        })
        wx.setStorage({
          key: "SECKILL_TODAY",
          data: res,
        })
      }

    })
  },
  onRemind({currentTarget}) {
    if (currentTarget.dataset.data[1].isNotice == 2) {
      return
    }
    let param = {
      cmsId: currentTarget.dataset.data[0].cmsId,
      spuId: currentTarget.dataset.data[1].spuId
    }
    seckillApi.getXsmsNotice(param).then(res => {
      this.getUserIcon('tomorrow')
    })

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
      }
    });
  },
  // 监听页面滚动
  onPageScroll({scrollTop}) {
    if (scrollTop > 10) {
      this.setData({
        showTop: true
      })
    } else {
      this.setData({
        showTop: false
      })
    }
  },
  // 回到顶部
  backTop() {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  onLoad: function (options) {
    this.getUserIcon('today')
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
    app.trackEvent('tab_secKilling');
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
    wx.removeStorage('SECKILL_TOMORROW')
    wx.removeStorage('SECKILL_TODAY')
    this.getUserIcon('today')
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})