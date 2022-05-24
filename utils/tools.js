import { baseApi } from "../constants/index"
import routes from "../constants/routes"
import store from "../store/index"
import commonApi from '../apis/common'
import router from "../utils/router"
import dayjs from '../miniprogram_npm/dayjs/index.js'
import relativeTime from './dayjsplugin/relativeTime'
import util from "./util"
import { agreementUrl, ossHost } from "../constants/common"

dayjs.extend(relativeTime);

// 获取当前环境接口域名
export const getBaseApiUrl = () => {
  const env = wx.getStorageSync("SYS_ENV") || 'pro';
  return baseApi[env];
}

// 获取图片最新cdn地址
export const getImgCdn = () => {
  const env = wx.getStorageSync("SYS_ENV");
  return ossHost[env];
};

// 提示信息
const showErrorMsg = (msg, icon) => {
  wx.showToast({
    title: !!msg ? msg : '哎呀，出错啦，请重试',
    icon: !!icon ? icon : "none",
    duration: 2000,
  });
};

// 错误码处理
export const handleErrorCode = ({
  params = {},
  code,
  msg,
  mustLogin = false,
}) => {
  switch(code) {
    case 10010:
      // 未登录
      // if(mustLogin) {
      //   showLogin();
      // } else {
        // showErrorMsg("您还未登录，请登录");
        if(!store.data.showLoginMobel) {
          clearLoginInfo();
          store.data.showLoginMobel = true;
          showModal({
            content: "您还未登录，请登录",
            confirmText: "去登录",
            ok() {
              store.data.showLoginMobel = false;
              router.push({
                name: "mobile"
              })
            },
            cancel() {
              store.data.showLoginMobel = false;
            }
          })
        }
      // }
      break;
    case 10011:
      // 服务不可用
      showErrorMsg(msg || "服务暂不可用，请稍后重试");
      break;
    case 10012:
      // 限流
      showErrorMsg(msg || "当前访问人数较多，请稍后重试");
      // router
      break;
    case 10013:
      // 系统升级 服务不可用
      const pages = getCurrentPages();
      if(!pages.length) { return }
      const curUrl = `/${pages[pages.length - 1].route}`;
      if(routes["maintain"].path == curUrl) {
        showErrorMsg(msg || "系统维护中，请稍后重试");
      } else {
        router.replace({
          name: "maintain",
          frist: true,
        })
      }
      break;
    case 10014:
      // accessToken 无效
      // wx.setStorageSync("LOGIN_OVER", true);
      // commonApi.refreshToken();
      // let overList = wx.getStorageSync("OVER_LIST");
      // overList = !!overList ? overList : [];
      // overList.push(params);
      // wx.setStorageSync("OVER_LIST", overList);
      // showErrorMsg("刷新token");
      break;
    case 10015:
      // refreshToken 无效
      // showErrorMsg("登录过期，请重新登录");
      break;
    case 10016:
      // 请求地址不存在
      showErrorMsg(msg || "服务暂不可用，请稍后重试");
      break;
    case 10017:
      // 黑名单用户
      showErrorMsg(msg || "暂不可用，请联系客服");
      break;
    case 10018:
      // 系统异常
      showErrorMsg(msg || "系统异常");
      break;
    case 10110:
      // 业务错误
      showErrorMsg(msg);
      break;
    default:
      showErrorMsg(!!msg ? msg : "")
  }
};

// 显示toast 提示
export const showToast = ({
  title,
  icon = "none",
  ok = () => {},
}) => {
  wx.showToast({
    title,
    icon,
    success() {
      const timer = setTimeout(() => {
        ok();
      }, 1500)
    }
  })
}

// 显示Modal提示
export const showModal = ({
  title = "",
  content,
  cancelColor = "#999",
  cancelText = "取消",
  confirmColor = "#D7291D",
  confirmText = "确定",
  showCancel = true,
  ok = () => {},
  cancel = () => {},
}) => {
  wx.showModal({
    title,
    content,
    showCancel,
    cancelText,
    cancelColor,
    confirmText,
    confirmColor,
    success(res) {
      if (res.confirm) {
        ok();
      } else if(res.cancel) {
        cancel();
      }
    }
  })
}


