import create from '../../../utils/create'
import store from '../../../store/index'
import router from '../../../utils/router'

create.Page(store, {
  use: [
    "systemInfo"
  ],

  data: {
    backTopHeight: 120,
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

  },

  onHide: function () {

  },

  onBack() {
    router.go();
  },

  onOpenCoupon() {
    this.setData({
      couponPopup: true
    })
  },

  handleCloseCoupon() {
    this.setData({
      couponPopup: false
    })
  }
})