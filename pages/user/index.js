import create from '../../utils/create'
import store from '../../store/index'
import router from '../../utils/router'
import { orderList, otherSetting, USER_LEVEL } from '../../constants/user'
import userApi from '../../apis/user'
import { getStorageUserInfo, setStorageUserInfo, showToast } from '../../utils/tools'

const app = getApp();
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
        text: "红包",
        value: 0,
        action: "coupon"
      },
      {
        text: "爱心值",
        value: 600,
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
    app.trackEvent('tab_user');
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
      // userData[2].value = res.integralValue || 0;
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
      // orderTypeList[1].subNum = res.share;
      orderTypeList[1].subNum = res.deliver;
      // orderTypeList[3].subNum = res.receive;
      orderTypeList[3].subNum = res.afterSales;
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
      const userInfo = getStorageUserInfo(true);
      if(!userInfo) return;
      this.showSharePopup()
      return;
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

  // 点击用户数据
  onUserData({
    currentTarget
  }) {
    const {
      data,
    } = currentTarget.dataset;
    if(!!data.action) {
      const userInfo = getStorageUserInfo(true);
      if(data.action == "coupon" && !userInfo) {
        return;
      }
      router.push({
        name: data.action,
      });
    }
  }
})