import create from '../../../utils/create'
import store from '../../../store/index'
import router from '../../../utils/router'
import { getUserInfo, handleErrorCode, strToParamObj, jumpToAgreement } from '../../../utils/tools'
import { SOURCE_TYPE } from '../../../constants/index'
import loginApis from '../../../apis/login'
import userApis from '../../../apis/user'
import commonApis from '../../../apis/common'
import tools from '../utils/login'

const envList = [
  {
    name: "开发",
    env: "dev",
    value: 1,
  },
  {
    name: "测试",
    env: "uat",
    value: 2,
  },
  {
    name: "预发布",
    env: "fat",
    value: 3,
  },
  {
    name: "生产",
    env: "pro",
    value: 4,
  },
];

// 进入小程序场景值
const codeScene = {
  // 扫描二维码
  1011: true,
  // 长按图片识别二维码
  1012: true,
  // 扫描手机相册中选取的二维码
  1013: true,
  // 扫描小程序码
  1047: true,
  // 长按图片识别小程序码
  1048: true,
  // 扫描手机相册中选取的小程序码
  1049: true,
}

const app = getApp();
create.Page(store, {
  data: {
    showTreaty: false,
    canUseProfile: false,
    radio: false,
    envList,
    changeEnv: app.globalData.changeEnv,
    currentEnv: ''
  },

  onLoad(options) {
    const sysEnv = wx.getStorageSync("SYS_ENV");
    const {
      changeEnv,
      appScene,
    } = app.globalData;
    if(sysEnv && changeEnv) {
      this.setData({
        currentEnv: sysEnv,
      })
    }
    if (wx.getUserProfile) {
      this.setData({
        canUseProfile: true
      })
    } else {
      this.getUserSetting();
    }
    // options.scene = "cf2a02ac71ca987860af70c2171d1512";
    if(!options.scene) {
    } else {
      // 解析解密分享参数
      commonApis.getShareParam(options).then(res => {
        if(!!res.inviteCode) {
          wx.setStorageSync("INVITE_INFO", res);
        }
      });
    }
    if(options.inviteCode) {
      wx.setStorageSync("INVITE_INFO", {
        inviteCode: options.inviteCode,
      });
    }
  },

  // 新API登录
  onLogin: async function() {
    // 生命周期内登录过了
    if(!this.data.radio) {
      wx.showToast({
        title: '请先勾选服务协议和隐私政策',
        icon: 'none',
        mask: false,
      });
      return;
    }
    let userInfo = "";
    if(!!this.data.$.defUserInfo) {
      userInfo = this.data.$.defUserInfo;
    } else {
      try {
        const res = await getUserInfo();
        userInfo = res.userInfo
      } 
      catch(err) {
        return
      }
    }
    this.getCodeLogin(userInfo);
  },
  
  // 进入页面获取用户授权情况 - 旧api登录
  getUserSetting() {
    var that = this;
    //查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          that.getCodeLogin(getUserInfo(false));
        } else {
          //用户没有授权
          console.log("用户没有授权");
          that.setData({ userAuth : false})
        }
      }
    });
  },

  // 点击授权 - 旧api登录
  handleGetUerInfo(res) {
    if(!!res.detail.userInfo){
      this.getCodeLogin(res.detail.userInfo);
    } else {
      console.log("用户按了拒绝按钮")
    }
  },

  // 获取用户openid 登录
  getCodeLogin(userInfo) {
    const that = this;
    wx.login({
      success: (result)=>{
        loginApis.userLogin({
          code: result.code,
          sourceType: SOURCE_TYPE,
        }, {
          notErrorMsg: true,
        }).then(res => {
          const memberInfo = res.memberInfo;
          // store.data.userInfo = memberInfo;
          // store.data.defUserInfo = memberInfo;
          wx.setStorageSync("OPENID", memberInfo.openId);
          tools.setUserInfo(res);
          this.getUserInfo(res.memberInfo);
        }).catch(err => {
          if(err.code === 200102) {
            wx.setStorageSync("LOGIN_INFO", err.data);
            store.data.userInfo = userInfo;
            store.data.defUserInfo = userInfo;
            if(err.data.memberInfo) {
              wx.setStorageSync("OPENID", err.data.memberInfo.openId);
            }
            router.push({
              name: "bindPhone"
            });
          } else {
            handleErrorCode(err.code);
          }
        })
      },
      fail: ()=>{}
    });
    this.setData({ userAuth : true, userInfo: userInfo})
  },

  // 获取用户其他信息
  getUserInfo(userInfo) {
    userApis.getUserInfo({
      id: userInfo.id
    }, {
      showLoading: false,
    }).then(res => {
      store.data.userInfo = res;
      store.data.defUserInfo = res;
      wx.setStorageSync('USER_INFO', res);
      tools.successJump();
    }).catch(err => {
      tools.successJump();
    });
  },

  // 切换环境
  handleChangeEnv({ detail }) {
    wx.setStorageSync("SYS_ENV", detail.value);
  },

  // 勾选条件
  onChangeRadio(event) {
    const {
      radio,
    } = this.data;
    this.setData({
      radio: !radio,
    });
  },

  // 关闭条款弹窗
  onClickTreaty({
    currentTarget
  }) {
    const {
      type
    } = currentTarget.dataset;
    jumpToAgreement(type);
  },

  // 关闭条款弹窗
  onCloseTreaty() {
    this.setData({
      showTreaty: false
    })
  },

  // 不登录
  onToHome() {
    router.goTabbar();
  },

})