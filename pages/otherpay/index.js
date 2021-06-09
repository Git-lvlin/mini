// pages/otherpay/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var obj = wx.getLaunchOptionsSync()
    //部分版本在无referrerInfo的时候会返回 undefined,可以做一下判断
    if (options.referrerInfo && options.referrerInfo.appId) {
      console.log('启动小程序的路径:', obj.path)
      console.log('启动小程序的场景值:', obj.scene)
      console.log('启动小程序的 query 参数:', obj.query)
      console.log('来源信息:', obj.shareTicket)
      console.log('来源信息参数appId:', obj.referrerInfo.appId)
      console.log('来源信息传过来的数据:', obj.referrerInfo.extraData)
    }
    //不做判断
    console.log('——启动小程序的obj:', obj)
    console.log('——启动小程序的路径:', obj.path)
    console.log('——启动小程序的场景值:', obj.scene)
    console.log('——启动小程序的 query 参数:', obj.query)
    console.log('——来源信息:', obj.shareTicket)
    console.log('——来源信息参数appId:', obj.referrerInfo.appId)
    console.log('——来源信息传过来的数据:', obj.referrerInfo.extraData)
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  launchAppError (e) {
    console.log(e.detail)
  }
})