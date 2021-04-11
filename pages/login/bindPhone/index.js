import create from '../../../utils/create'
import store from '../../../store/index'
import router from '../../../utils/router'
import { IMG_CDN } from '../../../constants/common'
import day from 'dayjs' 
import { getList } from '../../../apis/home'

create.Page(store, {
  use: [
    'motto'
  ],

  data: {
    inputFocus: false,
  },

  onLoad(options) {
  },

  // 点击获取验证码
  onInputCode() {
    this.setData({
      inputFocus: true,
    })
  },

  // 监听输入验证码
  handleInputCode(event) {
  console.log("🚀 ~ file: index.js ~ line 28 ~ handleInputCode ~ event", event)
    
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