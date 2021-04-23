import create from '../../utils/create'
import store from '../../store/index'
import router from '../../utils/router'

create.Page(store, {
  use: [
    "userInfo",
    "systemInfo"
  ],
  
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("home", this.data.$)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 
  onToClass() {
    router.push({
      name: 'classList',
    });
  },

  onToDetail() {
    router.push({
      name: 'detail',
    });
  },
})