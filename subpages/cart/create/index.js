import create from '../../../utils/create'
import store from '../../../store/index'
import router from '../../../utils/router'
import cartApi from '../../../apis/cart'
import { showToast } from '../../../utils/tools'
import util from '../../../utils/util'

create.Page(store, {
  use: [
    "systemInfo"
  ],

  data: {
    backTopHeight: 120,
    addressInfo: {},
    orderInfo: {},
    useCoupon: true,
    couponPopup: false,
    note: "",
  },

  onLoad: function (options) {
    let { systemInfo } = this.data.$;
    let backTopHeight = (systemInfo.navBarHeight - 56) / 2 + systemInfo.statusHeight;
    this.setData({
      backTopHeight
    })

  },
  
  onShow: function () {
    this.getDefaultAddress();
    this.getConfirmInfo();
  },

  onHide: function () {

  },

  // 获取默认地址
  getDefaultAddress() {
    const chooseAddress = wx.getStorageSync("CHOOSE_ADDRESS");
    const addressInfo = this.data.addressInfo;
    if(chooseAddress) {
      this.setData({
        addressInfo: chooseAddress
      })
      wx.removeStorage({
        key: "CHOOSE_ADDRESS"
      });
      return;
    }
    cartApi.getDefaultAddress({}, {
      showLoading: false,
    }).then(res => {
      if(!addressInfo.consignee) {
        this.setData({
          addressInfo: res,
        })
      }
    });
  },

  getConfirmInfo() {
    const goodList = wx.getStorageSync("GOOD_LIST");
    const postData = {
      orderType: 1,
      storeGoodsInfos: goodList
    }
    cartApi.getConfirmInfo(postData).then(res => {
      let orderInfo = res;
      // let storeGood = orderInfo.storeGoodsInfos;
      orderInfo.reduceAmount = util.divide(orderInfo.reduceAmount, 100);
      orderInfo.shippingFeeAmount = util.divide(orderInfo.shippingFeeAmount, 100);
      orderInfo.payAmount = util.divide(orderInfo.payAmount, 100);
      orderInfo.totalAmount = util.divide(orderInfo.totalAmount, 100);
      orderInfo.storeGoodsInfos.forEach(item => {
        item.totalAmount = util.divide(item.totalAmount, 100);
        item.payAmount = util.divide(item.payAmount, 100);
        item.shippingFeeAmount = util.divide(item.shippingFeeAmount, 100);
        item.goodsInfos.forEach(child => {
          child.skuSalePrice = util.divide(child.skuSalePrice, 100);
        });
      })
      this.setData({
        orderInfo,
      })
    })
  },

  // 返回上一页
  onBack() {
    router.go();
  },
  
  // 跳转选择地址
  onToAddress() {
    router.push({
      name: "address",
      data: {
        isChoose: true,
      }
    })
  },

  // 监听下单数量
  handleChangeNum({
    detail
  }) {
    const orderInfo = this.data.orderInfo;
    orderInfo.storeGoodsInfos[detail.idx] = detail.data;
    this.setData({
      orderInfo
    })
  },

  // 打开优惠券弹窗
  onOpenCoupon() {
    // this.setData({
    //   couponPopup: true
    // })
  },

  // 监听优惠券弹窗关闭
  handleCloseCoupon() {
    this.setData({
      couponPopup: false
    })
  },

  // 输入留言
  handleMsgInput({
    detail
  }) {
    this.setData({
      note: detail.value
    })
  },

  // 确认下单 跳转收银台
  onToCashier() {
    const {
      addressInfo,
      orderInfo,
      note,
    } = this.data;
    if(!addressInfo.consignee) {
      showToast({ title: "请选择收货地址" });
      return;
    }
    if(orderInfo.storeGoodsInfos.length < 1) {
      showToast({ title: "未获取到商品信息，请重试" });
      return;
    }
    const postData = {
      orderType: 1,
      payType: 0,
      activityId: "",
      objectId: "",
      sourceId: "miniprogram",
      token: orderInfo.token,
      totalAmount: util.multiply(orderInfo.totalAmount, 100),
      payAmount: util.multiply(orderInfo.payAmount, 100),
      note: note,
      shippingFeeAmount: orderInfo.shippingFeeAmount || 0,
      deliveryInfo: {
        consignee: addressInfo.consignee,
        phone: addressInfo.phone,
        address: addressInfo.address,
        provinceId: addressInfo.provinceId,
        provinceName: addressInfo.provinceName,
        cityId: addressInfo.cityId,
        cityName: addressInfo.cityName,
        districtName: addressInfo.districtName,
        fullAddress: addressInfo.fullAddress,
        streetName: addressInfo.streetName || "",
      },
      storeGoodsInfos: [],
    };
    orderInfo.storeGoodsInfos.forEach(item => {
      // let storeGood = {"goodsInfos":[{"skuId":1,"skuNum":1,"spuId":2015}],"storeNo":"store_m_1"}
      let storeGood = {
        storeNo: item.storeNo,
        goodsInfos: []
      };
      item.goodsInfos.forEach(child => {
        storeGood.goodsInfos.push({
          spuId: child.spuId,
          skuId: child.skuId,
          skuNum: child.skuNum,
        });
      });
      postData.storeGoodsInfos.push(storeGood);
    })
    cartApi.createOrder(postData).then(res => {
      wx.setStorageSync("order_info", res);
      router.push({
        name: "cashier",
        data: res,
      })
    });
  }
})