import store from './store/index'
import uma from './libs/uma'
import { getSystemInfo, getStorageUserInfo } from './utils/tools'
import commonApi from './apis/common'
import md5 from './utils/md5'
import router from './utils/router'
import { SYS_ENV, CHANGE_ENV } from './constants/index'

App({
  umengConfig:{
    //由友盟分配的APP_KEY
    appKey: '617f5bace0f9bb492b46419c',
    // 是否使用openid进行统计，此项为false时将使用友盟+随机ID进行用户统计。
    // 使用openid来统计微信小程序的用户，会使统计的指标更为准确，对系统准确性要求高的应用推荐使用OpenID。
    useOpenid: true,
    // 是否需要通过友盟后台获取openid，如若需要，请到友盟后台设置appId及secret
    autoGetOpenid: true,
    //是否打开调试模式
    debug: false,
    // 上传用户信息，上传后可以查看有头像的用户分享信息，同时在查看用户画像时，公域画像的准确性会提升。
    uploadUserInfo: true
  },

  onLaunch() {
    // this.globalData.appScene = scene;
    const userInfo = getStorageUserInfo();
    store.data.userInfo = userInfo;
    store.data.defUserInfo = userInfo;
    // store.data.userOtherInfo = wx.getStorageSync("USER_OTHER_INFO");
    setTimeout(() => {
      console.log(store.data)
    }, 2000)
    
    // 获取设置系统信息
    let systemInfo = getSystemInfo();
    store.data.systemInfo = systemInfo;
    // 设置环境变量 dev uat fat pro
    wx.setStorageSync('SYS_ENV', SYS_ENV);

    // 
    // commonApi.getResourceDetail({
    //   resourceKey: "TABBAR",
    //   timeVersion: new Date().getTime()
    // }).then(res => {
    //   console.log("🚀 ~ res", res)
    // }).catch(err => {
    //   console.log("🚀 ~ err", err) 
    // }) ;

    // 小程序检查更新
    this.updateManager();
  },

  onShow(options) {
    const {
      scene,
    } = options;
    this.globalData.appScene = scene;
    
    // 生成设备码校验是否填写邀请码
    // this.getInputCode();
  },

  globalData: {
    appScene: 1001,
    userInfo: null,
    changeEnv: CHANGE_ENV,
    uma: uma,
  },

  // 生成设备码校验是否填写邀请码
  getInputCode() {
    if(SYS_ENV === "dev") return;
    const deviceCode = wx.getStorageSync("DEVICE_CODE");
    const isInputInvite = wx.getStorageSync("IS_INPUT_INVITE");
    if(!!deviceCode && !!isInputInvite) return;
    wx.getSystemInfo({
      success (res) {
        const {
          system,
          version,
          model,
        } = res;
        const nonceStr = Math.random().toString(32).slice(-10);
        const tempTime = new Date().getTime();
        const code = md5(`${system}${version}${model}${nonceStr}${tempTime}`);
        commonApi.getInviteCode({}, {
          showLoading: false,
          header: {
            d: code,
          }
        }).then(res => {
          if(!res.invite) {
            wx.setStorage({
              key: 'DEVICE_CODE',
              data: code,
            });
            router.replace({
              name: "invitation",
              frist: true,
            })
          }
        });
      }
    })
  },

  // 小程序更新
  updateManager() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

  // 埋点数据上报
  trackEvent(eventId, params = {}) {
    if(!eventId) return;
    wx.uma.trackEvent(eventId, params);
  },
})
