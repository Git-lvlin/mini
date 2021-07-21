import create from "../../../utils/create";
import store from "../../../store/good";
import { IMG_CDN } from "../../../constants/common";
import goodApi from "../../../apis/good";
import router from "../../../utils/router";

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
      value: true
    }
  },

  data: {
    notSelectIcon: `${IMG_CDN}miniprogram/common/def_choose.png`,
    selectIcon: `${IMG_CDN}miniprogram/common/choose.png`,
  },

  methods: {
    // 店铺全选
    onChooseAll() {
      const {
        store
      } = this.data;
      goodApi.checkedAllCart({
        isChecked: !store.isChecked,
        storeNo: store.storeNo,
      }).then(res => {
        this.store.updateCart();
      })
    },
    // 商品单选
    onChooseGood({
      currentTarget
    }) {
      const {
        id
      } = currentTarget.dataset;
      goodApi.checkedCart({
        skuId: id
      }).then(res => {
        this.store.updateCart();
      })
    },
    // 商品数变化
    handleStockChange({ detail }) {
      const {
        good,
      } = detail;
      let data = {
        spuId: good.spuId,
        skuId: good.skuId,
        quantity: detail.num,
        orderType: good.orderType,
        goodsFromType: good.goodsFromType,
      };
      if(good.activityId) data.activityId = good.activityId;
      if(good.objectId) data.objectId = good.objectId;
      if(detail.type === "add") {
        this.store.addCart(data);
      }
      if(detail.type === "set") {
        this.store.setCartNum(data);
      }
    },
    // 点击跳转店铺
    onToShop() {
      const {
        store,
      } = this.data;
      let id = store.storeNo.slice(8, store.storeNo.length);
      id = +id;
      console.log("ShopId ~ id", id)
      if(id < 123580) return;
      // router.push({
      //   name: "store",
      //   data: {
      //     storeNo: store.storeNo,
      //   },
      // })
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
    }
  }
})
