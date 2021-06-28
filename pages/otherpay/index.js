import cartApi from '../../apis/order'
import router from '../../utils/router';
import { getStorageUserInfo, showModal, showToast } from '../../utils/tools'

Page({
  params: {},
  showPay: false,

  data: {
    payData: "",
    payInfo: {
      type: "payBack",
      state: 0,
    }
  },

  // options.scene 自定义支付场景  1 商品下单支付  2 约卡充值支付
  onLoad(options) {
    console.log("🚀 ~ file: index.js ~ line 19 ~ onLoad ~ options", options)
    this.params = options;
    var obj = wx.getLaunchOptionsSync()
    console.log('——启动小程序的场景值:', obj.scene)
  },

  onShow() {
    if(this.showPay) return;
    const openId = this.isLogin();
    if(!openId) return;
    wx.showLoading();
    this.params.openId = openId;
    console.log("🚀 ~ file: index.js ~ line 31 ~ onShow ~ this.params", this.params)
    if(this.params.scene == 1) {
      // 获取商品下单支付信息
      this.getPayInfo(this.params);
    } else if(this.params.scene == 2) {
      // 获取约卡充值支付信息
      this.getRechargePay(this.params);
    } else if(this.params.scene == 3) {
      // 获取约卡充值支付信息
      this.getIntensivePay(this.params);
    }
  },

  launchAppError (e) {
    console.log(e.detail)
  },

  // 判断用户是否登录
  isLogin() {
    const openId = wx.getStorageSync("OPENID") || "";
    if(!openId) {
      showModal({
        content: "您还未登录，请登录！",
        confirmText: "去登录",
        ok() {
          // setLoginRouter();
          router.push({
            name: "login"
          })
        },
      })
    }
    return openId;
  },

  // 获取商品支付信息
  getPayInfo(data) {
    // id=1403266210801328130
    cartApi.getPayInfo({
      // id: data.id || "1403266210801328130",
      id: data.id,
      payType: 7,
      openId: data.openId,
    }, {
      showLoading: false
    }).then(res => {
      this.setData({
        payData: res,
      }, () => {
        this.openPay();
        wx.hideLoading();
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

  // 获取约卡支付信息
  getRechargePay(data) {
    cartApi.getRechargePay({
      paymentNo: data.id,
      payType: 7,
      openId: data.openId,
    }).then(res => {
      console.log("获取约卡 res", res)
      res.prepayData = res.paymentParam;
      this.setData({
        payData: res,
      }, () => {
        this.openPay();
        wx.hideLoading();
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

  // 获取集约支付信息
  getIntensivePay(data) {
    console.log("🚀 ~ file: index.js ~ line 122 ~ getIntensivePay ~ data", data)
    cartApi.getIntensivePay({
      orderId: data.id,
      storeNo: data.storeNo,
      type: data.type,
      payType: 7,
      openId: data.openId,
    }, {
      notErrorMsg: true,
    }).then(res => {
      console.log("获取集约 res", res)
      this.setData({
        payData: res,
      }, () => {
        this.openPay();
        // wx.hideLoading();
      })
    }).catch(err => {
      console.log("🚀 ~ file: index.js ~ line 137 ~ getIntensivePay ~ err", err)
      const {
        payInfo,
      } = this.data;
      payInfo.state = 3;
      this.setData({
        payInfo
      })
    });
  },

  // 拉起微信支付
  openPay() {
    const {
      payData,
      payInfo,
    } = this.data;
    if(!payData) {
      showToast({ title: "没有获取到支付信息" });
      return;
    }
    this.showPay = true;
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