import { IMG_CDN } from "../../constants/common"
import create from "../../utils/create"
import store from "../../store/good"
import router from "../../utils/router";
 
create.Page(store, {
  ues: [
    "systemInfo",
    "userInfo",
  ],

  data: {
    choose: `${IMG_CDN}miniprogram/common/choose.png`,
    defChoose: `${IMG_CDN}miniprogram/common/def_choose.png`,
    showCouponPopup: false,
    showDeleteGood: false,
    item: {
      activityId: 0,
      id: 6,
      image: "http://dev-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/rc-upload-1618621745937-25jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/resize,m_lfit,h_986,w_1004",
      marketPrice: 388,
      objectId: 0,
      orderType: 2,
      saleNum: 0,
      salePrice: 0,
      skuId: 0,
      spuId: 6,
      subtitle: "性价比高 | 日期新鲜",
      tagId: 2,
      title: "家盟酒堡赤霞珠干红葡萄酒红桶（3年).",
    }
  },


  onLoad(options) {
    console.log("data userInfo", this.data.userInfo);
    console.log("store userInfo", this.store);
  },

  onReady() {
    // const {
    //   bottomBarHeight,
    //   $,
    // } = this.data;
    // this.setData({
    //   bottomBarHeight: bottomBarHeight + $.systemInfo.bottomBarHeight
    // });
  },

  onShow: function () {
    // 更新tabbar显示
    router.updateSelectTabbar(this, 2);
  },

  // 打开订单明细窗口
  openCouopnDetail() {
    this.setData({
      showCouponPopup: !this.data.showCouponPopup
    })
  },

  // 关闭订单明细窗口
  handleCloseCouponDetail({ detail }) {
    this.setData({
      showCouponPopup: detail
    })
  },

  // 监听删除商品
  handleDeleteGood() {
    console.log("删除商品")
    this.handleCloseDeleteGood();
  },

  // 监听关闭删除商品弹窗
  handleCloseDeleteGood() {
    this.setData({
      showDeleteGood: false,
    })
  },

  // 去逛逛
  onToHome() {
    router.goTabbar();
  }
})