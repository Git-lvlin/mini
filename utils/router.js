import routes from "../constants/routes"
 
const push = ({ name, data }) => {
  const dataStr = encodeURIComponent(JSON.stringify(data));
  const route = routes[name];
  console.log(name);
  const url = route ? route.path : `pages/${name.replace(/\./g, '/')}/index`;
  if (route.type === 'tab') {
    wx.switchTab({
      url: `${url}`, // 注意tab页面是不支持传参的
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
      url: routes.home.path, // 注意tab页面是不支持传参的
    });
    return;
  }
  wx.navigateBack({
    delta
  });
}

const goTabbar = (name = 'home') => {
  wx.switchTab({
    url: routes[name].path, // 注意tab页面是不支持传参的
  });
}
 
const extract = options => JSON.parse(decodeURIComponent(options.encodedData));

export default {
  go,
  goTabbar,
  push,
  extract,
}
