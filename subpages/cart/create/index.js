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
  20809: "红包不可用",
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
const app = getApp();
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
  // 获取各类金额入参
  getAmountData: {},

  data: {
    orderType: 1,
    backTopHeight: 120,
    addressInfo: {},
    orderInfo: {},
    useCoupon: true,
    couponPopup: false,
    storeAdress: "",
    storeActivityGood: "",
    objectId: "",
    activityId: "",
    selectAddressType: "",
    orderToken: "",
    // 是否允许选择红包
    unOpenCoupon: false,
    lateDeliveryDesc: "",
  },

  onLoad(options) {
    console.log('确认订单-options', options)
    let { systemInfo } = this.data.$;
    let backTopHeight = (systemInfo.navBarHeight - 56) / 2 + systemInfo.statusHeight;
    let orderType = options.orderType || 1;
    // 团约商品
    let teamGoods = options.orderType == 4 ? options : {};
    let unOpenCoupon = options.orderType == 17 || options.orderType == 18 ? false : true;
    if (teamGoods.storeGoodsInfos) {
      teamGoods.storeGoodsInfos =JSON.parse(options.storeGoodsInfos);
    }
    this.shareStoreNo = options.shareStoreNo || ''
    this.orderType = orderType;
    // 活动页面 - 单独购买
    this.isActivityCome = !!options.isActivityCome;
    this.setData({
      unOpenCoupon,
      backTopHeight,
      orderType,
      objectId: options.objectId ? options.objectId : "",
      activityId: options.activityId ? options.activityId : "",
      teamGoods,
    });
    this.getOrderToken();
    const env = wx.getStorageSync("SYS_ENV") || "pro";
    this.env = env;
    if(env === "fat" || env === "pro") {
      this.getPayType();
    }
  },
  
  onShow() {
    this.getDefaultAddress();
    app.trackEvent('shopping_confirmOrder');
  },

  // 获取默认地址
  getDefaultAddress() {
    const chooseAddress = wx.getStorageSync("CHOOSE_ADDRESS");
    let {
      addressInfo,
    } = this.data;
    if(chooseAddress) {
      this.setData({
        addressInfo: chooseAddress
      }, () => {
        // 必须获取地址再请求商品信息
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
      if(this.orderType == 15 || this.orderType == 16) {
        this.setStoreAddress(res);
      } else {
        if(!addressInfo.consignee) {
          // 首次加载，设置默认地址
          if(res.consignee) {
            // 有默认地址
            addressInfo = res;
          } else {
            // 没有默认地址，读上一次下单地址
            const orderAddress = wx.getStorageSync("ORDER_LAST_ADDRESS");
            if(orderAddress.consignee) {
              addressInfo = orderAddress;
            }
          }
          this.setData({
            addressInfo,
          }, () => {
            // 必须获取地址再请求商品信息
            this.getConfirmInfo();
          })
        }
      }
    }).catch(err => {
      this.setStoreAddress(err);
    });
  },

  // 设置提货人
  setStoreAddress(address) {
    let data = wx.getStorageSync("CREATE_INTENSIVE");
    // 集约提货人其他信息
    let {
      storeAdress,
      selectAddressType,
    } = data;
    if(selectAddressType.type == 2) {
      let userData = wx.getStorageSync("ORDER_STORE_LOCATION");
      if(userData && userData.setUser) {
        storeAdress.linkman = userData.setUser;
        storeAdress.phone = userData.setPhone;
      } else if (!!address.consignee) {
        storeAdress.linkman = address.consignee;
        storeAdress.phone = address.phone;
      } else {
        storeAdress.linkman = "请输入提货人信息";
        storeAdress.phone = "";
      }
    } else if(selectAddressType.type == 3) {
      const setStoreAddress = wx.getStorageSync('ORDER_STORE_LOCATION');
      if(setStoreAddress && setStoreAddress.setUser) {
        storeAdress.linkman = setStoreAddress.setUser;
        storeAdress.setUser = setStoreAddress.setUser;
        storeAdress.phone = setStoreAddress.setPhone;
        storeAdress.setPhone = setStoreAddress.setPhone;
        storeAdress.setAddress = setStoreAddress.setAddress;
        storeAdress.setAllAddress = setStoreAddress.setAllAddress;
      } else {
        wx.setStorageSync('ORDER_STORE_LOCATION', storeAdress);
      }
    }
    this.setData({
      storeAdress
    }, () => {
      // 必须获取地址再请求商品信息
      this.getConfirmInfo();
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
    // postData.deliveryInfo = deliveryInfo;
    if(this.orderType == 15 || this.orderType == 16) {
      // 集约
      let data = wx.getStorageSync("CREATE_INTENSIVE");
      let {
        storeAdress,
        selectAddressType,
        ...other
      } = data;
      postData = other;
      deliveryInfo = this.mapAddress(storeAdress);
      this.setData({
        selectAddressType,
        storeActivityGood: other,
      });
    }  else if(this.orderType == 3) {
      // 单约
      let data = wx.getStorageSync("CREATE_INTENSIVE");
      postData = {
        ...postData,
        ...data,
      };
      this.setData({
        storeActivityGood: data
      })
    } else if(this.orderType == 4) {
      // 团约
      postData = {
        ...postData,
        ...teamGoods,
      };
      this.setData({
        storeActivityGood: teamGoods
      })
    } else {
      // 普通商品
      goodList = wx.getStorageSync("GOOD_LIST") || [];
      postData = {
        // deliveryInfo,
        storeGoodsInfos: goodList.storeGoodsInfos
      };
    }
    if(this.changeStoreData.length) {
      postData.storeGoodsInfos = this.changeStoreData;
    }
    console.log('postData', postData)
    cartApi.getConfirmInfo(postData).then(res => {
      let orderInfo = res;
      let skuNum = 1;
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
            postData.storeGoodsInfos[index].skuNum = child.buyMinNum;
          }
        });
      })
      if(orderInfo.usefulCoupon) {
        orderInfo.usefulCoupon = this.mapCoupon(orderInfo.usefulCoupon);
        orderInfo.usefulCoupon.forEach(item => {
          if(!!item.isDefault) {
            orderInfo.currentCoupon = item;
          }
        });
      }
      if(orderInfo.unusefulCoupon) {
        orderInfo.unusefulCoupon = this.mapCoupon(orderInfo.unusefulCoupon);
      }
      postData.deliveryInfo = deliveryInfo;
      if(orderInfo.currentCoupon) {
        postData.couponAmount = util.multiply(orderInfo.currentCoupon.couponAmount, 100);
        if(orderInfo.currentCoupon.memberCouponId) {
          postData.couponId = orderInfo.currentCoupon.memberCouponId;
        }
      }
      this.getAmountData = postData;
      this.setData({
        orderInfo,
      }, () => {
        this.updateOrderAmount(postData);
        this.getDeliveryDesc(postData);
      })
    })
  },

  // 遍历优惠券数据
  mapCoupon(list = []) {
    list.forEach(item => {
      item.usefulAmount = util.divide(item.usefulAmount, 100);
      item.freeDiscount = util.divide(item.freeDiscount, 100);
      item.couponAmount = util.divide(item.couponAmount, 100);
    });
    return list;
  },

  // 获取订单token
  getOrderToken() {
    cartApi.getOrderToken({}, {
      showLoading: false,
    }, {
      showLoading: false
    }).then(res => {
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
    const {
      orderType,
    } = this.data;
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
    let storeData = wx.getStorageSync("CREATE_INTENSIVE");
    let {
      selectAddressType,
    } = storeData;
    // 集约商家配送
    if(orderType == 15 || orderType == 16) {
      let newStoreAddress = wx.getStorageSync('ORDER_STORE_LOCATION');
      if(newStoreAddress && newStoreAddress.setUser) {
        data.consignee = newStoreAddress.setUser;
        data.phone = newStoreAddress.setPhone;
        if(selectAddressType && selectAddressType.type == 3) {
          // data.address = newStoreAddress.setAllAddress + newStoreAddress.setAddress;
          data.address = newStoreAddress.address + newStoreAddress.setAddress;
          data.fullAddress = newStoreAddress.setAllAddress + newStoreAddress.setAddress;
        }
      }
    }
    return data;
  },

  // 返回上一页
  onBack() {
    router.go();
  },
  
  // 跳转选择地址
  onToAddress() {
    const {
      selectAddressType,
      orderType,
    } = this.data;
    if((orderType == 15 || orderType == 16) && selectAddressType.type == 3) {
      router.push({
        name: "storeAddress",
        data: {}
      })
    } else {
      router.push({
        name: "address",
        data: {
          isChoose: true,
        }
      })
    }
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

  // 弹窗修改购买数
  handleSetSkuNum({
    detail
  }) {
    let {
      orderInfo,
    } = this.data;
    let store = orderInfo.storeGoodsInfos[detail.pidx];
    store.goodsInfos[detail.index] = detail.data;
    this.handleChangeNum({
      detail: {
        idx: detail.pidx,
        data: store,
      }
    });
  },

  // 修改订单备注
  handleChangeNot({
    detail
  }) {
    let {
      orderInfo,
    } = this.data;
    orderInfo.storeGoodsInfos[detail.idx] = detail.data;
    this.setData({
      orderInfo,
    });
  },

  // 监听修改下单数量
  handleChangeNum({
    detail
  }) {
    let {
      orderInfo,
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
    if (this.orderType == 15 || this.orderType == 16) {
      postData = {
        changeStore: detail,
        note,
        deliveryInfo: this.mapAddress(storeAdress),
        storeGoodsInfos,
      }
    } else {
      postData = {
        changeStore: detail,
        note,
        storeGoodsInfos,
      }
      if (addressInfo.provinceId) {
        postData.deliveryInfo = this.mapAddress(addressInfo);
      }
    }
    this.changeStoreData = postData.storeGoodsInfos;
    if(orderInfo.currentCoupon) {
      postData.couponAmount = util.multiply(orderInfo.currentCoupon.couponAmount, 100);
      if(orderInfo.currentCoupon.memberCouponId) {
        postData.couponId = orderInfo.currentCoupon.memberCouponId;
      }
    }
    this.updateOrderAmount(postData);
    this.getAmountData = postData;
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
        shipping,
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
        shipping,
        // storeGoodsInfos: storeShippingFeeAmount
      }
      if(changeStore && changeStore.data && changeStore.data.storeNo) {
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

  // 查询配送信息
  getDeliveryDesc(data) {
    // return;
    const postData = {
      address: data.deliveryInfo,
      goodsInfos: [],
    };
    data.storeGoodsInfos.forEach(store => {
      store.goodsInfos.forEach(good => {
        postData.goodsInfos.push(good);
      });
    });
    cartApi.getDeliveryDesc(postData, {
      showLoading: false
    }).then(res => {
      this.setData({
        lateDeliveryDesc: res.lateDeliveryDesc,
      })
    });
  },

  // 打开红包弹窗
  onOpenCoupon() {
    const {
      unOpenCoupon,
    } = this.data;
    if(!unOpenCoupon) {
      return
    }
    this.setData({
      couponPopup: true
    })
  },

  // 监听红包弹窗关闭
  handleCloseCoupon() {
    this.setData({
      couponPopup: false
    })
  },

  // 处理选择优惠券
  handleChooseCoupon({
    detail
  }) {
    const {
      orderInfo
    } = this.data;
    const getAmountData = this.getAmountData;
    let currentCoupon = orderInfo.currentCoupon;
    if(!!detail.memberCouponId) {
      getAmountData.couponId = detail.memberCouponId;
      getAmountData.couponAmount = util.multiply(detail.couponAmount, 100);
      orderInfo.usefulCoupon.forEach(item => {
        if(item.memberCouponId == detail.memberCouponId) {
          item.isDefault = 1;
          currentCoupon = item;
        }
      })
    } else {
      getAmountData.couponId = '';
      getAmountData.couponAmount = '';
      orderInfo.usefulCoupon.forEach(item => {
        item.isDefault = 0;
      });
      currentCoupon = {};
    }
    this.setData({
      orderInfo,
      currentCoupon,
    })
    this.getAmountData = getAmountData;
    this.updateOrderAmount(getAmountData);
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
      showToast({ title: "抱歉，爆品好货已售光，下次早点抢哦" });
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
      shippingFeeAmount: orderInfo.shippingFeeAmount || 0,
      deliveryInfo: this.mapAddress(addressInfo),
      storeGoodsInfos: [],
    };
    if(orderInfo.currentCoupon) {
      postData.couponAmount = util.multiply(orderInfo.currentCoupon.couponAmount, 100);
      if(orderInfo.currentCoupon.memberCouponId) {
        postData.couponId = orderInfo.currentCoupon.memberCouponId;
      }
    }
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
      orderInfo,
      addressInfo,
      selectAddressType,
      orderToken,
    } = this.data;
    if(!storeAdress.setUser && selectAddressType.type == 3) {
      showToast({ title: "请添加商家配送地址" });
      return;
    }
    if(selectAddressType.type == 2 && (!storeAdress.linkman || !storeAdress.phone)) {
      showToast({ title: "请填写提货人信息" });
      return;
    }
    if(orderInfo.storeGoodsInfos.length < 1) {
      showToast({ title: "抱歉，爆品好货已售光，下次早点抢哦" });
      return;
    }
    let postData = {
      payType: 0,
      sourceId: "miniprogram",
      token: orderToken,
      totalAmount: util.multiply(orderInfo.totalAmount, 100),
      payAmount: util.multiply(orderInfo.payAmount, 100),
      deliveryMode: selectAddressType.type,
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
        note: item.note || "",
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
      addressInfo,
    } = this.data;
    if(!orderInfo.storeGoodsInfos || !orderInfo.storeGoodsInfos.length) {
      showToast({ title: "抱歉，爆品好货已售光，下次早点抢哦" });
      return;
    }
    let postData = {};
    if (this.orderType != 15 && this.orderType != 16) {
      postData = this.getSubmitGood();
    } else {
      postData = this.getStoreGood();
    }
    if(!postData || !postData.deliveryInfo) return;
    if (postData.storeGoodsInfos.length == 1 && this.shareStoreNo) {
      postData.storeGoodsInfos[0].goodsInfos[0].shareStoreNo = this.shareStoreNo
    }
    console.log('确认订单前传参', postData)
    cartApi.createOrder(postData).then(res => {
      res.orderType = this.orderType;
      this.orderId = res.id;
      if(this.env === "fat" || this.env === "pro") {
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
    // 保存上次下单地址
    if(this.orderType != 15 && this.orderType != 16) {
      wx.setStorageSync('ORDER_LAST_ADDRESS', addressInfo);
    }
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
          loadedPay: true,
          ...orderInfo,
        },
      })
      app.trackEvent('goods_pay_success', {
        pay_method_name: '微信支付'
      });
    });
  },
})