import { getBaseApiUrl } from './tools'
import { HTTP_TIMEOUT } from '../constants/index'

export function Reqeust(params) {
  const baseUrl = getBaseApiUrl()
  const header = {
    'content-type': !params.contentType ? 'application/json' : params.contentType,
    ...params.header
  }
  const opions = {
    showLoading: true,
    ...params
  }
  if(opions.showLoading){
    wx.showLoading({
      title: '玩命加载中...',
    })
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
        if (res.statusCode===200 && res.data.code===0) {
          resolve(data)
          wx.hideLoading()
        }else {
          // 返回错误码处理
          wx.showToast({
            title: '接口有问题，请检查',
          })
          reject('接口有问题，请检查')
        }
      },
      fail(error) {
        wx.showToast({
          title: '数据接口有问题',
        })
        reject('数据接口有问题')
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
    })
  },
  post(url, data = {}, options = {}) {
    return Reqeust({
      url: url,
      data: data,
      method: 'POST',
      ...options,
    })
  },
  postFrom(url, data = {}, options = {}) {
    return Reqeust({
      url: url,
      data: data,
      method: 'POST',
      contentType: 'application/x-www-form-urlencoded',
      ...options,
    })
  },
};