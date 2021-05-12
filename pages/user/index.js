import create from '../../utils/create'
import store from '../../store/index'
import router from '../../utils/router'
import { orderList, otherSetting } from '../../constants/user'
import commonApi from '../../apis/common'

create.Page(store, {

  /**
   * 页面的初始数据
   */
  use: [
    'systemInfo',
    'userInfo',
    'motto'
  ],

  data: {
    orderTypeList: orderList,
    otherSetting,
    userAuth: true,
    canUseUserProfile: true,
    banner: "",
    showPopup: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    commonApi.getResourceDetail({
      resourceKey: "USERBANNER"
    }).then(res => {
      this.setData({
        banner: res.data.banner
      })
    })

    // this.getUserSetting();
    // if (wx.getUserProfile) {
    //   this.setData({
    //   })
    // }
  },

  onShow() {
    // 更新tabbar显示
    router.updateSelectTabbar(this, 3);
  },

  onToLogin() {
    router.push({
      name: "login"
    })
  },

  onToOtherSet({
    currentTarget
  }) {
    const {
      type,
      path
    } = currentTarget.dataset;
    if(type === 1) {
      router.push({
        name: path
      })
    } else {
      this.showPopup();
    }
  },

  showPopup() {
    this.setData({
      showPopup: true,
    })
  },

  onHidePopup() {
    this.setData({
      showPopup: false,
    })
  },
  
  // 进入页面获取用户授权情况
  getUserSetting () {
    var that = this;
    //查看是否授权
    wx.getSetting({
      success: function(res) {
      console.log("🚀 ~ file: index.js ~ line 36 ~ getUserSetting ~ res", res)
        if (res.authSetting['scope.userInfo']) {
          console.log("用户授权了");
          // wx.getUserInfo({
          //   lang: "zh_CN",
          //   success (res) {
          //     that.getCodeLogin(res.userInfo);
          //   }
          // })
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

  onGetUserProfile() {
    // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        this.getCodeLogin(res.userInfo);
        // this.setData({
        //   userInfo: res.userInfo,
        //   hasUserInfo: true
        // })
      }
    })
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