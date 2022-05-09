import create from "../../../utils/create";
import store from "../../../store/good";
import { IMG_CDN } from "../../../constants/common";
import goodApi from "../../../apis/good";
import cartApi from "../../../apis/cart";
import router from "../../../utils/router";
import { showModal, showToast, getStorageUserInfo } from "../../../utils/tools";

create.Component(store, {
  options: {
    addGlobalClass: true,
  },
  properties: {
    store: {
      type: Object,
      value: {},
    },
    jump: {
      type: Boolean,
      value: false
    },
    aPrice: {
      type: String,
      value: '00'
    },
    zPrice: {
      type: String,
      value: '00'
    },
    goodNum: {
      type: Number,
      value: 0
    },
    info: {
      type: Object,
      value: {},
      observer(now, old) {
        if (now !== old) {
          now && this.infoChange(now)
        }
      }
    },
  },
  lifetimes: {
    ready() {
      let {info} = this.data;
      // 汇总数据props 异步更新 ，首次加载需要判断
      if (info && info.length) {
        this.infoChange(info)
      } else {
        this.getSummaryByCartData()
      }
      let takeSpot = wx.getStorageSync("TAKE_SPOT") || {};
      let userInfo = getStorageUserInfo();
      this.setData({
        storeNo: takeSpot?.storeNo,
        userInfo,
      }, () => {
        console.log('userInfo', this.data.userInfo)
      })
      this.getStoreInfo()
    }
  },


  data: {
    notSelectIcon: `${IMG_CDN}miniprogram/common/def_choose.png`,
    selectIcon: `${IMG_CDN}miniprogram/common/choose.png`,
    aPrice: '00',
    zPrice: '00',
    popupType: false,
    quantity: '',
    userInfo: '',
    storeInfo: '',
    selectAddressType: 2, // 2自提，3配送
    storeNo: '',
  },

  methods: {
    // 购物车商品列表汇总
    getSummaryByCartData() {
      cartApi.summaryByCartData().then((res) => {
        console.log('bottom-购物车汇总数据', res)
        this.infoChange(res)
      })
    },
    // 集约获取店铺信息
    getStoreInfo() {
      goodApi.getStoreInfo({
        orderType: 15,
        storeNo: this.data.storeNo,
      }).then(res => {
        this.setData({
          storeInfo: res
        }, () => {console.log('storeInfo', this.data.storeInfo)})
      });
    },
    dataChange({detail}) {
      this.infoChange(detail)
    },
    updateCartAll(data) {
      setData({
        info: data
      })
    },
    getSubmitData() {
      return new Promise((resolve) => {
        cartApi.cartList(params).then((res) => {
          console.log('购物车商品列表', res)
          let one = res.filter(item => item.goodsState)
          resolve(one)
        })
      })
    },
    onShowPopup() {
      this.setData({
        popupType: !this.data.popupType
      })
    },
    handleCloseToCartPopup() {
      this.triggerEvent("popup", true);
      this.setData({
        popupType: false
      })
    },
    infoChange(data) {
      if (data && data.subtotalPromotion) {
        let price = (data.subtotalPromotion/100).toString();
        let a = '';
        let z = '';
        let n = 0;
        n = data.quantity;
        if (price.includes('.')) {
          a = price.split('.')[0];
          z = price.split('.')[1];
          if (z.length < 2) {
            z = z + '0';
          }
        } else {
          a = price;
          z = '00';
        }
        this.setData({
          aPrice: a,
          zPrice: z,
          quantity: n
        })
      }
    },
    
    handleSubmitData(submitData) {
      const len = submitData.length;
      return new Promise((resolve) => {
        let goodsInfos = [];
        for(let i=0;i<len;i++) {
          let {spuId, skuId, buyMinNum, activityId, objectId, orderType, goodsFromType} = submitData[i];
          let num = buyMinNum > 0 ? buyMinNum : 1;
          let obj = {
            spuId,
            skuId,
            activityId,
            objectId,
            orderType,
            skuNum: num,
            goodsFromType,
            isActivityCome: false
          }
          goodsInfos.push(obj)
        }
        resolve(goodsInfos)
      })
    },

    async createOrder() {
      if(!this.data.userInfo) {
        getStorageUserInfo(true);
        return;
      }
      const submitData = await this.getSubmitData();
      let goodsInfos = await this.handleSubmitData(submitData);
      const {
        selectAddressType,
        storeNo,
        storeInfo,
      } = this.data;
      let data = {
        storeGoodsInfos: [{
          storeNo,
          goodsInfos,
        }]
      };
      data.storeAdress = storeInfo.storeAddress;
      data.selectAddressType = selectAddressType;
      wx.setStorageSync("CREATE_INTENSIVE", data);
      let p = {
        orderType: 15,
        activityId: '',
        objectId: '',
        isActivityCome: false,
      }
      router.push({
        name: "createOrder",
        data: p
      });
    },

    // 店铺全选
    // onChooseAll() {
    //   const {
    //     store
    //   } = this.data;
    //   goodApi.checkedAllCart({
    //     isChecked: !store.isChecked,
    //     storeNo: store.storeNo,
    //   }).then(res => {
    //     this.store.updateCart(true);
    //   })
    // },
    // 商品单选
    // onChooseGood({
    //   currentTarget
    // }) {
    //   const {
    //     id
    //   } = currentTarget.dataset;
    //   goodApi.checkedCart({
    //     skuId: id
    //   }).then(res => {
    //     this.store.updateCart(true);
    //   })
    // },
    // 商品数变化
    // handleStockChange({ detail }) {
    //   const {
    //     good,
    //   } = detail;
    //   let data = {
    //     spuId: good.spuId,
    //     skuId: good.skuId,
    //     quantity: detail.num,
    //     orderType: good.orderType,
    //     goodsFromType: good.goodsFromType,
    //   };
    //   if(good.activityId) data.activityId = good.activityId;
    //   if(good.objectId) data.objectId = good.objectId;
    //   if(detail.type === "add") {
    //     this.store.addCart(data);
    //   }
    //   if(detail.type === "set") {
    //     this.store.setCartNum(data);
    //   }
    // },
    // 用于点击阻止事件冒泡
    // onNum() {},
    // 点击跳转店铺
    onToShop() {
      const {
        store,
      } = this.data;
      let id = store.storeNo.slice(8, store.storeNo.length);
      id = +id;
      if(id < 123580) return;
      router.push({
        name: "store",
        data: {
          storeNo: store.storeNo,
        },
      })
    },
    // 跳转商详
    onToDetail({
      currentTarget,
    }) {
      const {
        good,
      } = currentTarget.dataset;
      router.push({
        name: "detail",
        data: {
          activityId: good.activityId,
          objectId: good.objectId,
          orderType: good.orderType,
          skuId: good.skuId,
          spuId: good.spuId,
        },
      })
    },
    // 点击删除商品
    // onDelete({
    //   currentTarget,
    // }) {
    //   const {
    //     good,
    //   } = currentTarget.dataset;
    //   showModal({
    //     content: "您确定要删除？",
    //     ok() {
    //       goodApi.removeCart({
    //         skuIds: [good.skuId],
    //       }).then(res => {
    //         showToast({ title: "删除成功" });
    //         store.updateCart(true);
    //       });
    //     },
    //   })
    // },
  }
})
