import create from '../../../utils/create'
import store from '../../../store/index'
import router from '../../../utils/router'
import { IMG_CDN } from '../../../constants/common'
import day from 'dayjs' 
import { getCode } from '../../../apis/login'

create.Page(store, {
  use: [
    'motto'
  ],

  data: {
    inputFocus: false,
    inputNum: [],
    downTime: 0,
    timeData: {},
  },

  onLoad(options) {
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
    getCode({
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

  // 监听输入验证码
  handleInputCode(event) {
  console.log("🚀 ~ event", event.detail.value)
    let value = event.detail.value
    let inputNum = value.split("");
    this.setData({
      inputNum
    })
    console.log("🚀 ~ handleInputCode ~ inputNum", this.data.inputNum)
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