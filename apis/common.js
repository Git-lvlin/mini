import Request from '../utils/request'
import { showModal, setLoginRouter, getStorageUserInfo, strToParamObj } from '../utils/tools'
import router from '../utils/router'
import store from '../store/index'
import { CODE_SCENE } from '../constants/index'
import homeApi from './home'

const url = {
  resource: "/cms/open/json/selByResourceKey",
  refreshToken: "/member/open/refreshToken",
  inviteCode: "/public/option/invationcode/check/internaltest/app",
  ossConfig: "/public/open/uploadConfig/findByBizCode",
  shareParam: "/share/option/shareParam/getScene",
}

let isShowLoginMobal = store.data.showLoginMobel;
let refreshingToken = false;
let refreshNum = 0;
let clearRefreshTime = null;

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
      store.data.showLoginMobel = true;
      return ;
    }
    if(refreshNum >= 3) {
      // 连续刷新不成功，拦截一秒内的请求
      refreshingToken = true;
      clearRefreshTime = setTimeout(() => {
        clearTimeout(clearRefreshTime);
        refreshNum = 0;
        refreshingToken = false;
      }, 1000);
    }
    refreshNum += 1;
    postData = {
      refreshToken: wx.getStorageSync("REFRESH_TOKEN"),
      id: userInfo.id,
    }
    return Request.post(url.refreshToken, postData).then(res => {
      wx.setStorageSync("ACCESS_TOKEN", res.accessToken);
      wx.setStorageSync("REFRESH_TOKEN", res.refreshToken);
      store.data.showLoginMobel = false;
      refreshingToken = false;
      refreshNum = 0;
      return res;
    }).catch(err => {
      // if(err.code == 405 || err.code == 200109 || err.code == 10018 || err.code == 200104) {
        wx.removeStorageSync("ACCESS_TOKEN");
        wx.removeStorageSync("REFRESH_TOKEN");
        wx.removeStorageSync("USER_INFO");
        wx.removeStorageSync("USER_OTHER_INFO");
        if(!isShowLoginMobal) {
          showLogin(true);
          store.data.showLoginMobel = true;
        }
      // }
      refreshingToken = false;
      return err;
    })
  },

  // 获取商品分享参数
  getShareInfo(params) {
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

  // 解析分享参数
  getShareParam(options = {}) {
    return new Promise((resolve, reject) => {
      const sceneData = wx.getLaunchOptionsSync()
      console.log('——启动小程序的场景值:', sceneData.scene)
      if(CODE_SCENE[sceneData.scene]) {
        Request.post(url.shareParam, {
          scene: options.scene,
        }, {
          showLoading: false
        }).then(res => {
          const param = strToParamObj(res);
          resolve(param);
        }).catch(err => {
          options.err = err;
          reject(options);
        });
      } else {
        reject(options); 
      }
    })
  },

  // 检查是否填写邀请码
  getInviteCode(params, option) {
    return Request.post(url.inviteCode, params, option);
  },

  // 获取oss上传配置
  getOssConfig(params, option) {
    return Request.get(url.ossConfig, params, option);
  },
}