// 获取/更新系统信息
export const getSystemInfo = () => {
  let systemInfo = {}
  let data = wx.getSystemInfoSync();
  // 得到右上角菜单的位置尺寸
  const menuButtonObject = wx.getMenuButtonBoundingClientRect();
  const { top, height } = menuButtonObject;
  let rpxRatio = 750/data.windowWidth;
  systemInfo = {
    ...data,
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
  systemInfo.navHeight = (height + (top - systemInfo.statusBarHeight) * 2);
  systemInfo.navBarHeight = (height + (top - systemInfo.statusBarHeight) * 2) * rpxRatio;
  systemInfo.statusHeight = systemInfo.statusBarHeight * rpxRatio;
  systemInfo.navTotalHeightPx = systemInfo.navHeight + systemInfo.statusBarHeight;
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

/**
 * 获取本地用户信息
 * showLogin boolean 是否显示登录提醒
*/
export const getStorageUserInfo = (showLogin, goBack) => {
  const userInfo = wx.getStorageSync("USER_INFO") || "";
  if(showLogin && !userInfo) {
    showModal({
      content: "您还未登录，请登录",
      confirmText: "去登录",
      ok() {
        router.push({
          name: "mobile"
        })
      },
      cancel() {
        !!goBack && router.go();
      },
    })
  }
  return userInfo;
};

// 退出登录
export const clearLoginInfo = (jump) => {
  store.data.hasUserInfo = false;
  store.data.userInfo = "";
  store.data.userOtherInfo = "";
  store.data.defUserInfo = "";
  wx.removeStorageSync("ACCESS_TOKEN");
  wx.removeStorageSync("REFRESH_TOKEN");
  wx.removeStorageSync("USER_INFO");
  wx.removeStorageSync("USER_OTHER_INFO");
  wx.removeStorageSync("OPENID");
  jump && router.goTabbar();
}

/**
 * 设置本地用户信息
 * userInfo object 用户信息
*/
export const setStorageUserInfo = userInfo => {
  wx.setStorageSync("USER_INFO", userInfo);
};


// 防抖
let debounceTimeId = null;
export const debounce = (func, wait) => {
  if (typeof func !== 'function') {
    throw new TypeError('need a function');
  }
  wait = +wait || 0;
  return function () {
    const self = this;
    const args = arguments;
    if (debounceTimeId) {
      clearTimeout(debounceTimeId);
    }
    debounceTimeId = setTimeout(() => {
      func.apply(self, args);      
    }, wait);
  }
}

// 节流
let throttleTimeId = null;
let throttleValid = true
export const throttle = (func, wait) => {
  if (typeof func !== 'function') {
    throw new TypeError('need a function');
  }
  wait = +wait || 0;
  return function() {
    const self = this;
    const args = arguments;
    if(!throttleValid){
      //休息时间 暂不接客
      return false 
    }
    // 工作时间，执行函数并且在间隔期内把状态位设为无效
    throttleValid = false
    throttleTimeId = setTimeout(() => {
      func.apply(self, args);
      throttleValid = true;
      clearTimeout(throttleTimeId);
    }, wait)
  }
}

// 对象转 param 字符串
export const objToParamStr = (paramObj = {}) => {
  const sdata = [];
  for (let attr in paramObj) {
    sdata.push(`${attr}=${paramObj[attr]}`);
  }
  return sdata.join('&');
};

// param 字符串转对象
export const strToParamObj = (param = "") => {
  const params = param.split("&");
  const obj = {};
  let child = "";
  params.forEach(item => {
    child = item.split("=");
    if(!!child[0]) {
      obj[child[0]] = child[1]
    }
  });
  return obj;
};

// 设置登录后跳转地址
export const setLoginRouter = (path) => {
  let url = path;
  if(!!url) {
    const pages = getCurrentPages();
    url = pages[pages.length - 1].route;
  }
  for(let key in routes) {
    if(routes[key].path === url) {
      wx.setStorageSync("LOGIN_TO_DATA", routes[key]);
    }
  }
}


export const getRelativeTime = (time) => {
  const timeStr = dayjs().from(dayjs(time));
  let str = '';
  let num = 1;
  if(timeStr.indexOf('seconds') > -1) {
    str = '1秒前';
  } else if(timeStr.indexOf('a minute') > -1) {
    str = '1分钟前';
  } else if(timeStr.indexOf('minutes') > -1) {
    num = timeStr.match(/\d+/g)[0];
    str = `${num}分钟前`;
  } else if(timeStr.indexOf('an hour') > -1) {
    str = '1小时前';
  } else if(timeStr.indexOf('hours') > -1) {
    num = timeStr.match(/\d+/g)[0];
    str = `${num}小时前`;
  } else if(timeStr.indexOf('a day') > -1) {
    str = `1天前`;
  } else if(timeStr.indexOf('days') > -1) {
    num = timeStr.match(/\d+/g)[0];
    str = `${num}天前`;
  } else if(timeStr.indexOf('a month') > -1) {
    str = `1月前`;
  } else if(timeStr.indexOf('months') > -1) {
    num = timeStr.match(/\d+/g)[0];
    str = `${num}月前`;
  } else if(timeStr.indexOf('a year') > -1) {
    str = `1年前`;
  } else if(timeStr.indexOf('years') > -1) {
    num = timeStr.match(/\d+/g)[0];
    str = `${num}年前`;
  }
  return str;
};


// 格式化销量
export const mapSales = (sale, text = "万") => {
  sale = +sale || 0;
  if(sale < 9999) {
    return sale;
  } else {
    sale = parseInt(sale / 10000);
    return `${sale}${text}+`
  }
};

// 转为浮点数
export const mapNum = (list = []) => {
  list = !!list ? list : [];
  list.forEach(item => {
    if(item.marketPrice) {
      item.marketPrice = util.divide(item.marketPrice, 100);
    }
    if(item.salePrice) {
      item.salePrice = util.divide(item.salePrice, 100);
    }
    if(item.freeAmount) {
      item.freeAmount = util.divide(item.freeAmount, 100);
    }
    if(item.usefulAmount) {
      item.usefulAmount = util.divide(item.usefulAmount, 100);
    }
  })
  return list
};

// 跳转协议
export const jumpToAgreement = (type) => {
  let url = agreementUrl[type];
  if(!!url) {
    router.push({
      name: "webview",
      data: {
        url: encodeURIComponent(url),
      },
    })
  }
}

// 店铺是否为会员店
export const haveStore = (storeNo) => {
  let id = storeNo.slice(8, storeNo.length) || 1;
  id = +id;
  return id < 123580 ? false : true;
};