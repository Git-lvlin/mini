import create from '../../../utils/create'
import store from '../../../store/index'
import router from '../../../utils/router'
import util from '../../../utils/util'
import { getStorageUserInfo, showToast } from '../../../utils/tools'
import { getPayInfo, onOrderPay } from '../../../utils/orderPay'
import dayjs from '../../../miniprogram_npm/dayjs/index'
import { IMG_CDN, PAY_TYPE_KEY } from '../../../constants/common'
import commonApi from '../../../apis/common'
import cartApi from '../../../apis/order'
import homeApi from '../../../apis/home'

const defaultList = [

]

// create.Page(store, {
Page({

  id: "",
  goodPage: {
    page: 1,
    pageSize: 3,
    totalPage: 1,
  },
  loading: false,
  payType: 7,

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
    teamPopup: false,
    hotGood: [],
    orderCreateTime: "",
  },

  onLoad: function (options) {
    // id: 1390912161480564700
    // orderSn: "16204542762334404122"
    // payAmount: 1
    // payDeadline: 1620454876068
    this.id = options.id
    let downTime = options.payDeadline - options.currentTime;
    const sysEnv = wx.getStorageSync("SYS_ENV") || "pro";
    const payData = wx.getStorageSync("pay_data") || {};
    let orderCreateTime = "";
    if(payData && payData.orderCreateTime && options.isPay) {
      orderCreateTime = dayjs(payData.orderCreateTime).format("YYYY-MM-DD HH:mm:ss");
      wx.removeStorage({
        key: 'pay_data'
      });
    }
    this.setData({
      payAmount: util.divide(options.payAmount, 100),
      downTime,
      sysEnv,
      payData,
      orderCreateTime,
      isPay: options.isPay,
      orderType: options.orderType,
    })
    // 获取支付类型
    commonApi.getResourceDetail({
      resourceKey: PAY_TYPE_KEY,
    }, {
      showLoading: false,
    }).then(res => {
      let list = res.data.records;
      let payList = [];
      list.forEach((item, index) => {
        if(item.payType === 2 || item.payType === 7 || item.payType === 0) {
          // item.default = index === 0 ? 1 : 0;
          if(item.state === 1) {
            payList.push(item);
          }
          if(item.default === 1) {
            this.payType = item.payType;
          }
        }
      });
      this.setData({
        payList,
      })
      if(this.payType !== 0) {
        this.getPayInfo();
      }
    });
    if(options.orderType == 3 && options.orderType == 4) {
      this.getHotGood();
    }
  },

  /**
   * 获取支付信息
   * isNotPayment boolean 是否是模拟支付
   * */ 
  getPayInfo(isNotPayment = false) {
    getPayInfo({
      id: this.id,
      payType: this.payType,
      isNotPayment,
    }).then(res => {
      const {
        payData,
        isPay,
      } = res;
      if(isPay) {
        this.setData({
          isPay
        })
      }
      this.setData({
        payData,
        orderCreateTime: dayjs(payData.orderCreateTime).format("YYYY-MM-DD HH:mm:ss"),
      })
    });
  },

  // 获取热销商品
  getHotGood(nowPage) {
    let {
      page,
      pageSize,
    } = this.goodPage;
    if(this.loading) return;
    page = !!nowPage ? nowPage : page;
    this.loading = true;
    homeApi.getHotGood({
      page,
      pageSize,
    }, {
      showLoading: false,
    }).then(res => {
      this.goodPage.totalPage = res.totalPage;
      this.goodPage.page = page;
      let hotGood = this.data.hotGood;
      if(page != 1) {
        hotGood = hotGood.concat(this.handleListPrice(res.records));
      } else {
        hotGood = this.handleListPrice(res.records)
      }
      this.setData({
        hotGood,
      });
      this.loading = false;
    }).catch(err => {
      this.loading = false;
    })
  },

  // 处理金额
  handleListPrice(list = []) {
    list.forEach(item => {
      item.marketPrice = util.divide(item.marketPrice, 100);
      item.salePrice = util.divide(item.salePrice, 100);
    })
    return list;
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
        this.payType = item.payType;
      } else {
        item.default = 0;
      }
    });
    if(this.payType !== 0) {
      this.getPayInfo();
    }
    this.setData({
      payList,
    })
  },

  // 点击确定支付
  onPay() {
    const that = this;
    if(this.payType === 0) {
      this.getPayInfo(true)
      return ;
    }
    const payData = this.data.payData;
    const data = {
      payType: this.payType,
    };
    onOrderPay({
      data,
      payData,
    }).then(res => {
      that.setData({
        isPay: true,
      })
    }).catch(err => {

    });
  },

  getOrderDetail() {
    cartApi.getOrderDetail()
  },

  onSuccess() {
    router.goTabbar();
  },

  handleCloseTeam() {
    this.setData({
      teamPopup: false
    })
  },

  handleToDetail({ detail }) {
    let params = {
      spuId: detail.spuId,
      skuId: detail.skuId,
      orderType: detail.orderType,
    }
    if(!!detail.activityId) params.activityId = detail.activityId;
    if(!!detail.objectId) params.objectId = detail.objectId;
    router.replace({
      name: "detail",
      data: params,
    });
  },

  onReachBottom() {
    const {
      page,
      totalPage
    } = this.goodPage;
    if(!this.loading && page < totalPage) {
      this.getHotGood(page + 1);
    }
  },
})