import { getBaseApiUrl, handleErrorCode } from './tools'
import { HTTP_TIMEOUT, VERSION } from '../constants/index'
import router from '../utils/router'

const showErrorMsg = (msg, icon) => {
  wx.showToast({
    title: '哎呀，出错啦，请重试',
    icon: !!icon ? icon : "none",
    duration: 2000,
  });
};

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
  const token = wx.getStorageSync("SYS_TOKEN");
  const header = {
    'content-type': !params.contentType ? 'application/json' : params.contentType,
    v: VERSION,
    t: new Date().getTime(),
    ...params.header
  }
  if(token) header.token = token;
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
      url: baseUrl + params.url,
      method: params.method.toUpperCase() || 'GET',
      data: params.data || {},
      header,
      timeout: HTTP_TIMEOUT,
      success(res){
        // 判断是否返回数据包
        const data = !!params.dataPackage ? res.data : res.data.data;
        //数据请求成功判断
        if (res.statusCode === 200 && res.data.code === 0 && res.data.success) {
          resolve(data);
          wx.hideLoading();
        }else {
          // 返回错误码处理
          if(!params.notErrorMsg) {
            handleErrorCode({
              code: res.data.code,
              msg: res.data.msg,
              mustLogin: params.mustLogin,
            });
          } else {
            wx.hideLoading();
          }
          reject(res.data);
        }
      },
      fail(error) {
        if(!params.notErrorMsg) {
          handleErrorCode({
            code: res.data.code,
            msg: res.data.msg,
            mustLogin: params.mustLogin,
          });
        } else {
          wx.hideLoading();
        }
        reject(error);
      }
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