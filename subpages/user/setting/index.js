import create from "../../../utils/create";
import store from "../../../store/index";
import { VERSION } from "../../../constants/index";
import router from "../../../utils/router";
import { getStorageUserInfo, jumpToAgreement } from "../../../utils/tools";
import loginApi from "../../../apis/login";

const app = getApp();
create.Page(store, {

  data: {
    version: VERSION,
    userInfo: "",
  },

  onLoad(options) {
    const userInfo = getStorageUserInfo() || "";
    this.setData({
      userInfo
    });
    app.trackEvent('mine_settting');
  },

  onClickService() {
    jumpToAgreement("service");
  },

  onClickPrivacy() {
    jumpToAgreement("privacy");
  },

  // 退出登录
  onLoginOut() {
    const {
      userInfo,
    } = this.data;
    store.data.hasUserInfo = false;
    store.data.userInfo = "";
    store.data.userOtherInfo = "";
    store.data.defUserInfo = "";
    wx.removeStorageSync("ACCESS_TOKEN");
    wx.removeStorageSync("REFRESH_TOKEN");
    wx.removeStorageSync("USER_INFO");
    wx.removeStorageSync("USER_OTHER_INFO");
    wx.removeStorageSync("OPENID");
    router.goTabbar();

    loginApi.loginOut({
      id: userInfo.id,
    }, {
      showLoading: false
    }).then(res => {
      // console.log("退出登录", res);
    });
  }
})