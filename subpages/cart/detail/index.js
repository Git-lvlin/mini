import create from '../../../utils/create'
import store from '../../../store/good'
import routes from '../../../constants/routes'
import goodApi from '../../../apis/good'
import { showModal } from '../../../utils/tools'


create.Page(store, {
  goodId: 0,

  use: [
    "systemInfo",
    "cartList",
  ],

  computed: {
    quantity: ({
      options,
      store,
    }) => {
      const cartList = store.data.cartList;
      const goodId = options.id;
      let quantity = 0;
      cartList.forEach(item => {
        if(item.spuId === goodId) {
          quantity = item.quantity
        }
      })
      return quantity
    }
  },

  data: {
    good: {},
    stock: 0,
    backTopHeight: 56,
    swiperCurrent: 1,
    showSpec: false,
    detailImg: [],
  },

  onLoad: function (options) {
    let { systemInfo } = this.data.$;
    let backTopHeight = (systemInfo.navBarHeight - 56) / 2 + systemInfo.statusHeight;
    this.goodId = options.id
    this.setData({
      backTopHeight,
    })
    this.getGoodDetail();
    this.getDetailImg();
  },

  onShow: function () {

  },

  onShareAppMessage: function () {

  },

  // 商品详情图片
  getDetailImg() {
    goodApi.getDetailImg({
      spuId: this.goodId,
    }).then(res => {
      this.setData({
        detailImg: res.images
      })
    });
  },

  // 商品详情
  getGoodDetail() {
    goodApi.getGoodDetail({
      id: this.goodId
    }).then(res => {
      this.setData({
        good: res
      })
    });
  },

  // 返回按钮
  onToBack() {
    const pages = getCurrentPages();
    if(pages.length > 2) {
      wx.navigateBack({
        delta: 1
      });
    } else {
      wx.reLaunch({
        url: routes.home.path,
      });
    }
  },

  // 监听swiper当前轮播图
  handleSwiperChange({ detail }) {
    this.setData({
      swiperCurrent: detail.current + 1
    })
  },

  // 增加数量
  addCart() {
    let {
      good
    } = this.data;
    // if(good.isMultiSpec == 1) {
    //   store.onChangeSpecState(true);
    // } else {
      this.updateCart({
        skuId: good.defaultSkuId,
        quantity: 1,
      })
    // }
  },

  // 减少数量
  reduceCart() {
    let {
      good,
      quantity,
    } = this.data;
    if(quantity === 1) {
      showModal({
        content: "您确定要清除该商品？",
        ok: () => {
          this.updateCart({
            skuId: good.defaultSkuId,
            quantity: -1,
          })
        }
      });
      return ;
    }
    this.updateCart({
      skuId: good.defaultSkuId,
      quantity: -1,
    })
  },

  // 更新购物车数量
  updateCart(data, showMsg = false) {
    this.store.addCart(data, showMsg)
  }

})