import create from '../../../utils/create'
import store from '../../../store/index'
import router from '../../../utils/router'
import cartApi from '../../../apis/order'
import commonApi from '../../../apis/common'
import { getStorageUserInfo, showToast } from '../../../utils/tools'
import { getPayInfo } from '../../../utils/orderPay'
import util from '../../../utils/util'
import { PAY_TYPE_KEY } from '../../../constants/common'

const refreshOrderToken = {
  20802: "库存不足！",
  20809: "优惠券不可用",
}

const backDetail = {
  20800: "系统异常，请联系管理员",
  20801: "请勿重复提交！",
  20803: "订单金额错误！",
  20804: "订单不存在！",
  20805: "获取预付Id异常！",
  20806: "禁止非本人操作！",
  20807: "更新订单状态失败！",
  20808: "重复处理错误",
  20811: "当前状态不可做此操作",
};

create.Page(store, {
  use: [
    "systemInfo"
  ],

  orderType: 1,
  payType: 2,
  env: "pro",
  orderId: "",
  // 修改的商品信息
  changeStoreData: [],
  
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
    storeActivityGood: "",
    objectId: "",
    activityId: "",
    selectAddressType: "",
    orderToken: "",
  },

  onLoad(options) {
    let { systemInfo } = this.data.$;
    let backTopHeight = (systemInfo.navBarHeight - 56) / 2 + systemInfo.statusHeight;
    let orderType = options.orderType || 1;
    // 团约商品
    let teamGoods = options.orderType == 4 ? options : {};
    if (teamGoods.storeGoodsInfos) {
      teamGoods.storeGoodsInfos =JSON.parse(options.storeGoodsInfos);
    }
    this.orderType = orderType;
    // 活动页面 - 单独购买
    this.isActivityCome = !!options.isActivityCome;
    this.setData({
      backTopHeight,
      orderType,
      objectId: options.objectId ? options.objectId : "",
      activityId: options.activityId ? options.activityId : "",
      teamGoods,
    });
    this.getOrderToken();
    const env = wx.getStorageSync("SYS_ENV") || "pro";
    this.env = env;
    if(env === "uat" || env === "fat" || env === "pro") {
      this.getPayType();
    }
  },
  
  onShow() {
    this.getDefaultAddress();
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
      }, () => {
        this.getConfirmInfo();
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
        if(this.orderType == 15) {
          this.setStoreAddress(res);
        }
      }
    }).catch(err => {
      this.setStoreAddress(err);
    });
  },

  // 设置提货人
  setStoreAddress(address) {
    let data = wx.getStorageSync("CREATE_INTENSIVE");
    let userData = wx.getStorageSync("STORE_SHIPPER_INFO");
    let {
      storeAdress,
    } = data;
    if(userData) {
      storeAdress.linkman = userData.user;
      storeAdress.phone = userData.phone;
    } else if (!!address.consignee) {
      storeAdress.linkman = address.consignee;
      storeAdress.phone = address.phone;
    } else {
      storeAdress.linkman = "请输入提货人信息";
      storeAdress.phone = "";
    }
    this.setData({
      storeAdress
    });
  },

  // 获取确认订单信息
  getConfirmInfo() {
    let goodList = [];
    let postData = {};
    let {
      addressInfo,
      teamGoods,
    } = this.data;
    let deliveryInfo = this.mapAddress(addressInfo);
    postData.deliveryInfo = deliveryInfo;
    if(this.orderType == 15) {
      // 集约
      console.log(1111)
      let data = wx.getStorageSync("CREATE_INTENSIVE");
      let {
        storeAdress,
        selectAddressType,
        ...other
      } = data;
      postData = other;
      postData.deliveryInfo = this.mapAddress(storeAdress);
      this.setData({
        selectAddressType,
        storeActivityGood: other,
      });
    }  else if(this.orderType == 3 || this.isActivityCome || this.orderType == 11) {
      // 单约 || 单独购买 || 1688
      console.log(222)
      let data = wx.getStorageSync("CREATE_INTENSIVE");
      postData = {
        ...postData,
        ...data,
      };
      this.setData({
        storeActivityGood: data
      })
    } else if(this.orderType == 4) {
      console.log(333)
      // 团约
      postData = {
        ...postData,
        ...teamGoods,
      };
      this.setData({
        storeActivityGood: teamGoods
      })
    } else {
      console.log(444)
      // 普通商品
      goodList = wx.getStorageSync("GOOD_LIST");
      postData = {
        deliveryInfo,
        storeGoodsInfos: goodList
      };
    }
    if(this.changeStoreData.length) {
      postData.storeGoodsInfos = this.changeStoreData;
    }
    cartApi.getConfirmInfo(postData).then(res => {
      let orderInfo = res;
      let skuNum = 1;
      let haveMinSkuNum = false;
      // let storeGood = orderInfo.storeGoodsInfos;
      orderInfo.reduceAmount = util.divide(orderInfo.reduceAmount, 100);
      orderInfo.shippingFeeAmount = util.divide(orderInfo.shippingFeeAmount, 100);
      orderInfo.payAmount = util.divide(orderInfo.payAmount, 100);
      orderInfo.totalAmount = util.divide(orderInfo.totalAmount, 100);
      orderInfo.storeGoodsInfos.forEach((item, index) => {
        item.totalAmount = util.divide(item.totalAmount, 100);
        item.payAmount = util.divide(item.payAmount, 100);
        item.shippingFeeAmount = util.divide(item.shippingFeeAmount, 100);
        item.goodsInfos.forEach((child, idx) => {
          child.skuSalePrice = util.divide(child.skuSalePrice, 100);
          // 设置最小购买数
          skuNum  = postData.storeGoodsInfos[index].goodsInfos[idx].skuNum;
          if(skuNum < child.buyMinNum) {
            haveMinSkuNum = true;
            postData.storeGoodsInfos[index].skuNum = child.buyMinNum;
          }
        });
      })
      if(haveMinSkuNum) {
        this.updateOrderAmount(postData);
        // return;
      }
      this.setData({
        orderInfo,
      })
    })
  },

  // 获取订单token
  getOrderToken() {
    cartApi.getOrderToken({}, {
      showLoading: false,
    }, {
      showLoading: false
    }).then(res => {
      console.log(res)
      this.setData({
        orderToken: res,
      })
    });
  },

  // 获取支付类型
  getPayType() {
    const that = this;
    commonApi.getResourceDetail({
      resourceKey: PAY_TYPE_KEY,
    }, {
      showLoading: false,
    }).then(res => {
      let list = res.data.records;
      list.forEach((item, index) => {
        if(item.state === 1 && item.payType === 7) {
          that.payType = 7;
        }
      })
    })
  },

  // 组装提交的地址数据
  mapAddress(info) {
    if(!info.phone) return undefined;
    let data = {
      consignee: info.consignee || info.linkman,
      phone: info.phone,
      address: info.address,
      provinceId: info.provinceId,
      provinceName: info.provinceName,
      cityId: info.cityId,
      cityName: info.cityName,
      districtId: info.districtId,
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
      storeActivityGood,
      storeAdress,
      addressInfo,
      note,
      selectAddressType,
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
          activityId: child.activityId,
          orderType: child.orderType,
          objectId: child.objectId,
        })
      });
      storeGoodsInfos.push(storeItem);
    })
    let postData = {};
    if (this.orderType == 15 && selectAddressType.type == 2) {
      postData = {
        changeStore: detail,
        note,
        deliveryInfo: {
          provinceId: storeAdress.provinceId,
          cityId: storeAdress.cityId,
          districtId: storeAdress.districtId,
          districtName: storeAdress.districtName,
          streetName: storeAdress.streetName || "",
        },
        storeGoodsInfos,
      }
    } else {
      postData = {
        changeStore: detail,
        note,
        storeGoodsInfos,
      }
      if (addressInfo.provinceId) {
        postData.deliveryInfo = {
          provinceId: addressInfo.provinceId,
          cityId: addressInfo.cityId,
          districtId: storeAdress.districtId,
          districtName: addressInfo.districtName,
          streetName: addressInfo.streetName || "",
        }
      }
    }
    this.changeStoreData = postData.storeGoodsInfos;
    this.updateOrderAmount(postData);
  },

  // 更新订单数据
  updateOrderAmount(postData) {
    let {
      orderInfo
    } = this.data;
    const {
      changeStore,
      ...data
    } = postData;
    cartApi.getOrderAmount(data).then(res => {
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
      if(changeStore.data && changeStore.data.storeNo) {
        orderInfo.storeGoodsInfos[changeStore.idx] = {
          ...orderInfo.storeGoodsInfos[changeStore.idx],
          goodsInfos: changeStore.data.goodsInfos,
        }
      }
      this.setData({
        orderInfo
      })
    });
  },

  // 打开优惠券弹窗
  onOpenCoupon() {
    this.setData({
      couponPopup: true
    })
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

  // 提交订单 - 普通商品数据处理
  getSubmitGood() {
    const {
      addressInfo,
      orderInfo,
      note,
      storeActivityGood,
      orderToken,
    } = this.data;
    const {
      orderType,
      objectId,
      activityId,
    } = storeActivityGood;
    if(!addressInfo.consignee) {
      showToast({ title: "请选择收货地址" });
      return;
    }
    if(orderInfo.storeGoodsInfos.length < 1) {
      showToast({ title: "未获取到商品信息，请重试" });
      return;
    }
    const postData = {
      orderType: this.orderType,
      payType: 0,
      activityId: "",
      objectId: "",
      sourceId: "miniprogram",
      token: orderToken,
      totalAmount: util.multiply(orderInfo.totalAmount, 100),
      payAmount: util.multiply(orderInfo.payAmount, 100),
      deliveryMode: 1,
      note: note,
      shippingFeeAmount: orderInfo.shippingFeeAmount || 0,
      deliveryInfo: this.mapAddress(addressInfo),
      storeGoodsInfos: [],
    };
    if(orderType == 3 || orderType == 4 || orderType == 11) {
      if(!!activityId) postData.activityId = activityId;
      if(!!objectId) postData.objectId = objectId;
    }
    postData.storeGoodsInfos = this.getStoreGoodsInfos(orderInfo.storeGoodsInfos);
    return postData;
  },

  // 提交订单 - 集约商品数据处理
  getStoreGood() {
    const {
      storeAdress,
      note,
      orderInfo,
      addressInfo,
      selectAddressType,
      orderToken,
    } = this.data;
    if(!addressInfo.consignee && selectAddressType.type == 3) {
      showToast({ title: "请选择收货地址" });
      return;
    }
    if(selectAddressType.type == 2 && (!storeAdress.linkman || !storeAdress.phone)) {
      showToast({ title: "请填写提货人信息" });
      return;
    }
    if(orderInfo.storeGoodsInfos.length < 1) {
      showToast({ title: "未获取到商品信息，请重试" });
      return;
    }
    let postData = {
      payType: 0,
      sourceId: "miniprogram",
      token: orderToken,
      totalAmount: util.multiply(orderInfo.totalAmount, 100),
      payAmount: util.multiply(orderInfo.payAmount, 100),
      deliveryMode: selectAddressType.type,
      note,
      shippingFeeAmount: orderInfo.shippingFeeAmount || 0,
      deliveryInfo: this.mapAddress(storeAdress),
      storeGoodsInfos: this.getStoreGoodsInfos(orderInfo.storeGoodsInfos),
    }
    return postData;
  },
  
  // 遍历店铺商品
  getStoreGoodsInfos(storeList) {
    let storeGoodsInfos = [];
    storeList.forEach(item => {
      let storeGood = {
        storeNo: item.storeNo,
        goodsInfos: []
      };
      item.goodsInfos.forEach(child => {
        storeGood.goodsInfos.push({
          objectId: child.objectId,
          activityId: child.activityId,
          orderType: child.orderType,
          spuId: child.spuId,
          skuId: child.skuId,
          skuNum: child.skuNum,
        });
      });
      storeGoodsInfos.push(storeGood);
    });
    return storeGoodsInfos;
  },

  // 确认下单 跳转收银台
  onToCashier() {
    let userInfo = getStorageUserInfo(true, true);
    if(!userInfo) return;
    const {
      orderInfo,
    } = this.data;
    if(!orderInfo.storeGoodsInfos || !orderInfo.storeGoodsInfos.length) {
      showToast({ title: "未获取到商品信息" });
      return;
    }
    let postData = {};
    if (this.orderType != 15) {
      postData = this.getSubmitGood();
    } else {
      postData = this.getStoreGood();
    }
    if(!postData || !postData.deliveryInfo) return;
    cartApi.createOrder(postData).then(res => {
      res.orderType = this.orderType;
      this.orderId = res.id;
      if(this.env === "uat" || this.env === "fat" || this.env === "pro") {
        this.getPayInfo(res);
        return;
      }
      wx.setStorageSync("order_info", res);
      router.replace({
        name: "cashier",
        data: res,
      })
    }).catch(err => {
      // if(refreshOrderToken[err.code]) {
        this.getOrderToken();
      // } else {
        // let timer = setTimeout(() => {
        //   router.go();
        //   clearTimeout(timer);
        // }, 1500);
      // }
    });
  },

  // 生产环境直接调支付
  getPayInfo(orderInfo) {
    getPayInfo({
      id: this.orderId,
      payType: this.payType,
      pullPayment: true,
    }).then(res => {
      const {
        payData,
        isPay,
      } = res;
      wx.setStorageSync("pay_data", payData);
      router.replace({
        name: "cashier",
        data: {
          isPay,
          ...orderInfo,
        },
      })
    });
  },
})