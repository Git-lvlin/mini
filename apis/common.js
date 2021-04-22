import Request from '../utils/request.js'

const url = {
  resource: "/cms/open/json/selByResourceKey"
}

// 获取资源位数据
export const getResourceDetail = (params) => {
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
}