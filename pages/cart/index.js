import { IMG_CDN } from "../../constants/common"
import create from "../../utils/create"
import store from "../../store/good"
import router from "../../utils/router";
import goodApi from "../../apis/good";
import homeApi from "../../apis/home";
import { getStorageUserInfo, showToast, mapNum } from "../../utils/tools";
 
create.Page(store, {
  use: [
    "systemInfo",
    "storeCartList",
    "cartListTotal",
  ],

  computed: {
    selectAll() {
      let type = true;
      this.storeCartList.forEach(item => {
        if(!item.isChecked) {
          type = false;
        }
      });
      return type;
    },
  },

  pageData: {
    hasNext: false,
    next: "",
    size: 20,
  },
  loading: false,

  data: {
    choose: `${IMG_CDN}miniprogram/common/choose.png`,
    defChoose: `${IMG_CDN}miniprogram/common/def_choose.png`,
    showCouponPopup: false,
    showDeleteGood: false,
    hotGoodList: [],
    userInfo: "",
  },


  onLoad(options) {
    console.log("store userInfo", this.store);
  },

  onShow() {
    const userInfo = getStorageUserInfo();
    const {
      hotGoodList,
    } = this.data;
    if(!!userInfo) {
      this.store.updateCart(true);
      this.setData({
        userInfo,
      })
    } else {
      this.store.clearCart();
    }
    // 更新tabbar显示
    router.updateSelectTabbar(this, 2);
    if(hotGoodList.length < 1) {
      this.getHotGood();
    }
  },

  // 全选购物车
  onSelectCartAll() {
    if(!this.store.data.storeCartList.length) return;
    goodApi.checkedAllCart({
      isChecked: !this.data.selectAll,
    }).then(res => {
      this.store.updateCart(true);
    })
  },

  // 获取热销商品
  getHotGood() {
    const {
      next,
      size,
    } = this.pageData;
    if(this.loading) return;
    this.loading = true;
    const postData = {
      size,
    };
    if(!!next) {
      postData.next = next;
    }
    homeApi.getHotGood(postData, {
      showLoading: false
    }).then(res => {
      const list = mapNum(res.records);
      let {
        hotGoodList
      } = this.data;
      this.pageData.hasNext = res.hasNext;
      this.pageData.next = res.next;
      hotGoodList = hotGoodList.concat(list)
      this.setData({
        hotGoodList,
      }, () => {
        this.loading = false;
      });
    }).catch(err => {
      this.loading = false;
    })
  },

  // 滚动到底部
  handleScrollBottom() {
    const {
      hasNext,
    } = this.pageData;
    if(hasNext) {
      this.getHotGood();
    }
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
  },

  // 跳转确认订单
  onToOrder() {
    const {
      storeCartList,
    } = this.store.data;
    const goodList = [];
    let store = {};
    let isSelect = false;
    storeCartList.forEach(item => {
      store = {
        storeNo: item.storeNo,
        goodsInfos: [],
      };
      item.skus.forEach(child => {
        if(child.isChecked) {
          isSelect = true;
          store.goodsInfos.push({
            spuId: child.spuId,
            skuId: child.skuId,
            skuNum: child.quantity,
            // goodsFromType: "",
            orderType: child.orderType,
            objectId: child.objectId,
            activityId: child.activityId,
          })
        }
      });
      if(!!store.goodsInfos.length) {
        goodList.push(store);
      }
    });
    if(!isSelect) {
      showToast({ title: "请选择下单商品" });
      return;
    }
    wx.setStorageSync("GOOD_LIST", goodList);
    const good = storeCartList[0].skus[0];
    router.push({
      name: "createOrder",
      data: {
        orderType: good.orderType,
        objectId: good.objectId,
        activityId: good.activityId,
      },
    })
  },
})