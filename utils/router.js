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
 
const extract = options => JSON.parse(decodeURIComponent(options.encodedData));

export default {
  push,
  extract,
}
