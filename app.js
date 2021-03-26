import store from './store/index'
import { getSystemInfo } from './utils/tools'

App({
  onLaunch() {
    setTimeout(() => {
      store.data.motto = "改变了"
      console.log(store.data)
    }, 5000)
    
    // 获取设置系统信息
    let systemInfo = getSystemInfo();
    store.data.systemInfo = systemInfo
  },
  globalData: {
    userInfo: null
  }
})
