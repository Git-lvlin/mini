
export const wxPay = (payData) => {
  wx.requestPayment({
    timeStamp: payData.timeStamp,
    nonceStr: '',
    package: '',
    signType: 'MD5',
    paySign: '',
    success (res) { },
    fail (res) { }
  })
}