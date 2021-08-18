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
    // 下载文件  
    wx.downloadFile({
      url: downLoadImg.backGroundImg,
      success: function (res) {
        console.log("下载文件：success");
        console.log(res);

        // 保存图片到系统相册  
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            console.log("保存图片：success");
            wx.showToast({
              title: '保存成功',
            });
          },
          fail(res) {
            console.log("保存图片：fail");
            console.log(res);
          }
        })
      },
      fail: function (res) {
        console.log("下载文件：fail");
        console.log(res);
      }
    })
  },
  onSavePicClick: function (e) {
    var that = this;
    console.log("onSavePicClick");
    console.log(e);
    var downloadUrl = e.currentTarget.dataset.img;

    if (!wx.saveImageToPhotosAlbum) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
      return;
    }

    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.writePhotosAlbum" 这个 scope  
    wx.getSetting({

      success(res) {
        console.log("getSetting: success");
        if (!res.authSetting['scope.writePhotosAlbum']) {
          // 接口调用询问  
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.downloadImage(downloadUrl);
            },
            fail() {
              // 用户拒绝了授权  
              wx.showModal({
                title: '保存图片',
                content: '保存图片需要您授权',
                showCancel: true,
                confirmText: '确定',

                success: function (res) {
                  if (res.confirm) {
                    console.log(12134);
                    // 打开设置页面  
                    wx.openSetting({
                      success: function (data) {
                        if (data.authSetting['scope.writePhotosAlbum']) {
                          console.log("授权成功");
                          that.downloadImage(downloadUrl);
                        } else {
                          console.log("授权失败");
                        }
                      },
                      fail: function (data) {
                        console.log("openSetting: fail");
                      }
                    });
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }

                }
              })



            }
          })
        } else {
          that.downloadImage(downloadUrl)
        }
      },
      fail(res) {
        console.log("getSetting: fail");
        console.log(res);
      }

    })

  }
})