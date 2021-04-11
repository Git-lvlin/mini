import create from '../../../utils/create'
import store from '../../../store/index'
import router from '../../../utils/router'
import day from 'dayjs' 
import { getList } from '../../../apis/home'

create.Page(store, {

  /**
   * 页面的初始数据
   */
  use: [
    'motto'
  ],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserSetting();
  },
  
  // 进入页面获取用户授权情况
  getUserSetting () {
    var that = this;
    //查看是否授权
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          console.log("用户授权了");
          wx.getUserInfo({
            lang: "zh_CN",
            success (res) {
              that.getCodeLogin(res.userInfo);
            }
          })
        } else {
          //用户没有授权
          console.log("用户没有授权");
          that.setData({ userAuth : false})
        }
      }
    });
  },

  // 点击授权
  handleGetUerInfo(res) {
    console.log(res)
    // rawData
    if(!!res.detail.userInfo){ // 返回用户信息
      this.getCodeLogin(res.detail.userInfo);
    } else { // 没有返回用户信息
      console.log("用户按了拒绝按钮")
    }
  },

  // 获取用户openid 登录
  getCodeLogin (userInfo) {
    console.log(userInfo);
    this.setData({ userAuth : true, userInfo: userInfo})
  },

  // 点击图片
  onClickImg(event) {
    console.log(event);
    wx.previewImage({
      urls: [event.target.dataset.src] // 需要预览的图片http链接列表
    })
  },

  // 点击头部
  onClickHead() {
    wx.navigateTo({
      url: '/dokit/index/index',
    })
  },

  // 点击全局
  onClickOther() {
    router.push({
      name: "list"
    })
  }
})