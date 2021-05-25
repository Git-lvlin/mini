import create from '../../../utils/create'
import store from '../../../store/index'
import router from '../../../utils/router'
import cartApi from '../../../apis/order'
import { getStorageUserInfo, showToast } from '../../../utils/tools'
import util from '../../../utils/util'

create.Page(store, {
  use: [
    "systemInfo"
  ],

  orderType: 1,
  // 是否活动商品单独购买
  isActivityCome: false,

  data: {
    orderType: 1,
    backTopHeight: 120,
    addressInfo: {},
    orderInfo: {},
    useCoupon: true,
    couponPopup: false,
    note: "",
    storeAdress: "",
    storeIntensiveGood: "",
    objectId: "",
    activityId: "",
  },

  onLoad: function (options) {
    let { systemInfo } = this.data.$;
    let backTopHeight = (systemInfo.navBarHeight - 56) / 2 + systemInfo.statusHeight;
    let orderType = !options.isActivityCome ? 1 : options.orderType || 1;
    this.orderType = orderType;
    console.log("🚀 ~ options", options)
    console.log("🚀 ~ orderType", orderType)
    this.isActivityCome = !!options.isActivityCome;
    this.setData({
      backTopHeight,
      orderType,
      objectId: options.objectId ? options.objectId : "",
      activityId: options.activityId ? options.activityId : "",
    })
  },
  
  onShow: function () {
    this.getDefaultAddress();
    if(this.orderType == 15) {
      let userData = wx.getStorageSync("STORE_SHIPPER_INFO");
      if(!userData) return;
      const storeAdress = this.data.storeAdress;
      storeAdress.linkman = userData.user;
      storeAdress.phone = userData.phone;
      this.setData({
        storeAdress
      });
    }
  },

  onHide: function () {

  },

  // 获取默认地址
  getDefaultAddress() {
    const chooseAddress = wx.getStorageSync("CHOOSE_ADDRESS");
    const {
      addressInfo,
    } = this.data;
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
        }, () => {
          this.getConfirmInfo();
        })
        this.setStoreAddress(res);
      }
    }).catch(err => {
      this.setStoreAddress(err);
    });
  },

  // 设置提货人
  setStoreAddress(address) {
    if(this.orderType == 15) {
      let data = wx.getStorageSync("CREATE_INTENSIVE");
      let {
        storeAdress,
      } = data;
      if(!!address.consignee) {
        storeAdress.linkman = address.consignee;
        storeAdress.phone = address.phone;
      } else {
        storeAdress.linkman = "请输入提货人信息";
        storeAdress.phone = "";
      }
      this.setData({
        storeAdress
      })
    }
  },

  getConfirmInfo() {
    let goodList = [];
    let postData = {};
    let {
      addressInfo
    } = this.data;
    let deliveryInfo = this.mapAddress(addressInfo);
    postData.deliveryInfo = deliveryInfo;
    if(this.orderType == 15) {
      // 集约
      let data = wx.getStorageSync("CREATE_INTENSIVE");
      let {
        storeAdress,
        ...other
       } = data;
       postData = other;
       postData.deliveryInfo = this.mapAddress(storeAdress);
       this.setData({
        storeIntensiveGood: other
       })
    } else if(this.orderType == 3) {
      // 单约
      let data = wx.getStorageSync("CREATE_INTENSIVE");
       postData = {
         ...postData,
         ...data,
       };
       this.setData({
        storeIntensiveGood: data
       })
    } else if(this.isActivityCome && this.orderType == 1) {
      // 活动商品单独购买
      let data = wx.getStorageSync("CREATE_INTENSIVE");
      postData = {
        ...postData,
        ...data,
      };
       this.setData({
        storeIntensiveGood: data
       })
    } else {
      // 
      goodList = wx.getStorageSync("GOOD_LIST");
      postData = {
        orderType: 1,
        deliveryInfo,
        storeGoodsInfos: goodList
      };
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

  // 组装提交的地址数据
  mapAddress(info) {
    let data = {
      consignee: info.consignee,
      phone: info.phone,
      address: info.address,
      provinceId: info.provinceId,
      provinceName: info.provinceName,
      cityId: info.cityId,
      cityName: info.cityName,
      districtName: info.districtName,
      fullAddress: info.fullAddress,
      streetName: info.streetName || "",
    };
    return data;
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

  // 跳转修改提货人
  onToChangeUser() {
    const {
      storeAdress
    } = this.data;
    router.push({
      name: "changeShipper",
      data: {
        storeNo: storeAdress.storeNo,
      }
    })
  },

  // 监听修改下单数量
  handleChangeNum({
    detail
  }) {
    let {
      orderInfo,
      storeIntensiveGood,
      storeAdress,
      addressInfo,
      note,
      activityId,
      objectId,
    } = this.data;
    let storeGoodsInfos = [];
    let storeItem = {};
    orderInfo.storeGoodsInfos[detail.idx] = detail.data;
    orderInfo.storeGoodsInfos.forEach(item => {
      storeItem = {
        storeNo: item.storeNo,
        goodsInfos: [],
      };
      item.goodsInfos.forEach(child => {
        storeItem.goodsInfos.push({
          spuId: child.spuId,
          skuId: child.skuId,
          skuNum: child.skuNum,
        })
      });
      storeGoodsInfos.push(storeItem);
    })
    let postData = {};
    if(this.orderType == 1) {
      postData = {
        orderType: 1,
        note,
        deliveryInfo: {
          provinceId: addressInfo.provinceId,
          cityId: addressInfo.cityId,
          districtName: addressInfo.districtName,
          streetName: addressInfo.streetName || "",
        },
        storeGoodsInfos,
      }
    } else {
      postData = {
        orderType: storeIntensiveGood.orderType,
        note,
        deliveryInfo: {
          provinceId: storeAdress.provinceId,
          cityId: storeAdress.cityId,
          districtName: storeAdress.districtName,
          streetName: storeAdress.streetName || "",
        },
        storeGoodsInfos,
      }
      if(!!activityId) postData.activityId = activityId
      if(!!objectId) postData.objectId = objectId
    }
    cartApi.getOrderAmount(postData).then(res => {
      const {
        payAmount,
        reduceAmount,
        shippingFeeAmount,
        totalAmount,
        storeShippingFeeAmount,
      } = res;
      storeShippingFeeAmount.forEach(item => {
        item.totalAmount = util.divide(item.totalAmount, 100);
        item.payAmount = util.divide(item.payAmount, 100);
        item.shippingFeeAmount = util.divide(item.shippingFeeAmount, 100);
        item.goodsInfos.forEach(child => {
          child.skuSalePrice = util.divide(child.skuSalePrice, 100);
        });
      })
      orderInfo = {
        ...orderInfo,
        payAmount: util.divide(payAmount, 100),
        reduceAmount: util.divide(reduceAmount, 100),
        shippingFeeAmount: util.divide(shippingFeeAmount, 100),
        totalAmount: util.divide(totalAmount, 100),
        storeGoodsInfos: storeShippingFeeAmount
      }
      this.setData({
        orderInfo
      })
    });
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

  // 提交普通商品数据处理
  getSubmitGood() {
    const {
      addressInfo,
      orderInfo,
      note,
      storeIntensiveGood,
    } = this.data;
    const {
      orderType,
      objectId,
      activityId,
    } = storeIntensiveGood;
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
    if(orderType == 3) {
      postData.orderType = 3;
      if(!!activityId) postData.activityId = activityId;
      if(!!objectId) postData.objectId = objectId;
    }
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
    return postData;
  },

  // 提交集约商品数据处理
  getStoreGood() {
    const {
      storeIntensiveGood,
      storeAdress,
      note,
      orderInfo,
    } = this.data;
    if(storeIntensiveGood.storeGoodsInfos.length < 1) {
      showToast({ title: "未获取到商品信息，请重试" });
      return;
    }
    const {
      orderType,
      objectId,
      activityId,
    } = storeIntensiveGood;
    let postData = {
      orderType,
      payType: 0,
      activityId,
      objectId,
      sourceId: "miniprogram",
      token: orderInfo.token,
      totalAmount: util.multiply(orderInfo.totalAmount, 100),
      payAmount: util.multiply(orderInfo.payAmount, 100),
      note,
      shippingFeeAmount: orderInfo.shippingFeeAmount || 0,
      deliveryInfo: {
        consignee: storeAdress.linkman,
        phone: storeAdress.phone,
        address: storeAdress.address,
        provinceId: storeAdress.provinceId,
        provinceName: storeAdress.provinceName,
        cityId: storeAdress.cityId,
        cityName: storeAdress.cityName,
        districtName: storeAdress.districtName,
        fullAddress: storeAdress.fullAddress,
        streetName: storeAdress.streetName || "",
      },
      storeGoodsInfos: storeIntensiveGood.storeGoodsInfos,
    }
    return postData;
  },

  // 确认下单 跳转收银台
  onToCashier() {
    let userInfo = getStorageUserInfo(true, true);
    if(!userInfo) return;
    let postData = {};
    if (this.orderType != 15) {
      postData = this.getSubmitGood();
    } else {
      postData = this.getStoreGood();
    }
    cartApi.createOrder(postData).then(res => {
      wx.setStorageSync("order_info", res);
      res.orderType = this.orderType;
      router.push({
        name: "cashier",
        data: res,
      })
    }).catch(err => {
      let time = setTimeout(() => {
        router.go();
        clearTimeout(time);
      }, 1500);
    });
  }
})