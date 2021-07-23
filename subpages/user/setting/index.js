import create from "../../../utils/create";
import store from "../../../store/index";
import { VERSION } from "../../../constants/index";
import router from "../../../utils/router";
import { jumpToAgreement } from "../../../utils/tools";

create.Page(store, {

  data: {
    version: VERSION,
  },

  onLoad: function (options) {

  },

  onClickService() {
    jumpToAgreement("service");
  },

  onClickPrivacy() {
    jumpToAgreement("privacy");
  },

  // 退出登录
  onLoginOut() {
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
  }
})