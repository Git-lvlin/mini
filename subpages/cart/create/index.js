import create from '../../../utils/create'
import store from '../../../store/index'
import router from '../../../utils/router'
import cartApi from '../../../apis/cart'

create.Page(store, {
  use: [
    "systemInfo"
  ],

  data: {
    backTopHeight: 120,
    addressInfo: {},
    orderInfo: {},
    useCoupon: true,
    couponMoney: 2,
    couponPopup: false,
    shop:[
      {
        shopName: "RAP",
        shopAvatar: "https://dev-yeahgo.oss-cn-shenzhen.aliyuncs.com/miniprogram/common/logo.png",
        total: 33.80,
        otherPrice: 5,
        goods: [
          {
            cover: "https://dev-yeahgo.oss-cn-shenzhen.aliyuncs.com/miniprogram/common/logo.png",
            name: "乐事无限清新清爽翡翠黄瓜味乐事无限清新清爽翡翠黄瓜味",
            sku: "翡翠黄瓜味",
            price: 28.80,
            num: 1,
            stock: 3,
          },
          {
            cover: "https://dev-yeahgo.oss-cn-shenzhen.aliyuncs.com/miniprogram/common/logo.png",
            name: "乐事无限清新清爽翡翠黄瓜味乐事无限清新清爽翡翠黄瓜味",
            sku: "翡翠黄瓜味",
            price: 28.80,
            num: 1,
            stock: 3,
          }
        ]
      }
    ]
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
      this.setData({
        addressInfo: res,
      })
    });
  },

  getConfirmInfo() {
    const goodList = wx.getStorageSync("GOOD_LIST");
    const postData = {
      orderType: 1,
      storeGoodsInfos: goodList
    }
    cartApi.getConfirmInfo(postData).then(res => {
      this.setData({
        orderInfo: res,
      })
    })
  },

  // 返回上一页
  onBack() {
    router.go();
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

  // 跳转选择地址
  onToAddress() {
    router.push({
      name: "address",
      data: {
        isChoose: true,
      }
    })
  },

  // 确认下单 跳转收银台
  onToCashier() {
    router.push({
      name: "cashier"
    })
  }
})