import create from '../../../utils/create'
import store from '../../../store/index'
import router from '../../../utils/router'
import { debounce, setStorageUserInfo } from '../../../utils/tools'
import loginApis from '../../../apis/login'
import userApis from '../../../apis/user'
import tools from '../utils/login'

create.Page(store, {
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
    let userInfo = this.store.data.userInfo;
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
    let loginInfo = wx.getStorageSync("LOGIN_INFO");
    let inviteInfo = wx.getStorageSync("INVITE_INFO");
    let betaInfo = wx.getStorageSync("BETA_INFO");
    const isInvite = inviteInfo && inviteInfo.inviteCode ? true : false;
    const isBeta = betaInfo && betaInfo.betaCode ? true : false;
    const data = {
      phoneNumber,
      sourceType: 4,
      wxUId: loginInfo.wxUId,
      icon: userInfo.avatarUrl,
      nickName: userInfo.nickName,
      gender: userInfo.gender,
      authCode: code
    };
    if(isInvite) {
      data.inviteCode = inviteInfo.inviteCode;
    }
    if(isBeta) {
      data.testCode = betaInfo.betaCode;
    }
    loginApis.bindPhone(data).then(res => {
      const data = res;
      wx.setStorageSync("ACCESS_TOKEN", data.accessToken);
      wx.setStorageSync("REFRESH_TOKEN", data.refreshToken);
      store.data.userInfo = data.memberInfo;
      store.data.defUserInfo = data.memberInfo;
      tools.setUserInfo(data);
      this.getUserInfo(data.memberInfo, isInvite);
      if(isInvite) {
        wx.removeStorage({
          key: 'INVITE_INFO',
        });
      }
    });
  },

  // 获取用户其他信息
  getUserInfo(userInfo, backHome) {
    userApis.getUserInfo({
      id: userInfo.id
    }, {
      showLoading: false,
    }).then(res => {
      store.data.userOtherInfo = res;
      wx.setStorageSync('USER_INFO', res);
      if(backHome) {
        router.goTabbar();
      } else {
        tools.successJump(2);
      }
    }).catch(err => {
    })
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
        openId: loginInfo.memberInfo.openId,
      }).then(res => {
        that.setData({
          phoneNumber: res.phoneNumber
        })
      })
    }
  },

})