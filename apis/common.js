import Request from '../utils/request'
import { showModal, setLoginRouter, getStorageUserInfo, strToParamObj, clearLoginInfo } from '../utils/tools'
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
  coordinate: "/cms/open/location/getLocation",

  // banner: '/cms/open/banner/list',
  banner: '/cms/option/banner/list',
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
        name: "mobile"
      })
    },
    cancel() {
      router.goTabbar();
    }
  })
}


export default {
  // 获取资源位数据
  getResourceDetail(params, option = {}) {
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
      Request.get(url.resource, postData, option).then(res => {
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
    if(!userInfo && !store.data.showLoginMobel) {
      clearLoginInfo();
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
    return Request.post(url.refreshToken, postData, {
      showLoading: false
    }).then(res => {
      wx.setStorageSync("ACCESS_TOKEN", res.accessToken);
      wx.setStorageSync("REFRESH_TOKEN", res.refreshToken);
      store.data.showLoginMobel = false;
      refreshingToken = false;
      refreshNum = 0;
      return res;
    }).catch(err => {
      // if(err.code == 405 || err.code == 200109 || err.code == 10018 || err.code == 200104) {
        clearLoginInfo();
        if(!store.data.showLoginMobel) {
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
  getShareParam(options = {}, params = {}) {
    return new Promise((resolve, reject) => {
      const sceneData = wx.getLaunchOptionsSync()
      console.log('——启动小程序的场景值:', sceneData.scene)
      // if(CODE_SCENE[sceneData.scene]) {
        Request.post(url.shareParam, {
          scene: options.scene,
        }, {
          showLoading: false,
          ...params
        }).then(res => {
          const param = strToParamObj(res);
          resolve(param);
        }).catch(err => {
          options.error = err;
          reject(options);
        });
      // } else {
      //   reject(options); 
      // }
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

  // 根据地址获取经纬度
  getCoordinate(params, option) {
    return Request.get(url.coordinate, params, option);
  },

  // 获取banner 
  getBanner(params, option) {
    return Request.get(url.banner, params, option);
  },
}