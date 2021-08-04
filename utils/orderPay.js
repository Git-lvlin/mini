import cartApi from '../apis/order'
import { getStorageUserInfo, showToast } from '../utils/tools'
import router from '../utils/router'

/**
   * 获取支付信息
   * isNotPayment boolean 是否是模拟支付
   * */ 
export const getPayInfo = (data) => {
  const {
    id,
    payType = 2,
    isNotPayment = false,
    pullPayment = false,
  } = data;
  const userInfo = getStorageUserInfo(true, true);
  if(!userInfo) return;
  const openId = wx.getStorageSync("OPENID");
  return new Promise((resolve, reject) => {
    cartApi.getPayInfo({
      id,
      payType,
      openId,
    }).then(res => {
      const payData = res;
      if(pullPayment) {
        onOrderPay({
          data,
          payData,
        }).then(res => {
          resolve({ ...res });
        }).catch(err => {
          reject({ ...err });
        });
      } else {
        let isPay = false;
        if(isNotPayment) {
          isPay = true;
        }
        resolve({
          isPay,
          payData,
        })
      }
    }).catch(err => {
      reject(err);
    });
  });
}

// 调起支付
export const onOrderPay = ({
  data,
  payData,
}) => {
  const {
    payType,
    failJump = true,
  } = data;
  if(payType === 0) {
    getPayInfo(data)
    return ;
  }
  const payObj = JSON.parse(payData.prepayData);
  return new Promise((resolve, reject) => {
    // resolve({
    //   isPay: true,
    //   payData,
    // });
    wx.requestPayment({
      timeStamp: payObj.timeStamp,
      nonceStr: payObj.nonceStr,
      package: payObj.packageKey,
      // package: `prepay_id=${payObj.prepayId}`,
      signType: payObj.signType,
      paySign: payObj.paySign,
      success (res) {
        resolve({
          isPay: true,
          result: res,
          payData,
        });
      },
      fail (res) {
        reject({
          isPay: false,
          payType,
          failJump,
          payData,
          error: res
        });
        showToast({ title: "支付失败"});
        if(failJump) {
          router.goTabbar("user");
        }
      }
    })
  });
}