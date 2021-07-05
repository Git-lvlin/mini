import create from '../../utils/create'
import store from '../../store/index'
import router from '../../utils/router'
import { orderList, otherSetting, USER_LEVEL } from '../../constants/user'
import userApi from '../../apis/user'
import { getStorageUserInfo, setStorageUserInfo } from '../../utils/tools'

create.Page(store, {
  use: [
    'systemInfo',
    'motto'
  ],

  data: {
    orderTypeList: orderList,
    otherSetting,
    userAuth: true,
    canUseUserProfile: true,
    banner: "",
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
      orderTypeList[3].subNum = res.receive;
      orderTypeList[4].subNum = res.afterSales;
      this.setData({
        orderTypeList,
      })
    })
  },

  // 跳转登录
  onToLogin() {
    router.push({
      name: "login"
    })
  },

  // 点击其他功能模块
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

  // 点击头部
  onClickHead() {
    wx.navigateTo({
      url: '/dokit/index/index',
    })
  },
})