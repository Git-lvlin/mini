import { apiUrl } from "../constants/index"


// 获取当前环境接口域名
export const getBaseApiUrl = () => {
  let url = apiUrl
  return url;
}


// 错误码处理
export const handleErrorCode = ({
  code,
  msg,
  mustLogin = false,
}) => {
  switch(code) {
    case 10010:
      // 未登录
      if(mustLogin) {
        showLogin();
      } else {
        showErrorMsg("您还未登录，请登录");
      }
      break;
    case 10011:
      // 服务不可用
      showErrorMsg("服务暂不可用，请稍后重试");
      break;
    case 10012:
      // 限流
      showErrorMsg("当前访问人数较多，请稍后重试");
      // router
      break;
    case 10013:
      // 系统升级 服务不可用
      showErrorMsg("系统升级中，请稍后重试");
      break;
    case 10014:
      // accessToken 无效
      showErrorMsg("刷新token");
      break;
    case 10015:
      // refreshToken 无效
      showErrorMsg("刷新token");
      break;
    case 10016:
      // 请求地址不存在
      showErrorMsg("服务暂不可用，请稍后重试");
      break;
    case 10017:
      // 黑名单用户
      showErrorMsg("暂不可用，请联系客服");
      break;
    case 10018:
      // 系统异常
      showErrorMsg("系统异常");
      break;
    case 10110:
      // 业务错误
      showErrorMsg(msg);
      break;
    default:
      showErrorMsg()
  }
};


// 获取/更新系统信息
export const getSystemInfo = () => {
  let systemInfo = {}
  let data = wx.getSystemInfoSync();
  // 得到右上角菜单的位置尺寸
  const menuButtonObject = wx.getMenuButtonBoundingClientRect();
  const { top, height } = menuButtonObject;
  let rpxRatio = 750/data.windowWidth;
  systemInfo = {
    // 像素比
    pixelRatio: data.pixelRatio,
    // 宽度像素比
    rpxRatio,
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
    // 右上角按钮参数 px
    menuButton: menuButtonObject,
    // 操作系统及版本
    system: data.system
  };
  // 计算导航栏的高度
  // 此高度基于右上角菜单在导航栏位置垂直居中计算得到 单位rpx
  // systemInfo.menuToNavHeight = (top - systemInfo.statusBarHeight) * rpxRatio;
  systemInfo.menuToNavHeight = (top - systemInfo.statusBarHeight) * data.pixelRatio;
  systemInfo.navBarHeight = (height + (top - systemInfo.statusBarHeight) * 2) * rpxRatio;
  systemInfo.statusHeight = systemInfo.statusBarHeight * rpxRatio;
  systemInfo.navTotalHeight = systemInfo.statusHeight + systemInfo.navBarHeight;
  systemInfo.bottomBarHeight = (data.screenHeight - data.safeArea.bottom) * rpxRatio
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


/**
 * profile boolean 自定义使用获取用户信息API
*/
export const getUserInfo = (profile) => {
  let useProfile = !!wx.getUserProfile ? true : false;
  if(profile !== undefined) {
    useProfile = !!profile
  };
  if(useProfile) {
    return wx.getUserProfile({
      desc: '用于完善您的会员资料',
      lang: 'zh_CN',
    });
  } else {
    return wx.getUserInfo({
      lang: "zh_CN",
    });
  }
};


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