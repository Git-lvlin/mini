import routes from "../constants/routes"
 
const push = ({ name, data }) => {
  const dataStr = encodeURIComponent(JSON.stringify(data));
  const route = routes[name];
  const url = route ? route.path : `/pages/${name.replace(/\./g, '/')}/index`;
  if (route.type === 'tab') {
    wx.switchTab({
      url: `${url}`,
    });
    return;
  }
  wx.navigateTo({
    url: `${url}?encodedData=${dataStr}`,
  });
}

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
}

const replace = ({ name, data, frist }) => {
  const dataStr = encodeURIComponent(JSON.stringify(data));
  const route = routes[name];
  const url = route ? route.path : `/pages/${name.replace(/\./g, '/')}/index`;
  if(route.type == 'tab') {
    wx.switchTab({
      url,
    });
    return
  }
  if (frist) {
    wx.reLaunch({
      url: `${url}?encodedData=${dataStr}`,
    });
    return;
  } else {
    wx.redirectTo({
      url: `${url}?encodedData=${dataStr}`,
    });
  }
}

const goTabbar = (name = 'home') => {
  wx.switchTab({
    url: routes[name].path,
  });
}

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
  const loginToData = !!routerData ? routerData : wx.getStorageSync("LOGIN_TO_DATA");
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
      if(!delta && !router.path) {
        wx.showToast({
          title: '哎呀，找不到页面',
          icon: 'none',
        });
        return
      }
      // 检查需跳转页面是否已在pages内，在就返回，不在就重置当前页面
      let index = pages.findIndex(item => item.route === router.path);
      delta = pagesLen - index;
      if(delta > 1) {
        go(delta);
      } else {
        const dataStr = encodeURIComponent(JSON.stringify(data));
        if(routes.login.path === pages[pagesLen].route) {
          wx.redirectTo({
            url: `${router}?encodedData=${dataStr}`,
          });
        } else {
          // 不是登录页面，先返回登录页面再重置页面
          index = pages.findIndex(item => item.route === routes.login.path);
          delta = pagesLen - index;
          wx.navigateBack({
            delta,
            successs() {
              wx.redirectTo({
                url: `${router}?encodedData=${dataStr}`,
              });
            }
          });
        }
      } 
    }
  }
}
 
const extract = options => JSON.parse(decodeURIComponent(options.encodedData));

export default {
  push,
  go,
  replace,
  goTabbar,
  loginTo,
  extract,
}
