import create from '../../../utils/create'
import store from '../../../store/good'
import router from '../../../utils/router'
import { showModal } from '../../../utils/tools'

create.Component(store, {
  options: {
    addGlobalClass: true
  },

  use: [
    "cartList"
  ],

  properties: {
    source: {
      type: String,
      value: "good"
    },
    good: {
      type: Object,
      value: {},
    },
    quantity: {
      type: Number,
      value: 0,
    },
    border: {
      type: Boolean,
      value: false,
    },
    width: {
      type: String,
      value: "542rpx"
    },
    canJump: {
      type: Boolean,
      value: false,
    },
    control: {
      type: Boolean,
      value: true,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    goodIsChange: false,
    nowGood: {},
  },

  /**
   * 组件的方法列表
   */
  methods: {
    addStock() {
      // let stock = this.data.good.quantity + 1;
      const {
        quantity,
        good,
      } = this.data;
      let num = 1;
      if (quantity < good.defaultSkuBuyMinNum) {
        num = good.defaultSkuBuyMinNum - quantity;
      }
      if (num >= good.defaultSkuBuyMaxNum) {
        showToast({ title: `最多购买${good.defaultSkuBuyMaxNum}` })
        return;
      }
      this.handleChangeNum(num, quantity < 1);
    },
    reduceStock() {
      const that = this;
      let {
        quantity,
        good,
      } = this.data;
      let min = good.defaultSkuBuyMinNum > 0 ? good.defaultSkuBuyMinNum : 1;
      if(quantity === min) {
        showModal({
          content: "您确定要删除该商品吗？",
          ok() {
            that.handleChangeNum(-min);
          }
        })
        return ;
      }
      this.handleChangeNum(-1);
    },
    handleChangeNum(num, showMsg) {
      let good = this.data.good;
      // this.triggerEvent("handleNum", good);
      let data = {
        spuId: good.spuId,
        skuId: good.skuId,
        quantity: num,
        orderType: good.orderType,
        goodsFromType: good.goodsFromType,
      };
      if(good.activityId) data.activityId = good.activityId;
      if(good.activityId) data.objectId = good.objectId;
      this.store.addCart(data, showMsg);
    },

    handleInputNum(event) {
      let value = event.detail.value;
    },

    onToDetail() {
      const {
        good,
        quantity,
        canJump,
      } = this.data;
      if(!canJump) return; 
      const {
        spuId,
        skuId,
        activityId,
        objectId,
        orderType,
      } = good;
      router.push({
        name: "detail",
        data: {
          spuId,
          skuId,
          activityId,
          objectId,
          orderType,
        },
      });
    },
  }
})
