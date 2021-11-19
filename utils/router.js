import commonApi from "../apis/common";
import { VERSION } from "../constants/index";
import routeMap from "../constants/routeMap";
import routes from "../constants/routes"
import { getStorageUserInfo, objToParamStr, strToParamObj } from "./tools";
 
const paramToStr = (data) => {
  let str = "";
  for(let key in data) {
    str += `${key}=${data[key]}&`
  }
  str = str.substring(0, str.length - 1);;
  return str
};

const push = ({ name, data }) => {
  // const dataStr = encodeURIComponent(JSON.stringify(data));
  const dataStr = paramToStr(data);
  const route = routes[name];
  // const url = route ? route.path : `/pages/${name.replace(/\./g, '/')}/index`;
  const url = route ? route.path : name;
  if (route.type === 'tab') {
    wx.switchTab({
      url: `${url}`,
    });
    return;
  }
  wx.navigateTo({
    url: `${url}?${dataStr}`,
    // url: `${url}?encodedData=${dataStr}`,
  });
};

const go = (delta = 1) => {
  const pages = getCurrentPages();
  if (pages.length < 2) {
    wx.switchTab({
      url: routes.home.path,
    });
    return;
  }
  wx.navigateBack({
    delta
  });
};

const replace = ({ name, data, frist }) => {
  const dataStr = paramToStr(data);
  const route = routes[name];
  const url = route ? route.path : name;
  if(route.type == 'tab') {
    wx.switchTab({
      url,
    });
    return
  }
  if (frist) {
    wx.reLaunch({
      url: `${url}?${dataStr}`,
    });
    return;
  } else {
    wx.redirectTo({
      url: `${url}?${dataStr}`,
    });
  }
};

const goTabbar = (name = 'home') => {
  wx.switchTab({
    url: routes[name].path,
  });
};

/**
 * 登录完成 - 跳转
 * routerData    object 跳转配置 { type: "back", delta: 1, router: {type: "tabbar", path: "/pages/home/index"}
 * LOGIN_TO_DATA object 跳转配置 { type: "back", delta: 1, router: {type: "tabbar", path: "/pages/home/index"}
 * delta         number 返回层级 type 为back 时生效
 * type          string back 返回一页/多页 home 返回首页 page 跳转指定页面
 * router        object 为路由表 routes 下的各路由信息     type 页面类型  path 页面路由  data 页面数据
 */
const loginTo = (routerData) => {
  const pages = getCurrentPages();
  const pagesLen = pages.length - 1;
  const storageRouter = wx.getStorageSync("LOGIN_TO_DATA");
  const loginToData = !!routerData ? routerData : storageRouter;
  if(!!storageRouter) {
    wx.removeStorage({
      key: 'LOGIN_TO_DATA'
    });
  }
  if(!!loginToData) {
    let {
      type,
      delta,
      router,
    } = loginToData;
    if(type === "back") {
      if(!!delta) {
        go(delta);
      } else if(!!router && !!router.path) {
        let index = pages.findIndex(item => item.route === router.path);
        delta = pagesLen - index;
        go(delta > 1 ? delta : 1);
      } else {
        go();
      };
    } else if(type === "home") {
      goTabbar();
    } else if(type === "page") {
      // if(!delta && !router.path) {
      //   wx.showToast({
      //     title: '哎呀，找不到页面',
      //     icon: 'none',
      //   });
      //   return
      // }
      // 检查需跳转页面是否已在pages内，在就返回，不在就重置当前页面
      let index = pages.findIndex(item => item.route === router.path);
      // delta = pagesLen - index;
      // if(delta && delta > 1) {
      //   go(delta);
      // } else {
        // const dataStr = encodeURIComponent(JSON.stringify(data));
        const dataStr = paramToStr(router.data);
        // if(routes.mobile.path === `/${pages[pagesLen].route}`) {
          wx.redirectTo({
            url: `${router.path}?${dataStr}`,
          });
        // } else {
        //   // 不是登录页面，先返回登录页面再重置页面
        //   index = pages.findIndex(item => item.route === routes.login.path);
        //   delta = pagesLen - index;
        //   console.log(1,new Date().getTime());
        //   wx.navigateBack({
        //     delta,
        //     success() {
        //       console.log(2, new Date().getTime());
        //       wx.redirectTo({
        //         url: `${router.path}?${dataStr}`,
        //       });
        //     }
        //   });
        // }
      // } 
    }
  }
};

const updateSelectTabbar = (that, index) => {
  // tabbar添加选中效果
  if (typeof that.getTabBar === "function" && that.getTabBar()) {
    //自定义组件的getTabBar 方法，可获取当前页面下的自定义 tabBar 组件实例。
    const Tabbar = that.getTabBar();
    //这个是tabBar中当前页对应的下标
    Tabbar.setData({
      selectedIndex: index
    })
  }
}

