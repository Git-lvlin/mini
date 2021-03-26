import { apiUrl } from "../constants/index"

// 获取当前环境接口域名
export const getBaseApiUrl = () => {
  let url = apiUrl
  return url;
}

// 获取/更新系统信息
export const getSystemInfo = () => {
  let systemInfo = {}
  let data = wx.getSystemInfoSync();
  systemInfo = {
    // 像素比
    pixelRatio: data.pixelRatio,
    // 屏幕宽度 px
    screenWidth: data.screenWidth,
    // 屏幕高度 px
    screenHeight: data.screenHeight,
    // 可使用窗口宽度，单位px
    windowWidth: data.windowWidth,
    // 可使用窗口高度，单位px
    windowHeight: data.windowHeight,
    // 状态栏的高度，单位px
    statusBarHeight: data.statusBarHeight,
    // 微信版本号
    version: data.version,
    // 客户端基础库版本
    SDKVersion: data.SDKVersion,
    // 在竖屏正方向下的安全区域
    safeArea: data.safeArea,
    // 操作系统及版本
    system: data.system
  };
  // 得到右上角菜单的位置尺寸
  const menuButtonObject = wx.getMenuButtonBoundingClientRect();
  const { top, height } = menuButtonObject;
  // 计算导航栏的高度
  // 此高度基于右上角菜单在导航栏位置垂直居中计算得到
  systemInfo.navBarHeight = height + (top - systemInfo.statusBarHeight) * 2;
  systemInfo.statusHeight = systemInfo.statusBarHeight * 2;
  if(data.system.indexOf("iOS")) {
    // iOS 苹果手机
    systemInfo.phoneType = 1
  } else if(data.system.indexOf("Android")) {
    // 安卓手机
    systemInfo.phoneType = 2
  } else {
    // 其他手机
    systemInfo.phoneType = 3
  }
  return systemInfo
}


// 防抖
export const debounce = (func, wait) => {
  if (typeof func !== 'function') {
    throw new TypeError('need a function');
  }
  wait = +wait || 0;
  let timeId = null;
  return function () {
    const self = this;
    const args = arguments;
    if (timeId) {
      clearTimeout(timeId);
    }
    timeId = setTimeout(() => {
      func.apply(self, args);
    }, wait);
  }
}

// 节流
export const throttle = (func, wait) => {
  if (typeof func !== 'function') {
    throw new TypeError('need a function');
  }
  wait = +wait || 0;
  let valid = true
  let timeId = null;
  return function() {
    const self = this;
    const args = arguments;
    if(!valid){
      //休息时间 暂不接客
      return false 
    }
    // 工作时间，执行函数并且在间隔期内把状态位设为无效
    valid = false
    timeId = setTimeout(() => {
      func.apply(self, args);
      valid = true;
      clearTimeout(timeId);
    }, wait)
  }
}

// 取url参数
export const getQueryString = (name) => {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}