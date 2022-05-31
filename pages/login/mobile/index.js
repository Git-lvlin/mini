import create from '../../../utils/create'
import store from '../../../store/index'
import router from '../../../utils/router'
import { getUserInfo, handleErrorCode, strToParamObj, jumpToAgreement, showModal, debounce, showToast } from '../../../utils/tools'
import { SOURCE_TYPE } from '../../../constants/index'
import loginApis from '../../../apis/login'
import userApis from '../../../apis/user'
import commonApis from '../../../apis/common'
import tools from '../utils/login'
import { IMG_CDN } from '../../../constants/common'

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
  use: ['systemInfo'],
  loginCode: "",
  getShareConut: 1,

  computed: {
    supportLogin() {
      const systemInfo = this.systemInfo;
      const state = systemInfo.platform == 'ios' && systemInfo.environment == 'wxwork' ? false : true;
      if(!state) {
        showModal({
          content: "非常抱歉，苹果手机的企业微信用户暂不支持登录小程序，请前往微信内登录",
          showCancel: false,
        })
      }
      return state;
    }
  },

  data: {
    showTreaty: false,
    canUseProfile: false,
    selectIcon: `${IMG_CDN}miniprogram/common/def_choose.png`,
    selectedIcon: `${IMG_CDN}miniprogram/common/choose.png`,
    radio: false,
    envList,
    changeEnv: app.globalData.changeEnv,
    currentEnv: '',
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
    // 获取进入小程序场景值
    // if(codeScene[appScene]) {
      // options.scene = "cf2a02ac71ca987860af70c2171d1512";
    if(!options.scene) {
      console.log("未获取到解析参数", options);
    } else {
      this.getShareParam(options);
    }
    // }
    if(options.inviteCode) {
      wx.setStorageSync("INVITE_INFO", {
        inviteCode: options.inviteCode,
      });
    }
    app.trackEvent('login_index');
  },

  // 获取分享配置
  getShareParam(data) {
    commonApis.getShareParam({
      scene: data.scene,
    }, {
      notErrorMsg: true,
    }).then(res => {
      // const param = strToParamObj(res);
      const param = res;
      wx.removeStorage({
        key: 'SHARE_SCENE'
      });
      if(!!param.inviteCode) {
        wx.setStorageSync("INVITE_INFO", param);
      }
      if(this.getShareConut > 3) {
        showToast({ title: "参数获取成功，请登录" });
      }
    }).catch(err => {
      if(this.getShareConut < 3) {
        this.getShareConut += 1;
        debounce(() => {
          this.getShareParam(data);
        }, 200)();
      } else {
        this.handleGetShareScene(data);
        wx.setStorageSync("SHARE_SCENE", data.scene);
      }
    })
  },

  // 解析分享参数失败
  handleGetShareScene(data) {
    const that = this;
    showModal({
      content: "缺少必要参数，请检查网络连接",
      confirmText: "重试",
      ok() {
        that.getShareConut += 1;
        that.getShareParam({
          scene: data.scene,
        });
      },
    })
  },

  // 获取code 获取code 需要前置，所有用tap
  getCode(){
    const that = this;
    wx.login({
      success(result) {
        that.loginCode = result.code
      }
    });
  },

  // 提示勾选隐私政策
  onTiplogin() {
    if(!this.data.radio) {
      wx.showToast({
        title: '请先勾选用户服务协议与隐私政策',
        icon: 'none',
        mask: false,
      });
      return;
    }
  },

  // 获取用户mobile 登录
  getCodeLogin(event) {
    app.trackEvent('login_auth_wechat_button_click');
    const that = this;
    // 生命周期内登录过了
    if(!this.data.radio) {
      wx.showToast({
        title: '请先勾选用户服务协议与隐私政策',
        icon: 'none',
        mask: false,
      });
      return;
    }
    const eventData = event.detail || {};
    const agreenLogin = eventData.errMsg == "getPhoneNumber:ok" ? true : false;
    const scene = wx.getStorageSync("SHARE_SCENE") || "";
    if(!!scene && agreenLogin) {
      this.handleGetShareScene({
        scene
      });
      return;
    }
    if (agreenLogin) {
      // wx.login({
      //   success: (result)=>{
          loginApis.userLogin({
            code: that.loginCode,
            sourceType: SOURCE_TYPE,
          }, {
            notErrorMsg: true,
          }).then(res => {
            const memberInfo = res.memberInfo;
            eventData.openId = memberInfo.openId;
            eventData.uId = memberInfo.uId;
            wx.setStorageSync("OPENID", memberInfo.openId);
            tools.setUserInfo(res);
            this.getUserInfo(res.memberInfo);
            // commonApis.runOverList();
          }).catch(err => {
            if(err.code === 200102) {
              wx.setStorageSync("LOGIN_INFO", err.data);
              if(err.data.memberInfo) {
                const memberInfo = err.data.memberInfo;
                wx.setStorageSync("OPENID", memberInfo.openId);
                eventData.openId = memberInfo.openId;
                eventData.uId = memberInfo.uId;
                // 旧绑定流程 - 2022-02-17
                // this.handleGetPhone(eventData);
                // 新绑定流程 - 2022-02-17
                this.notCodeBindMobileLogin(eventData);
              }
            } else {
              handleErrorCode({
                code: err.code,
                msg: err.msg,
              });
            }
          })
      //   },
      // });
    }
  },

  // 无验证码解密手机号直接绑定登录
  notCodeBindMobileLogin(uInfo) {
    const inviteInfo = wx.getStorageSync("INVITE_INFO");
    const betaInfo = wx.getStorageSync("BETA_INFO");
    const isInvite = inviteInfo && inviteInfo.inviteCode ? true : false;
    const isBeta = betaInfo && betaInfo.betaCode ? true : false;
    const data = {
      sourceType: 4,
      encryptedData: uInfo.encryptedData,
      iv: uInfo.iv,
      openId: uInfo.openId,
      wxUId: uInfo.uId,
    };
    if(isInvite) {
      data.inviteCode = inviteInfo.inviteCode;
    }
    if(isBeta) {
      data.testCode = betaInfo.betaCode;
    }
    loginApis.notCodeBindMobileLogin(data, {
      showLoading: false,
    }).then(res => {
      console.log("🚀 ~ file: index.js ~ line 269 ~ notCodeBindMobileLogin ~ res", res)
      const result = res;
      wx.setStorageSync("ACCESS_TOKEN", result.accessToken);
      wx.setStorageSync("REFRESH_TOKEN", result.refreshToken);
      tools.setUserInfo(result);
      if(isInvite) {
        wx.setStorageSync("INVITE_REGISTER", true);
        wx.removeStorage({
          key: 'INVITE_INFO',
        });
      }
      this.getUserInfo(result.memberInfo);
    });
  },
  
  // 获取手机号
  handleGetPhone(data) {
    loginApis.getPhoneNumber({
      encryptedData: data.encryptedData,
      iv: data.iv,
      openId: data.openId,
    }, {
      showLoading: false,
    }).then(res => {
      data.phoneNumber = res.phoneNumber;
      this.onBindPhone(data);
    });
  },

  // 绑定手机号
  onBindPhone(uInfo) {
    const inviteInfo = wx.getStorageSync("INVITE_INFO");
    const betaInfo = wx.getStorageSync("BETA_INFO");
    const isInvite = inviteInfo && inviteInfo.inviteCode ? true : false;
    const isBeta = betaInfo && betaInfo.betaCode ? true : false;
    const data = {
      phoneNumber: uInfo.phoneNumber,
      sourceType: 4,
      wxUId: uInfo.uId,
    };
    if(isInvite) {
      data.inviteCode = inviteInfo.inviteCode;
    }
    if(isBeta) {
      data.testCode = betaInfo.betaCode;
    }
    loginApis.notCodeBind(data, {
      showLoading: false,
    }).then(res => {
      const result = res;
      wx.setStorageSync("ACCESS_TOKEN", result.accessToken);
      wx.setStorageSync("REFRESH_TOKEN", result.refreshToken);
      // store.data.userInfo = data.memberInfo;
      // store.data.defUserInfo = data.memberInfo;
      tools.setUserInfo(result);
      if(isInvite) {
        wx.setStorageSync("INVITE_REGISTER", true);
        wx.removeStorage({
          key: 'INVITE_INFO',
        });
      }
      this.getUserInfo(result.memberInfo);
    });
  },

  // 获取用户其他信息
  getUserInfo(userInfo) {
    userApis.getUserInfo({
      id: userInfo.id
    }, {
      showLoading: false,
    }).then(res => {
      // store.data.userInfo = res;
      // store.data.defUserInfo = res;
      wx.setStorageSync('USER_INFO', res);
      tools.successJump();
    }).catch(err => {
      tools.successJump();
    });
  },

  // 切换环境
  handleChangeEnv({ detail }) {
    wx.setStorageSync("SYS_ENV", detail.value);
    wx.removeStorage({
      key: 'HOME_FLOOR'
    });
    wx.removeStorage({
      key: 'HOME_CACHE'
    });
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