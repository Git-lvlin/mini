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
        quantity
      } = this.data;
      this.handleChangeNum(1, quantity < 1);
    },
    reduceStock() {
      const that = this;
      let quantity = this.data.quantity;
      if(quantity === 1) {
        showModal({
          content: "您确定要删除该商品吗？",
          ok() {
            that.handleChangeNum(-1);
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
      } = good;
      router.push({
        name: "detail",
        data: {
          spuId,
          skuId,
        },
      });
    },
  }
})
