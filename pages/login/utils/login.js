import router from "../../../utils/router";
import { setStorageUserInfo } from "../../../utils/tools";

export default {
  // 设置登录信息
  setUserInfo(data) {
    // setStorageUserInfo(data.memberInfo);
    wx.setStorageSync("ACCESS_TOKEN", data.accessToken);
    wx.setStorageSync("REFRESH_TOKEN", data.refreshToken);
    wx.setStorageSync("USER_INFO", data.memberInfo);
    wx.setStorageSync("LOGIN_OVER", false);
    wx.removeStorageSync('INVITE_INFO');
    wx.removeStorage({
      key: 'LOGIN_INFO',
    });
  },

  // 登录成功跳转
  successJump(delta = 1) {
    const loginToData = wx.getStorageSync("LOGIN_TO_DATA");
    if(loginToData) {
      router.loginTo(loginToData);
    } else {
      router.loginTo({
        type: "back",
        delta,
      });
    }
  },
}