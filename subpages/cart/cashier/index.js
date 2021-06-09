import create from '../../../utils/create'
import store from '../../../store/index'
import router from '../../../utils/router'
import util from '../../../utils/util'
import { getStorageUserInfo, showToast } from '../../../utils/tools'
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
  },

  onLoad: function (options) {
    // id: 1390912161480564700
    // orderSn: "16204542762334404122"
    // payAmount: 1
    // payDeadline: 1620454876068
    this.id = options.id
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
      this.setData({
        payList,
        payType,
      })
    });
    if(options.orderType == 3 && options.orderType == 4) {
      this.getHotGood();
    }
  },

  onReady() {
    const userInfo = getStorageUserInfo(true, true);
    if(!userInfo) return;
    this.getPayInfo({
      id: this.id,
      payType: 3,
      openId: userInfo.openId,
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