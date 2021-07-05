import Request from '../utils/request'
import { showModal, setLoginRouter, getStorageUserInfo } from '../utils/tools'
import router from '../utils/router'
import homeApi from './home'

const url = {
  resource: "/cms/open/json/selByResourceKey",
  refreshToken: "/member/open/refreshToken",
  inviteCode: "/public/option/invationcode/check/internaltest/app",
}

let isShowLoginMobal = false;
let refreshingToken = false;

const showLogin = (back) => {
  showModal({
    content: "您的登录已过期，请登录",
    confirmText: "去登录",
    ok() {
      setLoginRouter();
      router.push({
        name: "login"
      })
    },
    cancel() {
      if(back) {
        router.go();
      }
    }
  })
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
    if(refreshingToken) return;
    refreshingToken = true;
    let postData = {};
    // const userInfo = store.data.userInfo;
    const userInfo = getStorageUserInfo();
    const refreshToken = wx.getStorageSync("REFRESH_TOKEN");
    if(!refreshToken) return;
    if(!userInfo && !isShowLoginMobal) {
      showLogin();
      isShowLoginMobal = true;
      return ;
    }
    postData = {
      refreshToken: wx.getStorageSync("REFRESH_TOKEN"),
      id: userInfo.id,
    }
    return Request.post(url.refreshToken, postData).then(res => {
      wx.setStorageSync("ACCESS_TOKEN", res.accessToken);
      wx.setStorageSync("REFRESH_TOKEN", res.refreshToken);
      isShowLoginMobal = false;
      refreshingToken = false;
      return res;
    }).catch(err => {
      if(err.code == 405 || err.code == 200109 || err.code == 10018) {
        wx.removeStorageSync("ACCESS_TOKEN");
        wx.removeStorageSync("REFRESH_TOKEN");
        wx.removeStorageSync("USER_INFO");
        wx.removeStorageSync("USER_OTHER_INFO");
        !isShowLoginMobal && showLogin(true);
        isShowLoginMobal = true;
      }
      refreshingToken = false;
    })
  },

  // 重新调需要登录接口
  runOverList() {
    const overList = wx.getStorageSync("OVER_LIST");
    if(!overList.length) return ;
    overList.forEach(item => {
    console.log("🚀 ~ file: common.js ~ line 76 ~ runOverList ~ item", item)
      if(item.method === "GET") {
        Request.get({
          ...item,
        });
      } else if(item.method === "POST") {
        Request.post({
          ...item,
        });
      }
    });
    wx.setStorageSync("OVER_LIST", []);
  },

  // 获取商品分享参数
  getGoodShareInfo(params) {
    return new Promise(resolve => {
      homeApi.getShareInfo(params).then(res => {
        resolve({
          title: res.title,
          path: res.shareUrl,
          imageUrl: res.thumbData
        })
      });
    });
  },

  // 检查是否填写邀请码
  getInviteCode(params, option) {
    return Request.post(url.inviteCode, params, option);
  },
}