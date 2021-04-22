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
    wx.login({
      timeout:10000,
      success: (result)=>{
      console.log("🚀 ~ file: index.js ~ line 24 ~ onLoad ~ result", result)
        
      },
    });
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
    debounce(this.checkBindPhone(phoneNumber), 2000)
  },

  // 检查手机是否已被绑定
  checkBindPhone(phoneNumber) {
    loginApis.checkBindPhone({
      phoneNumber,
    }).then(res => {
      this.getMsgCode(phoneNumber);
    }).catch(err => {
      
      console.log("🚀 ~ file: index.js ~ line 86 ~ checkBindPhone ~ err", err)
    });
  },

  // 获取短信验证码
  getMsgCode(phoneNumber) {
    loginApis.getCode({
      phoneNumber,
    }).then(res => {
      wx.showToast({
        title: "验证码已发送，请查收",
        icon: "none"
      })
      this.setData({
        downTime: 60,
      });
    });
  },

  // 绑定手机号
  onBindPhone() {
    const {
      phoneNumber,
      code,
    } = this.data;
    let userInfo = this.data.$.userInfo;
    console.log("🚀 ~ file: index.js ~ line 110 ~ onBindPhone ~ userInfo", userInfo)
    let loginInfo = wx.getStorageSync("LOGIN_INFO");
    console.log("🚀 ~ file: index.js ~ line 111 ~ onBindPhone ~ loginInfo", loginInfo)
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
    console.log("提交");
    loginApis.bindPhone({
      phoneNumber,
      sourceType: 4,
      wxUId: loginInfo.wxUId,
      icon: userInfo.avatarUrl,
      nickName: userInfo.nickName,
      gender: userInfo.gender,
      authCode: code,
    }).then(res => {
      console.log("🚀 ~ 绑定手机号 ~ res", res)
      const data = res.data;
      const loginTo = wx.getStorageSync("LOGIN_TO");
      wx.setStorageSync("ACCESS_TOKEN", data.acessToken);
      wx.setStorageSync("REFRESH_TOKEN", data.refreshToken);
      store.data.userInfo = data.memberInfo;
      if(loginTo) {}
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
    console.log(event.detail.errMsg);
    if (event.detail.errMsg == "getPhoneNumber:ok") {
      let data = event.detail;
      console.log(data)
      // wx.request({
      //   url: 'http://localhost/index/users/decodePhone',
      //   data: {
      //     encryptedData: e.detail.encryptedData,
      //     iv: e.detail.iv,
      //     sessionKey: that.data.session_key,
      //     uid: "",
      //   },
      //   method: "post",
      //   success: function (res) {
      //     console.log(res);
      //   }
      // })
    }
  },

})