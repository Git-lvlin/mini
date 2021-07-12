import { getBaseApiUrl, handleErrorCode, showModal, setLoginRouter } from './tools'
import { HTTP_TIMEOUT, VERSION } from '../constants/index'
import commonApi from '../apis/common';
import router from '../utils/router'

let isRefreshing = false;
let requestHistory = [];
const ACCESS_TOKEN_INVALID = 10014;
const REFRESH_TOKEN_INVALID = 10015;

/**
 * 请求接口
 * header        object   请求头信息
 * contentType   srting   数据类型
 * showLoading   boolean  请求是否显示loading
 * url           string   请求接口地址
 * method        string   请求类型
 * data          object   请求提交的数据
 * timeout       number   请求超时时间 毫秒
 * dataPackage   boolean  是否返回完整数据包
 * notErrorMsg   boolean  是否展示错误提示
 * mustLogin     boolean  是否必须登录
*/
const Reqeust = (params) => {
  const baseUrl = getBaseApiUrl();
  const token = wx.getStorageSync("ACCESS_TOKEN");
  const header = {
    'Content-Type': !params.contentType ? 'application/json' : params.contentType,
    v: VERSION,
    t: new Date().getTime(),
    ...params.header
  }
  if(token) header.token = token;
  header.p = "miniprogram";
  const opions = {
    showLoading: true,
    ...params
  }
  if(opions.showLoading){
    wx.showLoading({
      title: '玩命加载中...',
    });
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: !!params.hasBase ? params.url : baseUrl + params.url,
      method: params.method.toUpperCase() || 'GET',
      data: params.data || {},
      header,
      timeout: HTTP_TIMEOUT,
      success: async function(res) {
        wx.hideLoading();
        // 判断是否返回数据包
        const data = !!params.dataPackage ? res.data : res.data.data;
        // console.log(params.url, res.data)
        //数据请求成功判断
        if (res.statusCode === 200 && res.data.code === 0 && res.data.success) {
          // resolve(data);
          resolve(data)
          wx.hideLoading();
        } else {
          if (res.data.code == REFRESH_TOKEN_INVALID) {
            // refreshToken过期退出登录
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
            reject(res.data);
            return null;
          }
          // token 过期刷新token
          if(res.data.code === ACCESS_TOKEN_INVALID) {
            let config = params;
            if (!isRefreshing) {
              isRefreshing = true;
              // requestHistory.push({resolve, config});
              await commonApi.refreshToken();
              //恢复历史请求
              resolve(Reqeust(config));
              requestHistory.forEach(item => {
                item.resolve(Reqeust(item.config));
              });
              requestHistory = [];
              isRefreshing = false;
            } else {
              requestHistory.push({resolve, config});
            }
          }
          // 返回错误码处理
          if(!params.notErrorMsg && !this.refreshToken) {
            handleErrorCode({
              params,
              code: res.data.code,
              msg: res.data.msg,
              mustLogin: params.mustLogin,
            });
          }
          if(res.data.code !== ACCESS_TOKEN_INVALID) {
            reject(res.data);
          }
        }
      },
      fail(error) {
        console.log(33333)
        if(!params.notErrorMsg) {
          handleErrorCode({
            params,
            code: !!error && !!error.data ? error.data.code : 10018,
            msg: !!error && !!error.data ? error.data.msg : "",
            mustLogin: params.mustLogin,
          });
        }
        wx.hideLoading();
        reject(error);
      },
      complete(res) {
        // console.log("request ~ ", params.url, res.data);
      },
    })
  })
}

export default {
  get(url, data = {}, options = {}) {
    return Reqeust({
      url: url,
      data: data,
      method: 'GET',
      ...options,
    });
  },
  post(url, data = {}, options = {}) {
    return Reqeust({
      url: url,
      data: data,
      method: 'POST',
      ...options,
    });
  },
  postFrom(url, data = {}, options = {}) {
    return Reqeust({
      url: url,
      data: data,
      method: 'POST',
      contentType: 'application/x-www-form-urlencoded',
      ...options,
    });
  },
};