import store from './store/index'
import { getSystemInfo } from './utils/tools'
import { getResourceDetail } from './apis/common'

App({
  onLaunch() {
    setTimeout(() => {
      store.data.motto = "改变了"
      console.log(store.data)
    }, 5000)
    
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