// 解析字符串url路由
const getUrlRoute = (url, opt) => {
  const option = {
    isJump: true,
    needLogin: false,
    ...opt,
  }
  let userInfo = {};
  let token = "";
  const data = {
    routeStr,
    route: '',
    params: {},
  };
  if(/^\/pages\//g.test(url) || /^\/subpages\//g.test(url)) {
    // 小程序页面路由
    let tempRoute = {};
    const urlArr = url.split('?');
    const route = urlArr[0];
    data.routeStr = url;
    data.routeType = "route";
    if(urlArr[1]) {
      data.params = strToParamObj(urlArr[1]);
    }
    for(let key in routes) {
      if(routes[key].path == route) {
        data.route = key;
        tempRoute = routes[key];
        tempRoute.key = key;
      }
    }
    if(tempRoute.type && tempRoute.type == 'tabbar') {
      data.isTabbar = true;
    }
    if(option.isJump) {
      if(!!data.isTabbar) {
        goTabbar(data.route)
      } else {
        push({
          name: data.route,
          data: data.params,
        })
      }
    }
    return data;
  }
  // 以下解析H5路由
  const routeStr = url.match(/(http|https):\/\/([^/]+)(\S*)/)[3];
  const routeArr = routeStr.split("?");
  data.route = routeArr[0];
  if(!!routeArr[1]) {
    data.paramStr = routeArr[1];
    data.params = strToParamObj(data.paramStr);
  }
  userInfo = getStorageUserInfo(option.needLogin);
  if(!userInfo && option.needLogin) {
    return null;
  }
  token = wx.getStorageSync("ACCESS_TOKEN") || '';
  const routeData = routeMap[data.route];
  const mapLogin = routeData && routeData.needLogin ? true : false;
  if(!url) {
    return null;
  }
  if(data.route.indexOf("/web/") > -1) {
    // 自主开发WEB页面
    data.routeType = "web";
    if(mapLogin) {
      if(!token) {
        getStorageUserInfo(true);
        return;
      }
      url = `${url}${url.indexOf("?") > -1 ? "&" : "?"}memberId=${userInfo.id}`;
    }
    // 新人专享
    if(routeData.key == "newCoupon") {
      option.data = {
        ...option.data,
        // isNew: userInfo.isNew,
        isNew: true,
        indexVersion: VERSION,
      }
    }
    if(option.data) {
      let connector = url.indexOf("?") > -1 ? "&" : "?";
      url = `${url}${mapLogin ? "&" : connector}${objToParamStr(option.data)}`;
    }
    if(option.isJump) {
      if(!!token) {
        data.params.url = url;
        getRefreshToken(data.params, token);
      } else {
        data.params.url = encodeURIComponent(url);
        push({
          name: "webview",
          data: data.params,
        })
      }
    }
  } else if(routeData && routeData.path) {
    // 小程序页面
    const appTabbar = routeMap.appTabbar;
    if(mapLogin && !token) {
      getStorageUserInfo(true);
      return;
    }
    data.routeType = "route";
    data.route = routeData.path;
    if(data.route == 'home') {
      const tabData = appTabbar[+data.params.index];
      if(!!tabData.route) {
        data.isTabbar = tabData.isTabbar;
        data.route = tabData.route;
      } else {
        return ;
      }
    }

    if(option.isJump) {
      if(!!data.isTabbar) {
        goTabbar(data.route);
      } else {
        push({
          name: data.route,
          data: data.params,
        })
      }
    }
  } else {
    // 无法识别的页面
    if(option.isJump) {
      data.params = {
        ...data.params,
        url: encodeURIComponent(url),
      }
      push({
        name: "webview",
        data: data.params || {},
    })
    }
  }
  return data;
}

const getRefreshToken = async (params, token) => {
  const Symbol = params.url.indexOf('?') > -1 ? '&' : '?';
  await commonApi.refreshToken().then(res => {
    wx.setStorageSync("ACCESS_TOKEN", res.accessToken);
    wx.setStorageSync("REFRESH_TOKEN", res.refreshToken);
    params.url = `${params.url}${Symbol}token=${res.accessToken}`;
  }).catch(() => {
    params.url = `${params.url}${Symbol}token=${token}`
  });
  params.url = encodeURIComponent(params.url);
  push({
    name: "webview",
    data: params,
  })
}
 
const extract = options => JSON.parse(decodeURIComponent(options.encodedData));

export default {
  push,
  go,
  replace,
  goTabbar,
  loginTo,
  updateSelectTabbar,
  getUrlRoute,
  extract,
}
