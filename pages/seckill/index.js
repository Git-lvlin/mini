import router from "../../utils/router";
import seckillApi from '../../apis/seckill';

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
      this.getUserIcon(code)
    })

  },
  onChange(e) {
    this.setData({
      timeData: e.detail,
    });
  },
  getUserIcon(code) {
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
      } else {
        this.setData({
          seckillData: res
        })
      }

    })
  },
  onRemind({currentTarget}) {
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
    router.updateSelectTabbar(this, 1);
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