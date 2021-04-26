import create from '../../../utils/create'
import store from '../../../store/index'
import router from '../../../utils/router'
import { debounce } from '../../../utils/tools'
import loginApis from '../../../apis/login'

create.Page(store, {
  use: [
    'motto'
  ],

  data: {
    phoneNumber: "",
    code: "",
    inputFocus: false,
    inputNum: [],
    downTime: 0,
    timeData: {},
  },

  onLoad(options) {
  },

  handleInputPhone(e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },

  // 点击输入验证码
  onInputCode() {
    this.setData({
      inputFocus: true,
    })
  },

  // 监听时间变化
  onChangeTime(e) {
    this.setData({
      timeData: e.detail,
    });
    if(e.detail.seconds === 0) {
      this.setData({
        downTime: 0,
      });
    }
  },

  // 点击获取验证码
  onGetCode() {
    const phoneNumber = this.data.phoneNumber;
    if(!phoneNumber) {
      wx.showToast({
        title: "请获取/输入手机号码",
        icon: "none"
      })
      return
    }
    if(phoneNumber.length !== 11) {
      wx.showToast({
        title: "请输入正确手机号码",
        icon: "none"
      })
      return
    }
    this.checkBindPhone(phoneNumber);
  },

  // 检查手机是否已被绑定
  checkBindPhone(phoneNumber) {
    loginApis.checkBindPhone({
      phoneNumber,
    }).then(res => {
      this.getMsgCode(phoneNumber);
    }).catch(err => {
      console.log("checkBindPhone ~ err", err)
    });
  },

  // 获取短信验证码
  getMsgCode(phoneNumber) {
    let that = this;
    loginApis.getCode({
      phoneNumber,
    }).then(res => {
      wx.showToast({
        title: "验证码已发送，请查收",
        icon: "none"
      })
      that.setData({
        downTime: 59999,
      });
    }).catch(err => {

    });
  },

  // 绑定手机号
  onBindPhone() {
    const {
      phoneNumber,
      code,
    } = this.data;
    let userInfo = this.data.$.userInfo;
    let loginInfo = wx.getStorageSync("LOGIN_INFO");
    if(!phoneNumber) {
      wx.showToast({
        title: "请获取/输入手机号码",
        icon: "none"
      })
      return
    }
    if(phoneNumber.length !== 11) {
      wx.showToast({
        title: "请输入正确手机号码",
        icon: "none"
      })
      return
    }
    if(!code) {
      wx.showToast({
        title: "请输入验证码",
        icon: "none"
      })
      return
    }
    if(code.length !== 4) {
      wx.showToast({
        title: "请输入正确验证码",
        icon: "none"
      })
      return
    }
    loginApis.bindPhone({
      phoneNumber,
      sourceType: 4,
      wxUId: loginInfo.wxUId,
      icon: userInfo.avatarUrl,
      nickName: userInfo.nickName,
      gender: userInfo.gender,
      authCode: code,
    }).then(res => {
      const data = res;
      const loginToData = wx.getStorageSync("LOGIN_TO_DATA");
      wx.setStorageSync("ACCESS_TOKEN", data.acessToken);
      wx.setStorageSync("REFRESH_TOKEN", data.refreshToken);
      store.data.userInfo = data.memberInfo;
      store.data.defUserInfo = data.memberInfo;
      if(loginToData) {
        router.loginTo(loginToData);
      } else {
        router.loginTo();
      }
    });
  },

  // 监听输入验证码
  handleInputCode(event) {
    let value = event.detail.value
    let inputNum = value.split("");
    this.setData({
      inputNum,
      code: value,
    })
  },

  // 点击获取手机号
  handleGetPhone(event) {
    var that = this;
    if (event.detail.errMsg == "getPhoneNumber:ok") {
      let data = event.detail;
      let loginInfo = wx.getStorageSync("LOGIN_INFO");
      loginApis.getPhoneNumber({
        encryptedData: data.encryptedData,
        iv: data.iv,
        wxUId: loginInfo.wxUId,
      }).then(res => {
        that.setData({
          phoneNumber: res.phoneNumber
        })
      })
    }
  },

})