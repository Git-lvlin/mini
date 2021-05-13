import store from './store/index'
import { getSystemInfo, getStorageUserInfo } from './utils/tools'
import { getResourceDetail } from './apis/common'

App({
  onLaunch() {
    store.data.userInfo = getStorageUserInfo();
    store.data.defUserInfo = getStorageUserInfo();
    setTimeout(() => {
      store.data.motto = "改变了12111111"
      console.log(store.data)
    }, 2000)
    
    // 获取设置系统信息
    let systemInfo = getSystemInfo();
    store.data.systemInfo = systemInfo;

    // 
    // getResourceDetail({
    //   resourceKey: "TABBAR",
    //   timeVersion: new Date().getTime()
    // }).then(res => {
    //   console.log("🚀 ~ res", res)
    // }).catch(err => {
    //   console.log("🚀 ~ err", err) 
    // }) ;
  },

  globalData: {
    userInfo: null
  }
})
