import create from '../../../utils/create'
import store from '../../../store/index'
import router from '../../../utils/router'
import util from '../../../utils/util'
import dayjs from '../../../miniprogram_npm/dayjs/index'
import { IMG_CDN, PAY_TYPE_KEY } from '../../../constants/common'
import commonApi from '../../../apis/common'
import cartApi from '../../../apis/cart'
import { showToast } from '../../../utils/tools'

const defaultList = [

]

create.Page(store, {
  use: [
    "userInfo"
  ],

  data: {
    isPay: false,
    chooseIcon: `${IMG_CDN}miniprogram/common/choose.png`,
    defChooseIcon: `${IMG_CDN}miniprogram/common/def_choose.png`,
    payList: defaultList,
    disableChoose: false,
    payType: 2,
    payAmount: 0,
    downTime: 0,
    timeData: {},
    payData: {},
  },

  onLoad: function (options) {
    // id: 1390912161480564700
    // orderSn: "16204542762334404122"
    // payAmount: 1
    // payDeadline: 1620454876068
    const userInfo = this.store.data.userInfo;
    let downTime = options.payDeadline - options.currentTime;
    this.setData({
      payAmount: util.divide(options.payAmount, 100),
      downTime,
    })
    // 获取支付类型
    commonApi.getResourceDetail({
      resourceKey: PAY_TYPE_KEY,
    }).then(res => {
      let list = res.data.records;
      let payType = 3;
      let payList = [];
      list.forEach(item => {
        if(item.payType === 2) {
          item.default = 1;
          payList.push(item);
        }
      });
      this.getPayInfo({
        id: options.id,
        payType,
        openId: userInfo.openId,
      })
      this.setData({
        payList,
        payType,
      })
    })
  },

  // 获取支付信息
  getPayInfo(data) {
    cartApi.getPayInfo(data).then(res => {
      this.setData({
        payData: res,
        orderCreateTime: dayjs(res.orderCreateTime).format("YYYY-MM-DD HH:mm:ss"),
      })
    });
  },

  // 监听倒计时
  handleChangeTime(e) {
    this.setData({
      timeData: e.detail,
    });
  },

  // 选择支付方式
  onChangeType({
    currentTarget
  }) {
    let payList = this.data.payList;
    let index = currentTarget.dataset.index;
    payList.forEach((item, idx) => {
      if(index === idx) {
        item.default = 1;
      } else {
        item.default = 0;
      }
    });
    this.setData({
      payList,
    })
  },

  // 点击确定支付
  onPay() {
    const payData = this.data.payData;
    const payObj = JSON.parse(payData.prepayData);
    const that = this;
    wx.requestPayment({
      timeStamp: payObj.timeStamp,
      nonceStr: payObj.nonceStr,
      package: payObj.packageKey,
      // package: `prepay_id=${payObj.prepayId}`,
      signType: 'MD5',
      paySign: payObj.paySign,
      success (res) {
        that.setData({
          isPay: true,
        })
      },
      fail (res) {
        showToast({ title: "支付失败"});
        router.goTabbar("user");
      }
    })
  },

  getOrderDetail() {
    cartApi.getOrderDetail()
  },

  onSuccess() {
    router.goTabbar();
  }
})