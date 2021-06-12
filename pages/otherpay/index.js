import cartApi from '../../apis/order'
import { getStorageUserInfo, showToast } from '../../utils/tools'

Page({
  params: {},

  data: {
    payData: "",
    payInfo: {
      type: "payBack",
      state: 0,
    }
  },

  onLoad(options) {
    this.params = options;
    var obj = wx.getLaunchOptionsSync()
    console.log('——启动小程序的场景值:', obj.scene)
  },

  onShow() {
    wx.showLoading();
    this.getPayInfo(this.params);
  },

  launchAppError (e) {
    console.log(e.detail)
  },

  // 获取支付信息
  getPayInfo(data) {
    // id=1403266210801328130
    const userInfo = getStorageUserInfo(true);
    console.log("🚀 ~ file: index.js ~ line 54 ~ getPayInfo ~ userInfo", userInfo)
    if(!userInfo) return;
    cartApi.getPayInfo({
      // id: data.id || "1403266210801328130",
      id: data.id,
      payType: 7,
      openId: userInfo.openId,
    }, {
      showLoading: false
    }).then(res => {
      console.log("🚀 ~ file: index.js ~ line 61 ~ getPayInfo ~ res", res)
      this.setData({
        payData: res,
      }, () => {
        wx.headLoading();
        this.openPay();
      })
    }).catch(err => {
      const {
        payInfo,
      } = this.data;
      payInfo.state = 3;
      this.setData({
        payInfo
      })
    });
  },

  openPay() {
    const {
      payData,
      payInfo,
    } = this.data;
    if(!!payData) {
      showToast({ title: "没有获取到支付信息" });
      return;
    }
    const payObj = JSON.parse(payData.prepayData);
    const that = this;
    wx.requestPayment({
      timeStamp: payObj.timeStamp,
      nonceStr: payObj.nonceStr,
      package: payObj.packageKey,
      // package: `prepay_id=${payObj.prepayId}`,
      signType: 'RSA',
      paySign: payObj.paySign,
      success (res) {
        payInfo.state = 1;
        that.setData({
          isPay: true,
          payInfo
        })
      },
      fail (res) {
        payInfo.state = 2;
        that.setData({
          isPay: true,
          payInfo
        })
        showToast({ title: "支付失败"});
        router.goTabbar("user");
      }
    })
  },
})