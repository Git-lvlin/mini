import create from "../../../utils/create";
import store from "../../../store/good";

Component({

  properties: {
    num: {
      type: Number,
      value: 0,
    },
    skuId: {
      type: String,
      value: ""
    }
  },

  data: {

  },

  methods: {
    addNum() {
      let {
        num,
        skuId,
      } = this.data;
      this.triggerEvent("change", { type:"add", skuId, num: 1})
      // const good = {
      //   skuId,
      //   quantity: 1,
      // }
      // this.store.addCart(good);
    },

    reduceNum() {
      let {
        num,
        skuId,
      } = this.data;
      if(num < 2) return;
      this.triggerEvent("change", { type:"add", skuId, num: -1})
    },

    handleInput({
      detail
    }) {
      let {
        num,
        skuId,
      } = this.data;
      let nowValue = Number(detail.value) || num;
      // if(nowValue === num || nowValue < 1) return;
      // nowValue = nowValue - num;
      this.triggerEvent("change", { type: "set", skuId, num: nowValue})
    },
  }
})
