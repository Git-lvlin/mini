import cartApi from '../../apis/order'
import router from '../../utils/router';
import { getStorageUserInfo, handleErrorCode, showModal, showToast } from '../../utils/tools'

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
    console.log('this.params', this.params)
    if(this.params.scene == 1) {
      // 获取商品下单支付信息
      this.getPayInfo(this.params);
    } else if(this.params.scene == 2) {
      // 获取约卡充值支付信息
      this.getRechargePay(this.params);
    } else if(this.params.scene == 3) {
      // 获取集约B端支付信息
      this.getIntensivePay(this.params);
    } else if(this.params.scene == 4) {
      // 获取保证金支付信息
      this.getBondPay(this.params);
    } else if(this.params.scene == 5) {
      // 获取生鲜支付信息
      this.getFreshPay(this.params);
    } else if(this.params.scene == 6) {
      // 获取氢原子支付信息
      this.getAtomPay(this.params);
    } else if(this.params.scene == 7) {
      this.getVipPay(this.params);
    }
  },

  launchAppError (e) {
    console.log(e.detail)
  },

  // 判断用户是否登录
  isLogin() {
    const openId = wx.getStorageSync("OPENID") || "";
    if(!openId) {
      // showModal({
      //   content: "您还未登录，请登录！",
      //   confirmText: "去登录",
      //   ok() {
          // setLoginRouter();
          const routerData = {
            type: "page",
            router: {
              path: "/pages/otherpay/index",
              data: this.params
            },
          };
          wx.setStorageSync("LOGIN_TO_DATA", routerData);
          router.replace({
            name: "mobile"
          })
      //   },
      // })
    }
    return openId;
  },

  // 获取商品支付信息
  getPayInfo(data) {
    // id=1403266210801328130
    console.log("普通商品支付")
    const {
      payInfo,
    } = this.data;
    cartApi.getPayInfo({
      // id: data.id || "1403266210801328130",
      id: data.id,
      payType: data.payType || 7,
      openId: data.openId,
    }, {
      showLoading: false,
      notErrorMsg: true,
    }).then(res => {
      payInfo.state = 0;
      this.setData({
        payInfo,
        payData: res,
      }, () => {
        this.openPay();
        wx.hideLoading();
      })
    }).catch(err => {
      if(err.code == 20806) {
        payInfo.state = 4;
        wx.hideLoading();
      } else {
        payInfo.state = 3;
        this.handleErrorInfo(err);
      }
      this.setData({
        payInfo
      })
    });
  },
  // 获取升级为VIP-支付服务费支付信息
  getVipPay(data) {
    console.log("VIP-支付服务费")
    const {
      payInfo,
    } = this.data;
    cartApi.getPayInfoVip({
      action: 'pay',
      payType: 7,
      orderId: data.id,
      openId: data.openId,
    }).then(res => {
      payInfo.state = 0;
      this.setData({
        payInfo,
        payData: res,
      }, () => {
        this.openPay();
        wx.hideLoading();
      })
    }).catch(err => {
      // if(err.code == 10110) {
      //   payInfo.state = 4;
      // } else {
        payInfo.state = 3;
      // }
      this.setData({
        payInfo
      }, () => {
        wx.hideLoading();
      })
    });
  },
  // 获取氢原子支付信息
  getAtomPay(data) {
    console.log("氢原子支付")
    const {
      payInfo,
    } = this.data;
    cartApi.getPayInfoAtom({
      orderId: data.id,
      openId: data.openId,
    }).then(res => {
      payInfo.state = 0;
      this.setData({
        payInfo,
        payData: res,
      }, () => {
        this.openPay();
        wx.hideLoading();
      })
    }).catch(err => {
      // if(err.code == 10110) {
      //   payInfo.state = 4;
      // } else {
        payInfo.state = 3;
      // }
      this.setData({
        payInfo
      }, () => {
        wx.hideLoading();
      })
    });
  },
  // 获取约卡支付信息
  getRechargePay(data) {
    console.log("约卡支付")
    const {
      payInfo,
    } = this.data;
    cartApi.getRechargePay({
      paymentNo: data.id,
      payType: data.payType || 7,
      openId: data.openId,
    }).then(res => {
      res.prepayData = res.paymentParam;
      payInfo.state = 0;
      this.setData({
        payInfo,
        payData: res,
      }, () => {
        this.openPay();
        wx.hideLoading();
      })
    }).catch(err => {
      // if(err.code == 10110) {
      //   payInfo.state = 4;
      // } else {
        payInfo.state = 3;
      // }
      this.setData({
        payInfo
      }, () => {
        wx.hideLoading();
      })
    });
  },
  getFreshPay(data) {
    console.log('data', data)
    const {
      payInfo,
    } = this.data;
    cartApi.getInFreshPay({
      orderId: data.id,
      storeNo: data.storeNo,
      type: data.type,
      payType: data.payType || 7,
      openId: data.openId,
    }, {
      notErrorMsg: true,
    }).then(res => {
      console.log('res',res)
      payInfo.state = 0;
      this.setData({
        payInfo,
        payData: res,
      }, () => {
        this.openPay();
        wx.hideLoading();
      })
    }).catch(err => {
      if(err.code == 30202) {
        payInfo.state = 4;
        wx.hideLoading();
      } else {
        payInfo.state = 3;
        this.handleErrorInfo(err);
      }
      this.setData({
        payInfo
      })
    });
  },
  // 获取集约B端支付信息
  getIntensivePay(data) {
    const {
      payInfo,
    } = this.data;
    cartApi.getIntensivePay({
      orderId: data.id,
      storeNo: data.storeNo,
      type: data.type,
      payType: data.payType || 7,
      openId: data.openId,
    }, {
      notErrorMsg: true,
    }).then(res => {
      payInfo.state = 0;
      this.setData({
        payInfo,
        payData: res,
      }, () => {
        this.openPay();
        wx.hideLoading();
      })
    }).catch(err => {
      if(err.code == 30202) {
        payInfo.state = 4;
        wx.hideLoading();
      } else {
        payInfo.state = 3;
        this.handleErrorInfo(err);
      }
      this.setData({
        payInfo
      })
    });
  },

  // 店铺保证金
  getBondPay(data) {
    const {
      payInfo,
    } = this.data;
    cartApi.getBondPay({
      applyId: data.id,
      payType: data.payType || 7,
      payAmount: data.payAmount,
      openId: data.openId,
    }, {
      notErrorMsg: true,
    }).then(res => {
      payInfo.state = 0;
      this.setData({
        payInfo,
        payData: res,
      }, () => {
        this.openPay();
        wx.hideLoading();
      })
    }).catch(err => {
      if(err.code == 10110) {
        payInfo.state = 4;
        wx.hideLoading();
      } else {
        payInfo.state = 3;
        this.handleErrorInfo(err);
      }
      this.setData({
        payInfo
      })
    });
  },

  // 获取支付信息错误
  handleErrorInfo(data) {
    handleErrorCode({
      code: data ? data.code : 10018,
      msg: data ? data.msg : "",
    });
  },

  // 拉起微信支付
  openPay() {
    console.log("调支付")
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
        that.cancelPay();
        // router.goTabbar("user");
      }
    })
  },

  // 取消支付/支付失败
  cancelPay() {
    const {
      id,
    } = this.params;
    cartApi.cancelPay({
      outTradeNo: id
    }).then(res => {
      console.log("取消支付回调", res);
    });
  },

  // 返回首页
  onToHome() {
    router.goTabbar();
  },
})