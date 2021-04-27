import Request from '../utils/request.js'
import store from '../store/index'
import { showModal, setLoginRouter } from '../utils/tools'
import router from '../utils/router.js'

const url = {
  resource: "/cms/open/json/selByResourceKey",
  refreshToken: "/member/open/refreshToken",
}


export default {
  // 获取资源位数据
  getResourceDetail(params) {
    return new Promise((resolve, reject) => {
      const postData = {
        ...params
      };
      var data = wx.getStorageSync(params.resourceKey)
      if(data) {
        postData.timeVersion = data.timeVersion;
      } else {
        postData.timeVersion = new Date().getTime();
      }
      Request.get(url.resource, postData).then(res => {
        if(!!res.data) {
          resolve(res)
          wx.setStorage({
            key: postData.resourceKey,
            data: res
          })
        } else {
          resolve(data)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 刷新token 
  refreshToken() {
    const postData = {};
    const userInfo = store.data.userInfo;
    if(!userInfo) {
      showModal({
        content: "您的登录已过期，请登录",
        confirmText: "去登录",
        ok() {
          setLoginRouter();
          router.push({
            name: "login"
          })
        }
      })
      return ;
    }
    postData = {
      refreshToken: wx.getStorageSync("REFRESH_TOKEN"),
      id: userInfo.id,
    }
    Request.get(url.refreshToken, postData).then(res => {
      wx.setStorageSync("ACCESS_TOKEN", res.acessToken);
      wx.setStorageSync("REFRESH_TOKEN", res.refreshToken);
      this.runOverList();
    })
  },

  // 重新调需要登录接口
  runOverList() {
    const overList = wx.getStorageSync("OVER_LIST");
    if(!!overList) return ;
    overList.forEach(item => {
      if(item.method === "GET") {
        Reqeust.get({
          ...item,
        });
      } else if(item.method === "POST") {
        Reqeust.post({
          ...item,
        });
      }
    });
    wx.setStorageSync("OVER_LIST", []);
  },
}