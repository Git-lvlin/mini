import router from "../../utils/router";
import seckillApi from '../../apis/seckill'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeData: {},
    seckillData: {},
    itemIndex: 0,
    active: 0,
  },
  iconChange(e) {
    console.log('eeeeeee', e.detail.current)
    this.setData({
      itemIndex: e.detail.current
    })
  },
  // 返回上一页
  onBack() {
    router.go();
  },
  tabChange(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none',
    });
  },
  onChange(e) {
    this.setData({
      timeData: e.detail,
    });
  },
  getUserIcon() {
    let param = {
      indexVersion: 1,
      verifyVersionId: 1,
      next: 0,
      size: 20,
      dayCode: 'today'
    }
    seckillApi.getXsmsGoodsList(param).then(res => {
      this.setData({
        seckillData: res
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserIcon()
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