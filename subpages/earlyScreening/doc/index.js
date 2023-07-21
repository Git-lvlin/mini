import create from '../../../utils/create.js'
import store from '../../../store/index'


create.Page(store, {
  use: [
    "systemInfo"
  ],

  /**
   * 页面的初始数据
   */
  data: {
    showSharePopup: false,
    p:''
  },

  options: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
        p:options.p
    })
    console.log('options',options)
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
    
  },
  showSharePopup() {
    this.setData({
      showSharePopup: true,
    })
  },
  onHideSharePopup() {
    this.setData({
      showSharePopup: false,
    })
  },
  launchAppError (e) {
    console.log(e.detail.errMsg)
  }
})
