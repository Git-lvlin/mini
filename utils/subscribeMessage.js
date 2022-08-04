
import { getStorageUserInfo, showToast } from '../utils/tools'

/**
 * 订阅消息 只给社区店主订阅消息
 * @param { Array } [tmplIds]
 * @returns { Promise<Object> }
 */
const subscribeMessage = (tmplIds = [], successCallback, failCallback, completeCallback) => {
  // const userInfo = getStorageUserInfo(true)
  // userInfo.userType = 0 // for test
  wx.requestSubscribeMessage({
    tmplIds,
    success(res) {
      // console.log('subscribeMessage/success res ', res)
      successCallback && successCallback(res)
    },
    fail(res) {
      // console.log('subscribeMessage/fail res ', res)
      failCallback && failCallback(res)
    },
    complete(res) {
      // console.log('subscribeMessage/complete res ', res);
      completeCallback && completeCallback(res)
    }
  })
}


export default {
  shareSubscribeMessage(successCallback, failCallback, completeCallback) {
    // 商品分享提醒 授权
    const tmplIds = ['YU1OCaNbwq9S3r-i2tSXUsuOUlPdNofzTHXCGWXfkIo']
    return subscribeMessage(tmplIds, successCallback, failCallback, completeCallback)
  },

  // 下单订阅消息
  orderSubscribeMessage(successCallback, failCallback, completeCallback) {
    const tmplIds = [
      '56v1dxU2D4Q3SZv73cN1KMKNO_xPO45KCrDJI__CzLE', // 支付成功通知
      'vYnVOZRs9rH5U3aF98Dw2smzBMMb3BTQ_omPNPf59Ic', // 订单已发货提醒
    ]
    return subscribeMessage(tmplIds, successCallback, failCallback, completeCallback)
  },
}
