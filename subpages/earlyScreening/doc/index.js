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
    showSharePopup: false
  },

  options: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      
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
})
