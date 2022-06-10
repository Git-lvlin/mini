import create from '../../../utils/create'
import store from '../../../store/index'
import router from '../../../utils/router'
import util from '../../../utils/util'
import { getPayInfo, onOrderPay } from '../../../utils/orderPay'
import dayjs from '../../../miniprogram_npm/dayjs/index'
import { IMG_CDN, PAY_TYPE_KEY } from '../../../constants/common'
import commonApi from '../../../apis/common'
import fadadaApi from '../../../apis/fadada'
const defaultList = [

]

const app = getApp();
create.Page(store, {
  // Page({
  canvasImg: '',
  id: "",
  goodPage: {
    hasNext: false,
    next: "",
    size: 20,
  },
  loading: false,
  payType: 7,
  orderInfo: {},
  options: {},
  data: {
    showPopupIsPT: false,
    isPay: false,
    chooseIcon: `${IMG_CDN}miniprogram/common/choose.png`,
    defChooseIcon: `${IMG_CDN}miniprogram/common/def_choose.png`,
    payList: defaultList,
    disableChoose: false,
    payType: 2,
    payAmount: 0,
    downTime: 0,
    timeData: {},
    redTime: {},
    payData: {},
    teamPopup: false,
    hotGood: [],
    orderCreateTime: "",
    redData: {
      isShow: 0
    },
    showSharePopup: false,
    groupInfo: null,
  },

  onLoad(options) {
    console.log('options', options)
    this.options = options
    commonApi.getResourceDetail({
      resourceKey: PAY_TYPE_KEY,
    }, {
      showLoading: false,
    }).then(res => {
      let list = res.data.records;
      let payList = [];
      list.forEach((item, index) => {
        if (item.payType === 2 || item.payType === 7 || item.payType === 0) {
          // item.default = index === 0 ? 1 : 0;
          if (item.state === 1) {
            payList.push(item);
          }
          if (item.default === 1) {
            this.payType = item.payType;
          }
        }
      });
      this.setData({
        payList,
      })

      this.createOrder();
    });

    app.trackEvent('shopping_cashier');
  },
  onShow() {
    // if (!this.options.contractId) {
    //   return
    // }
    // fadadaApi.getContractGetDetail({contractId: this.options.contractId}).then((res) => {

    // })
  },
  /**
   * 获取支付信息
   * isNotPayment boolean 是否是模拟支付
   * */
  getPayInfo(isNotPayment = false, cb = () => { }) {
    const openId = wx.getStorageSync("OPENID");
    fadadaApi.contractPayOrder({
      openId,
      memberId: this.orderInfo.memberId,
      orderNo: this.orderInfo.orderNo,
      payType: this.payType,
    }).then(res => {
      if (isNotPayment) {
        this.setData({
          isPay:true
        })
      }
      cb(res)
      app.trackEvent('goods_pay_success', {
        pay_method_name: isNotPayment ? '模拟支付' : '微信支付'
      });
    });
  },


  sign() {
    this.findCompanyCert()
  },

  findCompanyCert() {
    fadadaApi.findCompanyCert({
      companyId: this.options.contractId
    }).then(res => {
      if (res) {
        fadadaApi.genCompanyContract({
          companyId: this.options.contractId,
          businessId: this.options.contractId,
          contractUrl: this.options.url
        }).then(res => {
          router.push({
            name: "webview",
            data: {
              url: encodeURIComponent(res.signUrl),
              encode: true
            }
          });
        })
      } else {
        fadadaApi.getCompanyVerifyUrl({
          companyId: this.options.contractId
        }).then(res => {
          router.push({
            name: "webview",
            data: {
              url: encodeURIComponent(res.verifyUrl),
              encode: true
            }
          });
        })
      }
    })
  },

  createOrder() {
    const userInfo = wx.getStorageSync("USER_INFO") || {};
    const openId = wx.getStorageSync("OPENID");
    fadadaApi.contractAddOrder({
      contractId: +this.options.contractId,
      memberId: userInfo.id,
      openId,
      payType: this.payType
    }).then(res => {
      this.orderInfo = res.records
      this.setData({
        payAmount: util.divide(res.records.payAmount, 100),
      })
    })
  },

  // 选择支付方式
  onChangeType({
    currentTarget
  }) {
    let payList = this.data.payList;
    let index = currentTarget.dataset.index;
    payList.forEach((item, idx) => {
      if (index === idx) {
        item.default = 1;
        this.payType = item.payType;
      } else {
        item.default = 0;
      }
    });
    this.createOrder();
    this.setData({
      payList,
    })
  },

  // 点击确定支付
  onPay() {
    const that = this;
    if (this.payType === 0) {
      this.getPayInfo(true)
    } else {
      this.getPayInfo(false, (res) => {
        const payData = res.records;
        const data = {
          payType: this.payType,
          failJump: false,
        };
        onOrderPay({
          data,
          payData,
        }).then(res => {
          that.setData({
            isPay: true,
          })
        })
      })
    }
    
  },

})