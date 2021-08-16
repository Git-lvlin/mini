import create from '../../utils/create'
import store from '../../store/index'
import router from '../../utils/router'
import { orderList, otherSetting, USER_LEVEL } from '../../constants/user'
import userApi from '../../apis/user'
import { getStorageUserInfo, setStorageUserInfo, showToast } from '../../utils/tools'

create.Page(store, {
  use: [
    'systemInfo'
  ],

  data: {
    orderTypeList: orderList,
    otherSetting,
    userAuth: true,
    canUseUserProfile: true,
    banner: "",
    showSharePopup: false,
    showPopup: false,
    userData: [
      {
        text: "约卡（元）",
        value: 0,
      },
      {
        text: "优惠券",
        value: 0,
      },
      {
        text: "积分",
        value: 0,
      },
    ],
    userInfo: "",
    downLoadImg:{}
  },

  onLoad: function (options) {
    // commonApi.getResourceDetail({
    //   resourceKey: "USERBANNER"
    // }).then(res => {
    //   this.setData({
    //     banner: res.data.banner
    //   })
    // })

    // this.getUserSetting();
    // if (wx.getUserProfile) {
    //   this.setData({
    //   })
    // }
  },

  onShow() {
    // const {
    //   userData,
    // } = this.data;
    // 更新tabbar显示
    const {
      orderTypeList,
      userData,
    } = this.data;
    router.updateSelectTabbar(this, 3);
    const userInfo = getStorageUserInfo() || "";
    if(userInfo) {
      // userData[2].value = userInfo.integralValue || 0;
      this.updateUserInfo(userInfo);
      this.getUserData(userInfo);
      this.getOrderCount();
    } else {
      userData.forEach(item => item.value = 0);
      orderTypeList.forEach(item => item.subNum = 0);
    }
    this.setData({
      userInfo,
      orderTypeList,
      userData,
    });
  },

  // 获取用户信息
  updateUserInfo(userInfo) {
    userApi.getUserInfo({
      id: userInfo.id,
    }, {
      showLoading: false,
    }).then(res => {
      res.levelText = USER_LEVEL[res.memberLevel].name;
      res.levelIcon = USER_LEVEL[res.memberLevel].icon;
      setStorageUserInfo(res);
      this.setData({
        userInfo: res,
      })
    })
  },

  // 获取用户数据
  getUserData(userInfo) {
    const {
      userData,
    } = this.data;
    userApi.getUserData({
      id: userInfo.id,
    }).then(res => {
      let integralValue = res.integralValue;
      if(!integralValue || integralValue == "null" || integralValue == "undefined") {
        integralValue = 0;
      }
      userData[0].value = res.balance || 0;
      userData[1].value = res.couponNum || 0;
      userData[2].value = res.integralValue || 0;
      this.setData({
        userData,
      })
    });
  },

  // 获取订单数据
  getOrderCount() {
    const {
      orderTypeList
    } = this.data;
    userApi.getOrderCount({}, {
      showLoading: false,
    }).then(res => {
      orderTypeList[0].subNum = res.paid;
      orderTypeList[1].subNum = res.share;
      orderTypeList[2].subNum = res.deliver;
      // orderTypeList[3].subNum = res.receive;
      orderTypeList[4].subNum = res.afterSales;
      this.setData({
        orderTypeList,
      })
    })
  },

  // 跳转登录
  onToLogin() {
    router.push({
      name: "mobile"
    })
  },

  // 点击跳转个人信息
  onToInfo() {
    const userInfo = getStorageUserInfo();
    if(!userInfo) return;
    router.push({
      name: "information",
    });
  },

  // 点击其他功能模块
  onToOtherSet({
    currentTarget
  }) {
    const {
      type,
      path
    } = currentTarget.dataset;
    if(path == "address") {
      const userInfo = getStorageUserInfo(true);
      if(!userInfo) return;
    }
    if(path == "share") {
      this.showSharePopup()
      userApi.getDownLoadImg({}).then((res)=>{
        this.setData({
          downLoadImg:res
        })
      })
      return
    }
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

  onHidePopup() {
    this.setData({
      showPopup: false,
    })
  },

  // 点击头部
  onClickHead() {
    wx.navigateTo({
      url: '/dokit/index/index',
    })
  },

  //保存图片
  onSavePicture(){
    const {
      downLoadImg
    } = this.data;
    console.log('downLoadImg.backGroundImg',downLoadImg.backGroundImg)
    wx.downloadFile({
      url: downLoadImg.backGroundImg,
      success: function (res) {
        var benUrl = res.tempFilePath;
        // wx.saveFile({
        //   tempFilePath:benUrl,
        //   success (res) {
        //     const savedFilePath = res.savedFilePath
        //   },
        //   complete(res){
        //     console.log('res',res)
    
        //   }
        // })
        //图片保存到本地相册
        wx.saveImageToPhotosAlbum({
          filePath: benUrl,
          //授权成功，保存图片
          success: function (data) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          //授权失败
          fail: function (err) {
            if (err.errMsg) {//重新授权弹框确认
                wx.showModal({
                  title: '提示',
                  content: '您好,请先授权，在保存此图片。',
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {//重新授权弹框用户点击了确定
                      wx.openSetting({//进入小程序授权设置页面
                        success(settingdata) {
                          console.log(settingdata)
                          if (settingdata.authSetting['scope.writePhotosAlbum']) {//用户打开了保存图片授权开关
                            wx.saveImageToPhotosAlbum({
                              filePath: benUrl,
                              success: function (data) {
                                wx.showToast({
                                  title: '保存成功',
                                  icon: 'success',
                                  duration: 2000
                                })
                              },
                            })
                          } else {//用户未打开保存图片到相册的授权开关
                            wx.showModal({
                              title: '温馨提示',
                              content: '授权失败，请稍后重新获取',
                              showCancel: false,
                            })
                          }
                        }
                      })
                    } 
                  }
                })
            }
          }
        })
      }
    })

  }
})