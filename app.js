import store from './store/index'
import { getSystemInfo, getStorageUserInfo } from './utils/tools'
import commonApi from './apis/common'
import md5 from './utils/md5'
import router from './utils/router'

// 环境变量 dev uat fat pro
// ***【 环境如有变动 common.wxs 需更换域名 】***
const SYS_ENV = 'dev';
// 是否显示选择环境按钮
const CHANGE_ENV = true;

App({
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
    // 设置环境变量 dev test prod
    wx.setStorageSync('SYS_ENV', SYS_ENV);

    // 生成设备码校验是否填写邀请码
    this.getInputCode();

    // 
    // commonApi.getResourceDetail({
    //   resourceKey: "TABBAR",
    //   timeVersion: new Date().getTime()
    // }).then(res => {
    //   console.log("🚀 ~ res", res)
    // }).catch(err => {
    //   console.log("🚀 ~ err", err) 
    // }) ;
  },

  onShow(options) {
    const {
      scene,
    } = options;
    this.globalData.appScene = scene;
  },

  globalData: {
    appScene: 1001,
    userInfo: null,
    changeEnv: CHANGE_ENV,
  },

  // 生成设备码校验是否填写邀请码
  getInputCode() {
    if(SYS_ENV === "dev") return;
    const device_code = wx.getStorageSync("DEVICE_CODE");
    if(device_code) return;
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
})
