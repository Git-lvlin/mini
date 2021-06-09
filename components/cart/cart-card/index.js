import create from "../../../utils/create";
import store from "../../../store/good";
import { IMG_CDN } from "../../../constants/common";
import goodApi from "../../../apis/good";

create.Component(store, {
  options: {
    addGlobalClass: true,
  },

  properties: {
    store: {
      type: Object,
      value: {}
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
      if(detail.type === "add") {
        const good = {
          skuId: detail.skuId,
          quantity: detail.num,
        }
        this.store.addCart(good);
      }
      if(detail.type === "set") {
        const good = {
          skuId: detail.skuId,
          quantity: detail.num,
        }
        this.store.setCartNum(good);
      }
    }
  }
})
